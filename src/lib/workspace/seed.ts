import { randomUUID } from "node:crypto";
import { hashPassword } from "./password";
import type { Database, User } from "./types";

/**
 * The workspace starts empty.
 *
 * Counselling has not begun, so there are no students to show, and inventing
 * some would mean every number on every screen is a lie until the first real
 * payment lands. Empty screens say "nothing yet" and mean it.
 *
 * What is seeded is the people who work here, each with a six-digit code.
 * Set WORKSPACE_SEED_PIN before the first run, and change each person's code
 * after they have signed in once.
 */

const SEED_PIN = process.env.WORKSPACE_SEED_PIN ?? "000000";

const PEOPLE: Pick<User, "email" | "name" | "role" | "active">[] = [
  { email: "shivam@jeeultimate.in", name: "Shivam Raj", role: "OWNER", active: true },
  { email: "ashu@jeeultimate.in", name: "Ashu Kumar", role: "MANAGER", active: true },
  { email: "sujal@jeeultimate.in", name: "Sujal Negi", role: "ANALYST", active: true },
  { email: "mentor1@jeeultimate.in", name: "Mentor 1", role: "MENTOR", active: true },
  { email: "mentor2@jeeultimate.in", name: "Mentor 2", role: "MENTOR", active: true },
  { email: "mentor3@jeeultimate.in", name: "Mentor 3", role: "MENTOR", active: true },
];

export function buildSeed(): Database {
  const createdAt = new Date().toISOString();

  const users: User[] = PEOPLE.map((p) => ({
    ...p,
    id: randomUUID(),
    passwordHash: hashPassword(SEED_PIN),
    createdAt,
    avatarId: null,
    about: null,
    // Message keys are made in the browser the first time each person logs
    // in, because only their browser ever sees the code that locks them.
    publicJwk: null,
    wrappedPrivate: null,
    keySalt: null,
  }));

  return { users, enrolments: [], audit: [], messages: [] };
}
