"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Checkbox } from "@/components/forms/Checkbox";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { careerCta, careerRoles } from "@/data/career";
import { submitTalentProfile, type TalentSubmitResult } from "@/lib/career/talent-network";
import { ease } from "@/lib/motion";

type Errors = Partial<Record<"name" | "email" | "role" | "link" | "consent", string>>;

const roleOptions = [
  ...careerRoles.map((r) => ({ value: r.title, label: r.title })),
  { value: "Something else", label: "Something else" },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const link = String(data.get("link") ?? "").trim();
  if (name.length < 2) errors.name = "Tell us your name.";
  if (!EMAIL.test(email)) errors.email = "Enter a valid email address.";
  if (!data.get("role")) errors.role = "Pick the closest match.";
  if (link && !/^https?:\/\/\S+\.\S+/.test(link)) errors.link = "Use a full link, starting with https://";
  if (!data.get("consent")) errors.consent = "Please confirm so we can contact you.";
  return errors;
}

/**
 * Talent network form. Uses the shared design-system controls - they
 * re-theme automatically inside the Career world.
 */
export function TalentForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<TalentSubmitResult | null>(null);
  const [firstName, setFirstName] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setPending(true);
    setFirstName(String(data.get("name")).trim().split(" ")[0]);
    const res = await submitTalentProfile({
      name: String(data.get("name")).trim(),
      email: String(data.get("email")).trim(),
      role: String(data.get("role")),
      link: String(data.get("link") ?? "").trim() || undefined,
      note: String(data.get("note") ?? "").trim() || undefined,
    });
    setPending(false);
    setResult(res);
  }

  const done = result && result.status !== "error";

  return (
    <div className="glass-dark relative overflow-hidden rounded-panel p-6 md:p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 size-72 rounded-full opacity-50 blur-3xl transition-colors duration-[1.2s]"
        style={{ background: "var(--cw-accent)" }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            role="status"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: ease.expo }}
            className="relative flex min-h-[420px] flex-col items-start justify-center gap-5"
          >
            <span className="grid size-14 place-items-center rounded-full bg-[var(--cw-chrome)] text-[var(--cw-void)]">
              <Icon name={result.status === "unavailable" ? "clock" : "check"} className="size-6" />
            </span>
            {result.status === "sent" && (
              <>
                <p className="type-h3 text-fg">You’re in, {firstName}.</p>
                <p className="type-body-lg text-fg-2">We’ll reach out when roles that fit you open.</p>
              </>
            )}
            {result.status === "mailto" && (
              <>
                <p className="type-h3 text-fg">Almost there, {firstName}.</p>
                <p className="type-body-lg text-fg-2">Your email app should have opened with everything filled in. Just hit send.</p>
              </>
            )}
            {result.status === "unavailable" && (
              <>
                <p className="type-h3 text-fg">Thanks, {firstName}. We’re nearly ready.</p>
                <p className="type-body-lg text-fg-2">
                  The talent network isn’t collecting sign-ups yet, so nothing was sent. Check back soon, we’d love to hear from you.
                </p>
              </>
            )}
            <Button variant="ghost" leadingIcon="arrow-left" onClick={() => setResult(null)} className="-ml-4">
              Back to the form
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col gap-5"
            aria-describedby="talent-form-note"
          >
            {result?.status === "error" && <Alert tone="danger">{result.message}</Alert>}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" required error={errors.name}>
                <Input name="name" autoComplete="name" placeholder="Your full name" />
              </Field>
              <Field label="Email" required error={errors.email}>
                <Input name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" />
              </Field>
            </div>
            <Field label="I build as" required error={errors.role}>
              <Select name="role" placeholder="Choose one" options={roleOptions} />
            </Field>
            <Field label="Portfolio, GitHub or LinkedIn" hint="Optional" error={errors.link}>
              <Input name="link" type="url" inputMode="url" leadingIcon="link" placeholder="https://" />
            </Field>
            <Field label="What would you build with us?" hint="Optional. A sentence or two is plenty.">
              <Textarea name="note" rows={3} maxLength={600} placeholder="An idea, a problem you’d fix, or what drives you." />
            </Field>
            <div className="flex flex-col gap-1.5">
              <Checkbox
                name="consent"
                invalid={Boolean(errors.consent)}
                label="JEE Ultimate 2.0 may contact me about opportunities."
              />
              {errors.consent && <p className="pl-8 type-caption text-danger">{errors.consent}</p>}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <Button type="submit" size="lg" icon="arrow-right" loading={pending}>
                {pending ? "Sending…" : careerCta.button}
              </Button>
              {careerCta.note && (
                <p id="talent-form-note" className="type-caption text-fg-muted">
                  {careerCta.note}
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
