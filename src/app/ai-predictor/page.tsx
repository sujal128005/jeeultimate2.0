import { permanentRedirect } from "next/navigation";

/**
 * The predictor was dropped before it shipped: a guess dressed up as an
 * answer is the opposite of what this site is for. Past cutoffs are the
 * honest version of the same question, so old links land there.
 */
export default function AiPredictorPage(): never {
  permanentRedirect("/previous-cutoffs");
}
