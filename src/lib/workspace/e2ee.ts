/**
 * End-to-end encryption for the message room.
 *
 * Everything here runs in the browser. The server stores ciphertext, public
 * keys, and a copy of each person's private key that is already encrypted with
 * their own password, which the server never has in a usable form.
 *
 * How a message travels:
 *   1. A fresh AES-GCM key is made for that one message.
 *   2. The text, and every attachment, is encrypted with it.
 *   3. For each person who should be able to read it, that key is wrapped with
 *      a secret derived from the sender's private key and that person's public
 *      key (ECDH). Only the two ends can derive it.
 *   4. The server is handed the ciphertext and the wrapped keys, nothing else.
 *
 * What this does not hide: who messaged whom, when, and how large it was. And
 * because the browser downloads this code from our own server, it protects
 * against a stolen database or a curious host, not against someone who has
 * taken over the server itself. That is the honest limit of doing this on the
 * web, and it should not be described as more than it is.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

export const b64 = {
  from: (buf: ArrayBuffer | Uint8Array) => {
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    let out = "";
    for (const b of bytes) out += String.fromCharCode(b);
    return btoa(out);
  },
  to: (text: string) => {
    const raw = atob(text);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    return bytes;
  },
};

const random = (size: number) => crypto.getRandomValues(new Uint8Array(size));

/**
 * What actually locks a private key: the person's six digits, plus a string
 * the server derives from its own secret for that person alone.
 *
 * Six digits by themselves are a million guesses, and a million guesses is an
 * afternoon's work for anyone holding a copy of the database. The pepper is
 * not in the database, so holding the database is no longer enough. It is
 * handed out only to a browser already signed in as that person, which means
 * this defends against a stolen file, not against a server someone has taken
 * over. That distinction is the whole honest claim here.
 */
export const lockPhrase = (code: string, pepper: string) => `${code}\u0000${pepper}`;

/** Password to key. Deliberately slow, so a stolen file is not a word list away. */
async function keyFromPassword(password: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 310_000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export type Identity = { publicJwk: string; wrappedPrivate: string; salt: string };

/** A new pair of keys, with the private half locked by the person's password. */
export async function createIdentity(password: string): Promise<{ identity: Identity; privateJwk: JsonWebKey }> {
  const pair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey", "deriveBits"]);
  const publicJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  const privateJwk = await crypto.subtle.exportKey("jwk", pair.privateKey);

  const salt = random(16);
  const iv = random(12);
  const kek = await keyFromPassword(password, salt);
  const sealed = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    kek,
    enc.encode(JSON.stringify(privateJwk)),
  );

  return {
    identity: {
      publicJwk: JSON.stringify(publicJwk),
      wrappedPrivate: `${b64.from(iv)}.${b64.from(sealed)}`,
      salt: b64.from(salt),
    },
    privateJwk,
  };
}

/** Open the stored private key with the password. Wrong password, no key. */
export async function unlockIdentity(password: string, wrappedPrivate: string, salt: string): Promise<JsonWebKey | null> {
  try {
    const [ivPart, dataPart] = wrappedPrivate.split(".");
    const kek = await keyFromPassword(password, b64.to(salt));
    const opened = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64.to(ivPart) as BufferSource },
      kek,
      b64.to(dataPart) as BufferSource,
    );
    return JSON.parse(dec.decode(opened)) as JsonWebKey;
  } catch {
    return null;
  }
}

const importPrivate = (jwk: JsonWebKey) =>
  crypto.subtle.importKey("jwk", jwk, { name: "ECDH", namedCurve: "P-256" }, false, ["deriveKey"]);

const importPublic = (jwk: string) =>
  crypto.subtle.importKey("jwk", JSON.parse(jwk) as JsonWebKey, { name: "ECDH", namedCurve: "P-256" }, false, []);

/** The secret only these two ends can work out. */
async function sharedKey(privateJwk: JsonWebKey, theirPublicJwk: string) {
  return crypto.subtle.deriveKey(
    { name: "ECDH", public: await importPublic(theirPublicJwk) },
    await importPrivate(privateJwk),
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export type SealedKey = { userId: string; iv: string; data: string };
export type Sealed = { iv: string; data: string };

export type Envelope = {
  /** The sender's public key, so a reader can derive the same secret. */
  senderPublicJwk: string;
  body: Sealed | null;
  keys: SealedKey[];
};

/**
 * Lock one message for a set of readers. The sender is always one of them, or
 * they could not read their own thread.
 */
export async function sealMessage({
  privateJwk,
  senderPublicJwk,
  readers,
  body,
  files,
}: {
  privateJwk: JsonWebKey;
  senderPublicJwk: string;
  readers: { id: string; publicJwk: string }[];
  body: string;
  files: File[];
}): Promise<{ envelope: Envelope; sealedFiles: { name: string; type: string; size: number; blob: Blob; iv: string }[] }> {
  const contentKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const rawContentKey = await crypto.subtle.exportKey("raw", contentKey);

  let sealedBody: Sealed | null = null;
  if (body) {
    const iv = random(12);
    const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, contentKey, enc.encode(body));
    sealedBody = { iv: b64.from(iv), data: b64.from(data) };
  }

  const sealedFiles = [];
  for (const file of files) {
    const iv = random(12);
    const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, contentKey, await file.arrayBuffer());
    sealedFiles.push({
      name: file.name,
      type: file.type,
      size: file.size,
      iv: b64.from(iv),
      blob: new Blob([data], { type: "application/octet-stream" }),
    });
  }

  const keys: SealedKey[] = [];
  for (const reader of readers) {
    if (!reader.publicJwk) continue;
    const wrapKey = await sharedKey(privateJwk, reader.publicJwk);
    const iv = random(12);
    const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, wrapKey, rawContentKey);
    keys.push({ userId: reader.id, iv: b64.from(iv), data: b64.from(data) });
  }

  return { envelope: { senderPublicJwk, body: sealedBody, keys }, sealedFiles };
}

/** Recover the one-message key, if this reader was given one. */
export async function openContentKey(privateJwk: JsonWebKey, envelope: Envelope, myId: string) {
  const mine = envelope.keys.find((k) => k.userId === myId);
  if (!mine) return null;
  try {
    const wrapKey = await sharedKey(privateJwk, envelope.senderPublicJwk);
    const raw = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64.to(mine.iv) as BufferSource },
      wrapKey,
      b64.to(mine.data) as BufferSource,
    );
    return crypto.subtle.importKey("raw", raw, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  } catch {
    return null;
  }
}

export async function openText(key: CryptoKey, sealed: Sealed) {
  try {
    const out = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64.to(sealed.iv) as BufferSource },
      key,
      b64.to(sealed.data) as BufferSource,
    );
    return dec.decode(out);
  } catch {
    return null;
  }
}

export async function openBytes(key: CryptoKey, iv: string, bytes: ArrayBuffer) {
  try {
    return await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64.to(iv) as BufferSource }, key, bytes);
  } catch {
    return null;
  }
}

/** The private key lives in this tab only, and goes when the tab does. */
const VAULT = "ju:workspace:key";

export const vault = {
  put(jwk: JsonWebKey) {
    try {
      sessionStorage.setItem(VAULT, JSON.stringify(jwk));
    } catch {
      // Private window or storage blocked: the room will ask to unlock instead.
    }
  },
  get(): JsonWebKey | null {
    try {
      const raw = sessionStorage.getItem(VAULT);
      return raw ? (JSON.parse(raw) as JsonWebKey) : null;
    } catch {
      return null;
    }
  },
  clear() {
    try {
      sessionStorage.removeItem(VAULT);
    } catch {
      // nothing to do
    }
  },
};
