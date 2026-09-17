"use client";

import { useState } from "react";
import { Card, FeatureCard, IconTile } from "@/components/cards/Card";
import { CounsellingList } from "@/components/counselling/CounsellingList";
import { Checkbox } from "@/components/forms/Checkbox";
import { Field } from "@/components/forms/Field";
import { Input } from "@/components/forms/Input";
import { Radio, RadioGroup } from "@/components/forms/Radio";
import { SearchField } from "@/components/forms/SearchField";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import { Toggle } from "@/components/forms/Toggle";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/ui/Dropdown";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { Stat } from "@/components/ui/Stat";
import { counsellingProcesses } from "@/data/counselling";
import { cn } from "@/lib/cn";

const sections = [
  ["colour", "Colour"],
  ["type", "Typography"],
  ["space", "Space & shape"],
  ["glass", "Glass"],
  ["buttons", "Buttons"],
  ["feedback", "Badges & alerts"],
  ["cards", "Cards"],
  ["forms", "Forms"],
  ["overlays", "Menus & modals"],
  ["motion", "Motion"],
  ["themes", "Themes"],
] as const;

function Block({ id, title, intro, children }: { id: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line py-section-sm first:border-t-0 first:pt-0">
      <h2 id={`${id}-title`} className="type-h2">
        {title}
      </h2>
      {intro && <p className="mt-4 max-w-measure type-body-lg text-fg-muted">{intro}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 type-label text-fg-muted">{children}</p>;
}

const semantic = [
  ["canvas", "Page"],
  ["surface", "Card"],
  ["surface-2", "Muted surface"],
  ["surface-3", "Deep muted"],
  ["contrast", "Dark slab / primary"],
  ["fg", "Text"],
  ["fg-2", "Secondary text"],
  ["fg-muted", "Muted text (AA)"],
  ["fg-subtle", "Decorative text"],
  ["accent", "Brand accent"],
  ["accent-soft", "Accent tint"],
  ["accent-text", "Accent text (AA)"],
  ["success", "Success"],
  ["warning", "Warning"],
  ["danger", "Danger"],
  ["info", "Info"],
];

const brandSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const typeScale = [
  ["type-display", "Display", "Your JEE Rank."],
  ["type-h1", "H1", "Every college, clearly listed."],
  ["type-h2", "H2", "Navigate your counselling"],
  ["type-h3", "H3", "What this guide will cover"],
  ["type-h4", "H4", "Real admission understanding"],
  ["type-lead", "Lead", "A rank is only half the story."],
  ["type-body-lg", "Body large", "Clear, human guidance for IIT, NIT, IIIT and GFTI admissions."],
  ["type-body", "Body", "Build a choice list that reflects your rank, your interests and your priorities."],
  ["type-body-sm", "Body small", "Secure sign-in arrives in the next phase."],
  ["type-caption", "Caption", "Optional. A sentence or two is plenty."],
  ["type-nav", "Navigation", "Counselling Support"],
  ["type-button", "Button", "Explore counselling"],
  ["type-label", "Label", "Planned for this space"],
  ["type-meta", "Meta", "JoSAA · 12 Sept 2026"],
];

export function DesignSystemShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("josaa");
  const [alerts, setAlerts] = useState(true);

  return (
    <div className="grid gap-12 lg:grid-cols-[200px_1fr] lg:gap-16">
      <nav aria-label="Design system sections" className="hidden lg:block">
        <ul className="sticky top-28 flex flex-col gap-1">
          {sections.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="block rounded-sm px-3 py-2 type-body-sm text-fg-muted transition-colors hover:bg-fg/[0.04] hover:text-fg">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0">
        <Block
          id="colour"
          title="Colour"
          intro="Warm neutrals carry the interface. The amber-to-orange accent is the signature, used for emphasis and never as wallpaper. Components use semantic tokens only; one --brand-hue drives the whole brand scale."
        >
          <Label>Semantic tokens</Label>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {semantic.map(([token, use]) => (
              <li key={token} className="overflow-hidden rounded-card bg-surface shadow-hairline">
                <div className="h-16 border-b border-line" style={{ background: `var(--${token})` }} />
                <div className="p-3">
                  <p className="type-meta text-fg">{token}</p>
                  <p className="type-caption text-fg-muted">{use}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Label>Brand scale · oklch, driven by --brand-hue</Label>
            <div className="flex overflow-hidden rounded-card shadow-hairline">
              {brandSteps.map((step) => (
                <div key={step} className="flex h-20 flex-1 items-end p-2" style={{ background: `var(--ju-brand-${step})` }}>
                  <span className={cn("type-meta", step >= 700 ? "text-[var(--ju-white)]" : "text-[var(--ju-black)]")}>{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 h-12 rounded-card bg-accent-gradient shadow-accent" />
          </div>
        </Block>

        <Block id="type" title="Typography" intro="Geist Sans for everything, Geist Mono for labels and data. Sizes are fluid, headings balance their lines, and body text stays under ~70 characters.">
          <ul className="divide-y divide-line">
            {typeScale.map(([cls, name, sample]) => (
              <li key={cls} className="grid gap-2 py-5 md:grid-cols-[160px_1fr] md:items-baseline md:gap-8">
                <div>
                  <p className="type-body-sm font-medium text-fg">{name}</p>
                  <p className="type-meta text-fg-muted">.{cls}</p>
                </div>
                <p className={cn(cls, "min-w-0 truncate text-fg")}>{sample}</p>
              </li>
            ))}
            <li className="grid gap-2 py-5 md:grid-cols-[160px_1fr] md:items-baseline md:gap-8">
              <div>
                <p className="type-body-sm font-medium text-fg">Statistic</p>
                <p className="type-meta text-fg-muted">.type-stat / .type-stat-xl</p>
              </div>
              <p className="flex items-baseline gap-6">
                <span className="type-stat">2023</span>
                <span className="type-stat-xl !text-[clamp(3rem,8vw,6rem)] text-accent-gradient">10,000+</span>
              </p>
            </li>
          </ul>
        </Block>

        <Block id="space" title="Space & shape" intro="A 4px base scale plus named rhythm steps. Radius grows with the size of the thing it wraps: controls are tight, sections are generous.">
          <div className="grid gap-10 xl:grid-cols-2">
            <div>
              <Label>Rhythm tokens</Label>
              <ul className="flex flex-col gap-3">
                {[
                  ["gutter", "Page side padding", "clamp(20px, 3.5vw, 32px)"],
                  ["section", "Between sections", "clamp(88px, 10vw, 144px)"],
                  ["section-sm", "Compact sections", "clamp(64px, 7vw, 96px)"],
                  ["heading-gap", "Heading → content", "clamp(48px, 6vw, 80px)"],
                  ["card-pad", "Card padding", "clamp(24px, 2.4vw, 36px)"],
                  ["grid-gap", "Card grid gap", "clamp(16px, 2vw, 24px)"],
                ].map(([token, use, value]) => (
                  <li key={token} className="flex items-center gap-4">
                    <span className="h-3 shrink-0 rounded-full bg-accent/70" style={{ width: `var(--spacing-${token})` }} />
                    <span className="min-w-0">
                      <span className="type-meta text-fg">{token}</span>
                      <span className="ml-2 type-caption text-fg-muted">
                        {use} · {value}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Label>Radius</Label>
              <div className="flex flex-wrap items-end gap-3">
                {[
                  ["xs", "8"],
                  ["sm · control", "12"],
                  ["md", "16"],
                  ["lg · card", "22"],
                  ["xl · panel", "28"],
                  ["2xl", "36"],
                  ["3xl · section", "44"],
                ].map(([name, px]) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div className="size-16 bg-surface-2 shadow-hairline" style={{ borderRadius: `${px}px` }} />
                    <span className="type-meta text-fg-muted">{name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Label>Elevation</Label>
                <div className="flex flex-wrap gap-4">
                  {["shadow-hairline", "shadow-soft", "shadow-card", "shadow-lift", "shadow-float"].map((s) => (
                    <div key={s} className={cn("grid h-20 w-28 place-items-center rounded-card bg-surface", s)}>
                      <span className="type-meta text-fg-muted">{s.replace("shadow-", "")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Block>

        <Block id="glass" title="Glass" intro="Glass creates hierarchy, not decoration: at most one prominent layer per view, plus navigation.">
          <div className="relative overflow-hidden rounded-panel bg-surface-2 p-6 md:p-10">
            <div aria-hidden className="absolute -top-10 left-10 size-48 rounded-full bg-accent-gradient opacity-80 blur-[2px]" />
            <div aria-hidden className="absolute right-10 bottom-0 size-40 rounded-full bg-contrast" />
            <div aria-hidden className="bg-grid absolute inset-0" />
            <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {(["subtle", "standard", "prominent", "nav"] as const).map((variant) => (
                <GlassPanel key={variant} variant={variant} radius="card" className="flex h-36 flex-col justify-end p-5">
                  <p className="type-body-sm font-semibold">{variant}</p>
                  <p className="type-meta text-fg-muted">.glass{variant === "standard" ? "" : `-${variant}`}</p>
                </GlassPanel>
              ))}
              <GlassPanel variant="standard" radius="card" interactive className="flex h-36 flex-col justify-end p-5 sm:col-span-1">
                <p className="type-body-sm font-semibold">interactive</p>
                <p className="type-meta text-fg-muted">hover · press</p>
              </GlassPanel>
              <GlassPanel variant="standard" radius="card" interactive active className="flex h-36 flex-col justify-end p-5">
                <p className="type-body-sm font-semibold">active</p>
                <p className="type-meta text-fg-muted">data-active</p>
              </GlassPanel>
              <div className="flex h-36 items-center justify-center rounded-card bg-contrast p-5 sm:col-span-2">
                <GlassPanel variant="dark" radius="card" className="w-full p-5 text-on-contrast">
                  <p className="type-body-sm font-semibold">dark</p>
                  <p className="type-meta text-on-contrast/60">.glass-dark · on contrast slabs</p>
                </GlassPanel>
              </div>
            </div>
          </div>
        </Block>

        <Block id="buttons" title="Buttons" intro="One Button component. Tactile press, subtle hover, visible focus, and a loading state that keeps the width steady.">
          <div className="flex flex-col gap-8">
            <div>
              <Label>Variants</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button icon="arrow-right">Primary</Button>
                <Button variant="accent" icon="arrow-right">Accent</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <GlassButton leadingIcon="compass">Glass</GlassButton>
                <Button variant="link" icon="arrow-right">Text link</Button>
              </div>
            </div>
            <div>
              <Label>Sizes & states</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
                <Button
                  variant="secondary"
                  loading={loading}
                  onClick={() => {
                    setLoading(true);
                    window.setTimeout(() => setLoading(false), 1800);
                  }}
                >
                  {loading ? "Saving…" : "Click to load"}
                </Button>
              </div>
            </div>
            <div>
              <Label>Icon buttons</Label>
              <div className="flex flex-wrap items-center gap-3">
                <IconButton icon="user" label="Profile" />
                <IconButton icon="search" label="Search" variant="secondary" />
                <IconButton icon="plus" label="Add" variant="primary" />
                <IconButton icon="settings" label="Settings" variant="outline" />
                <IconButton icon="close" label="Close" variant="ghost" />
                <IconButton icon="send" label="Send" variant="primary" loading />
              </div>
            </div>
          </div>
        </Block>

        <Block id="feedback" title="Badges & alerts">
          <Label>Badges</Label>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Neutral</Badge>
            <Badge tone="accent">National</Badge>
            <Badge tone="success" dot>Allotted</Badge>
            <Badge tone="warning" dot>Pending</Badge>
            <Badge tone="danger">Closed</Badge>
            <Badge tone="info">Round 2</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge size="md" variant="glass" tone="accent" pulse>
              Coming in the next phase
            </Badge>
          </div>
          <div className="mt-10">
            <Label>Alerts</Label>
            <Toggle label="Show alerts" checked={alerts} onCheckedChange={setAlerts} className="mb-5 max-w-xs" />
            {alerts && (
              <div className="grid gap-3 xl:grid-cols-2">
                <Alert tone="info" title="Choice filling is open">Lock your preferences before the deadline.</Alert>
                <Alert tone="success" title="Seat allotted">You can now accept your seat.</Alert>
                <Alert tone="warning" title="Documents pending">Upload your category certificate.</Alert>
                <Alert tone="danger" title="Something went wrong">Please try again in a moment.</Alert>
              </div>
            )}
          </div>
        </Block>

        <Block id="cards" title="Cards" intro="Cards are one tool among several. Prefer rows, dividers and editorial layouts when content is a list.">
          <div className="grid gap-grid-gap md:grid-cols-2 xl:grid-cols-3">
            <Card>
              <Badge>standard</Badge>
              <p className="mt-6 type-h4">Standard</p>
              <p className="mt-2 type-body text-fg-muted">Solid surface with a hairline and soft lift.</p>
            </Card>
            <Card variant="glass">
              <Badge>glass</Badge>
              <p className="mt-6 type-h4">Glass</p>
              <p className="mt-2 type-body text-fg-muted">For layering over imagery or colour.</p>
            </Card>
            <Card variant="feature">
              <FeatureCard icon="target" title="Feature">
                Icon tile lights up on hover.
              </FeatureCard>
            </Card>
            <Card variant="stat">
              <Stat value="4" label="Counselling processes" detail="JoSAA · CSAB · UPTAC · JAC Delhi" />
            </Card>
            <Card variant="interactive" href="/counselling-support">
              <div className="flex items-center justify-between">
                <IconTile icon="compass" size="sm" />
                <Icon name="arrow-up-right" className="size-4 text-fg-muted" />
              </div>
              <p className="mt-6 type-h4">Interactive</p>
              <p className="mt-2 type-body text-fg-muted">Whole card is one link.</p>
            </Card>
            <Card variant="contrast">
              <Badge tone="contrast">contrast</Badge>
              <p className="mt-6 type-h4">Contrast</p>
              <p className="mt-2 type-body text-on-contrast/70">For a single emphasised panel.</p>
            </Card>
          </div>
          <div className="mt-8 grid gap-8 xl:grid-cols-2">
            <div>
              <Label>Minimal · editorial rule</Label>
              <div className="grid gap-6 sm:grid-cols-2">
                <Card variant="minimal">
                  <p className="type-meta text-accent-text">01</p>
                  <p className="mt-2 type-h4">Understand</p>
                  <p className="mt-2 type-body text-fg-muted">Know how each counselling works.</p>
                </Card>
                <Card variant="minimal">
                  <p className="type-meta text-accent-text">02</p>
                  <p className="mt-2 type-h4">Plan</p>
                  <p className="mt-2 type-body text-fg-muted">Build a choice list that fits you.</p>
                </Card>
              </div>
            </div>
            <div>
              <Label>Counselling rows</Label>
              <CounsellingList items={counsellingProcesses.slice(0, 2)} />
            </div>
          </div>
        </Block>

        <Block id="forms" title="Forms" intro="Labels are always present, errors are announced, and every control shares one surface so forms read as a single system.">
          <div className="grid gap-10 xl:grid-cols-2">
            <div className="flex flex-col gap-5">
              <Field label="Full name" hint="As it appears on your JEE admit card.">
                <Input placeholder="Aarav Sharma" autoComplete="off" />
              </Field>
              <Field label="Email" required error="Enter a valid email address.">
                <Input type="email" defaultValue="aarav@" leadingIcon="mail" />
              </Field>
              <Field label="JEE Main CRL" disabled>
                <Input placeholder="Available after results" />
              </Field>
              <Field label="Search colleges" hideLabel>
                <SearchField placeholder="Search colleges, branches…" shortcut="/" />
              </Field>
              <Field label="Category">
                <Select
                  placeholder="Select category"
                  options={[
                    { value: "gen", label: "General" },
                    { value: "ews", label: "GEN-EWS" },
                    { value: "obc", label: "OBC-NCL" },
                    { value: "sc", label: "SC" },
                    { value: "st", label: "ST" },
                  ]}
                />
              </Field>
              <Field label="Notes" aside="0 / 300">
                <Textarea placeholder="Anything your mentor should know" maxLength={300} />
              </Field>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <Checkbox label="Remind me before choice filling closes" defaultChecked />
                <Checkbox label="Include GFTIs in my list" description="Government-funded technical institutes." />
                <Checkbox label="Disabled option" disabled />
                <Checkbox label="Accept the terms" invalid />
              </div>
              <RadioGroup label="Home state quota" defaultValue="yes">
                <Radio value="yes" label="Yes, I have a home state" defaultChecked />
                <Radio value="no" label="No / not applicable" />
              </RadioGroup>
              <RadioGroup label="Counselling" appearance="cards" value={plan} onValueChange={setPlan} orientation="horizontal">
                <Radio card value="josaa" label="JoSAA" description="IIT · NIT · IIIT · GFTI" />
                <Radio card value="csab" label="CSAB" description="Special rounds" />
              </RadioGroup>
              <div className="flex flex-col gap-4 rounded-card bg-surface p-5 shadow-hairline">
                <Toggle label="Round alerts" description="Get notified when a new round opens." defaultChecked />
                <Toggle label="Weekly digest" />
                <Toggle label="SMS updates" description="Coming soon" disabled />
              </div>
            </div>
          </div>
        </Block>

        <Block id="overlays" title="Menus & modals">
          <div className="flex flex-wrap items-start gap-4">
            <Dropdown>
              <DropdownTrigger label="Open menu" className="inline-flex h-11 items-center gap-2 rounded-full bg-surface px-5 type-button shadow-soft ring-1 ring-line">
                {(open) => (
                  <>
                    Actions
                    <Icon name="chevron-down" className={cn("size-4 transition-transform", open && "rotate-180")} />
                  </>
                )}
              </DropdownTrigger>
              <DropdownMenu label="Actions" align="start" className="w-60">
                <DropdownItem href="#overlays">
                  <Icon name="compass" className="size-4 text-fg-muted" />
                  <span className="type-body-sm">Open guide</span>
                </DropdownItem>
                <DropdownItem href="#overlays">
                  <Icon name="chart" className="size-4 text-fg-muted" />
                  <span className="type-body-sm">View cutoffs</span>
                </DropdownItem>
                <DropdownItem href="#overlays">
                  <Icon name="send" className="size-4 text-fg-muted" />
                  <span className="type-body-sm">Share</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
          </div>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Talk to a mentor"
            description="A preview of the modal pattern. Focus is trapped; Escape closes."
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>Continue</Button>
              </>
            }
          >
            <Field label="Your rank">
              <Input placeholder="e.g. 8,214" inputMode="numeric" />
            </Field>
          </Modal>
        </Block>

        <Block id="motion" title="Motion" intro="Fast in, soft out. Springs for things you move, curves for reveals. Every scroll-linked or looping animation respects reduced motion.">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["--duration-fast", "180ms", "Hover, press"],
              ["--duration-base", "300ms", "Colour, shadow"],
              ["--duration-slow", "550ms", "Page, panels"],
              ["--ease-out-soft", "(.22, 1, .36, 1)", "Default curve"],
            ].map(([token, value, use]) => (
              <AnimatedSection key={token} className="rounded-card bg-surface p-5 shadow-hairline">
                <p className="type-meta text-fg">{token}</p>
                <p className="mt-2 type-h4">{value}</p>
                <p className="mt-1 type-caption text-fg-muted">{use}</p>
              </AnimatedSection>
            ))}
          </div>
        </Block>

        <Block
          id="themes"
          title="Themes"
          intro="Every component reads semantic tokens, so a theme is just a new set of values. Below: the draft dark theme, applied with data-theme=&quot;dark&quot;."
        >
          <div data-theme="dark" className="rounded-panel bg-canvas p-6 text-fg md:p-10">
            <Eyebrow>Dark theme · draft</Eyebrow>
            <p className="mt-4 type-h3">Your rank. Your college.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Card>
                <p className="type-h4">Standard card</p>
                <p className="mt-2 type-body text-fg-muted">Same component, new tokens.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button size="sm">Primary</Button>
                  <Button size="sm" variant="outline">
                    Outline
                  </Button>
                </div>
              </Card>
              <div className="flex flex-col gap-4">
                <Field label="Email">
                  <Input placeholder="you@example.com" />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="accent">National</Badge>
                  <Badge tone="success" dot>
                    Allotted
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Block>
      </div>
    </div>
  );
}
