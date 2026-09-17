import { redirect } from "next/navigation";

/** Old address. The college explorer now lives at /colleges. */
export default function CollegeListsRedirect() {
  redirect("/colleges");
}
