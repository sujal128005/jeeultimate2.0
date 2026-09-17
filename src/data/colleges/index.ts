import gftis1 from "./raw/gftis-1.json";
import gftis2 from "./raw/gftis-2.json";
import iiits from "./raw/iiits.json";
import iits from "./raw/iits.json";
import nits from "./raw/nits.json";
import state from "./raw/state.json";
import { normalizeColleges, type RawCollege } from "@/lib/colleges/model";

/**
 * All colleges, from the research files in ./raw (one JSON array per group).
 * To add or update colleges, replace a file in ./raw with the new research
 * output (same field names). Nothing else needs to change.
 */
export const colleges = normalizeColleges([
  ...(iits as RawCollege[]),
  ...(nits as RawCollege[]),
  ...(iiits as RawCollege[]),
  ...(gftis1 as RawCollege[]),
  ...(gftis2 as RawCollege[]),
  ...(state as RawCollege[]),
]);

/** Groups still being researched. Shown as a small note until empty. */
export const collegesPending = [
  nits.length === 0 && "NITs",
  iiits.length === 0 && "IIITs",
  gftis1.length + gftis2.length === 0 && "GFTIs",
].filter(Boolean) as string[];

/** JoSAA 2026 participating institutes (official). Every CSAB institute is one of these. */
const JOSAA_INSTITUTES_2026 = 138;

/**
 * Total institutes across JoSAA/CSAB, JAC Delhi and UPTAC. Uses the official
 * JoSAA figure until every JoSAA institute is in the dataset.
 */
export const institutesCovered = (() => {
  const josaa = colleges.filter((c) => c.counselling.includes("josaa")).length;
  const others = colleges.filter((c) => !c.counselling.includes("josaa")).length;
  return Math.max(josaa, JOSAA_INSTITUTES_2026) + others;
})();
