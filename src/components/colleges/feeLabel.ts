import { formatNumber } from "@/lib/format";

export const feeLabel = (fees: number | null) =>
  fees === null
    ? "Not listed"
    : fees >= 100000
      ? `₹${(fees / 100000).toFixed(2).replace(/\.?0+$/, "")}L / yr`
      : `₹${formatNumber(fees)} / yr`;
