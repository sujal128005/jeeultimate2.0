/**
 * Colleges that have a real crest in public/colleges/.
 *
 * The badge falls back to the drawn monogram for everything not listed here,
 * so this file can stay empty and the explorer still shows an icon for all of
 * them. To add a crest: save a square PNG (256px is plenty) as
 * public/colleges/<slug>.png, then run `npm run logos` to rebuild this list.
 * Use only an image the institute publishes for this purpose.
 */
export const collegeLogos = new Set<string>([]);
