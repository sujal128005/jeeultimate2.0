/**
 * What students and parents have said, in their own words.
 *
 * Only add a review here when the person has given it to us to publish. Never
 * write one, never tidy the wording into something they did not say, and never
 * invent a name or a college to go with it.
 */

export type Testimonial = {
  id: string;
  /** The heading they gave it, if any */
  title?: string;
  /** Their words, paragraph by paragraph */
  body: string[];
  name: string;
  /** Where they ended up, as they told it to us */
  college: string;
  /** Out of five, as they rated it */
  stars: 5 | 4 | 3 | 2 | 1;
  /** Who wrote it: a student, or a parent writing about their child */
  voice: "student" | "parent";
};

export const testimonials: Testimonial[] = [
  {
    id: "namish-rane",
    title: "A truly excellent experience with JEE Ultimate 2.0",
    body: [
      "Our experience with JEE Ultimate 2.0 has been excellent and extremely reassuring. The counsellors provide timely and consistent guidance through text messages, schedules, audio sessions, and videos, which makes the entire JEE counselling and admission process much easier to understand.",
      "For parents, this kind of reliable guidance is invaluable. It helps avoid confusion, misinformation, and unnecessary last-minute panic during such a crucial phase of a student's career.",
      "What impressed us most is the excellent support at a very minimal and affordable fee. The guidance is practical, timely, and genuinely helpful.",
      "A heartfelt thank you to the entire JEE Ultimate 2.0 team for your continuous support, guidance, and dedication. We are extremely happy with our experience and would definitely recommend JEE Ultimate 2.0 to students and parents looking for trustworthy guidance throughout the JEE journey.",
    ],
    name: "Namish Rane",
    college: "NIT Rourkela",
    stars: 5,
    voice: "parent",
  },
];
