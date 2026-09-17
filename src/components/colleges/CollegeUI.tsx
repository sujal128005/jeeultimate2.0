"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Modal } from "@/components/ui/Modal";
import { colleges } from "@/data/colleges";
import { useCompare, COMPARE_MAX } from "@/lib/colleges/store";
import { CollegePreviewBody } from "./CollegePreview";

type Ctx = {
  openPreview: (slug: string) => void;
  notify: (message: string) => void;
  /** Toggle compare with a friendly message when the list is full */
  toggleCompare: (slug: string) => void;
};

const CollegeUIContext = createContext<Ctx | null>(null);
const noop = () => () => {};

export function useCollegeUI() {
  const ctx = useContext(CollegeUIContext);
  if (!ctx) throw new Error("useCollegeUI must be used inside <CollegeUIProvider>");
  return ctx;
}

/** Shared preview sheet and toast for college pages. */
export function CollegeUIProvider({ children }: { children: React.ReactNode }) {
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const timer = useRef<number>(0);
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const compare = useCompare();
  const college = previewSlug ? colleges.find((c) => c.slug === previewSlug) : undefined;

  const notify = useCallback((message: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const toggleCompare = useCallback(
    (slug: string) => {
      if (!compare.toggle(slug)) notify(`You can compare up to ${COMPARE_MAX} colleges. Remove one first.`);
    },
    [compare, notify],
  );

  const value = useMemo(() => ({ openPreview: setPreviewSlug, notify, toggleCompare }), [notify, toggleCompare]);
  const closePreview = useCallback(() => setPreviewSlug(null), []);

  return (
    <CollegeUIContext.Provider value={value}>
      {children}
      <Modal open={Boolean(college)} onClose={closePreview} title={college?.short ?? "College"} size="md" className="max-h-[88dvh] overflow-y-auto">
        {college && <CollegePreviewBody college={college} variant="sheet" />}
      </Modal>
      {mounted &&
        createPortal(
          <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-28 z-(--z-toast) flex justify-center px-4 md:bottom-24">
            <AnimatePresence>
              {toast && (
                <motion.p
                  key={toast.id}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="rounded-full bg-contrast px-4 py-2.5 type-body-sm text-on-contrast shadow-float"
                >
                  {toast.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </CollegeUIContext.Provider>
  );
}
