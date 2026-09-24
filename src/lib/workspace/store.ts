import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { AuditAction, AuditEvent, Database, Enrolment } from "./types";
import { EMPTY_PROGRESS } from "./types";
import { buildSeed } from "./seed";

/**
 * Where the workspace keeps its records.
 *
 * One JSON file on disk, read into memory and written back under a lock. That
 * is enough for a single server and a few thousand students, and it means the
 * workspace runs the moment you clone the repo, with no database to set up.
 *
 * It is NOT enough for a serverless deployment, where each request may land on
 * a different machine with its own disk. Everything above this file talks to
 * the functions here and nothing else, so swapping in Postgres later is a
 * change to this one module.
 */

const FILE = process.env.WORKSPACE_DB_PATH ?? path.join(process.cwd(), ".data", "workspace.json");

let cache: Database | null = null;
/** The file's timestamp when `cache` was filled, so we can tell it is stale. */
let cachedAt = 0;
let chain: Promise<unknown> = Promise.resolve();

/** Serialise every write, so two requests cannot interleave a read and a save. */
function queue<T>(job: () => Promise<T>): Promise<T> {
  const run = chain.then(job, job);
  chain = run.catch(() => {});
  return run;
}

async function load(): Promise<Database> {
  // Next runs page renders and route handlers in separate workers, each with
  // its own memory. Holding the file open in one of them would let a worker
  // serve a page from records another worker has already changed, so the cache
  // is only trusted while the file on disk has not moved on.
  let mtimeMs = 0;
  try {
    mtimeMs = (await fs.stat(FILE)).mtimeMs;
  } catch {
    mtimeMs = 0;
  }

  if (cache && mtimeMs !== 0 && mtimeMs === cachedAt) return cache;

  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<Database>;
    // A file written by an older build may not have every list yet.
    cache = {
      users: parsed.users ?? [],
      enrolments: parsed.enrolments ?? [],
      audit: parsed.audit ?? [],
      messages: parsed.messages ?? [],
    };
    cachedAt = mtimeMs;
  } catch {
    cache = buildSeed();
    await save(cache);
  }
  return cache;
}

async function save(db: Database) {
  cache = db;
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  // Write beside the file and rename, so a reader never sees a half-written
  // record even if the process dies mid-save.
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, FILE);
  try {
    cachedAt = (await fs.stat(FILE)).mtimeMs;
  } catch {
    cachedAt = 0;
  }
}

export async function read(): Promise<Database> {
  return queue(load);
}

/** Read, change, write, all without another write slipping in between. */
export async function write<T>(job: (db: Database) => T | Promise<T>): Promise<T> {
  return queue(async () => {
    const db = await load();
    const result = await job(db);
    await save(db);
    return result;
  });
}

export function logEvent(
  db: Database,
  actor: { id: string; name: string },
  action: AuditAction,
  enrolmentId: string | null,
  detail: string,
) {
  const event: AuditEvent = {
    id: randomUUID(),
    actorId: actor.id,
    actorName: actor.name,
    action,
    enrolmentId,
    detail,
    createdAt: new Date().toISOString(),
  };
  db.audit.unshift(event);
  // The log is for answering "who moved this and when", not forever.
  if (db.audit.length > 5000) db.audit.length = 5000;
  return event;
}

export function blankEnrolment(seed: Partial<Enrolment> & Pick<Enrolment, "paymentRef" | "fullName" | "email">): Enrolment {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    orderRef: null,
    amountPaise: 0,
    currency: "INR",
    paidAt: now,
    planCode: null,
    manualEntry: false,
    phone: null,
    rank: null,
    category: "UNKNOWN",
    gender: "UNDISCLOSED",
    homeState: null,
    counselling: null,
    notes: null,
    status: "PAID",
    mentorId: null,
    assignedAt: null,
    assignedById: null,
    progress: { ...EMPTY_PROGRESS },
    createdAt: now,
    updatedAt: now,
    ...seed,
  };
}

/** Where an attachment's bytes live, beside the records file. */
export const UPLOAD_DIR = process.env.WORKSPACE_UPLOAD_PATH ?? path.join(path.dirname(FILE), "uploads");

export async function saveUpload(id: string, bytes: Buffer) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, id), bytes);
}

export async function readUpload(id: string) {
  // Ids are generated here and never taken from a request path unchecked, but
  // strip anything path-like anyway before touching the disk.
  const safe = id.replace(/[^a-zA-Z0-9-]/g, "");
  if (!safe) throw new Error("bad id");
  return fs.readFile(path.join(UPLOAD_DIR, safe));
}

/** Only for tests and for the "reset demo data" action. */
export async function resetToSeed() {
  return queue(async () => {
    const fresh = buildSeed();
    await save(fresh);
    return fresh;
  });
}
