import type { NewsItem } from "@/types";

/**
 * Updates and explainers, written by us.
 *
 * Two dates per item, and they mean different things:
 *   publishedAt - the day it first went up. It never moves.
 *   checkedOn   - the day a person last read it against the official source.
 *                 Move this ONLY when that actually happens. It is a promise
 *                 to the student, not decoration.
 *
 * See `src/lib/news.ts` for the data-access layer.
 */
export const sampleNews: NewsItem[] = [
  {
    slug: "freeze-float-slide-explained",
    title: "Freeze, float or slide: choosing the right option after every round",
    excerpt:
      "The seat-acceptance option you pick after each JoSAA round shapes everything that follows. Here is a calm, practical way to think it through.",
    category: "JoSAA",
    publishedAt: "2026-09-12",
    checkedOn: "2026-09-18",
    readingMinutes: 6,
    featured: true,
    href: "/news/freeze-float-slide-explained",
    body: [
      {
        heading: "The choice nobody prepares you for",
        paragraphs: [
          "Months go into the exam. Almost nothing goes into the twenty minutes after an allotment result, when you have a seat on the screen and a dropdown asking what you want to do with it. That dropdown decides whether you keep what you have, chase something better, or end up somewhere you never considered.",
          "The options usually read Freeze, Float and Slide. They are not moods. Each one is an instruction to the system about what it may do with you in the next round, and each one closes a door you cannot reopen later.",
        ],
      },
      {
        heading: "What each option actually instructs",
        paragraphs: [
          "Freeze says: this is my seat, stop here. You are out of the running for every later round. Nothing can be taken from you and nothing better can arrive.",
          "Float says: hold this seat for me, but keep trying for anything higher on my choice list, in any institute. If something better opens up, you move and the old seat goes back into the pool.",
          "Slide says: keep me in this institute, but move me up within it if a better branch here opens. You are telling the system the campus matters more to you than the branch.",
        ],
        list: [
          "Freeze ends your participation. The seat is yours to report against.",
          "Float keeps every higher preference alive, across institutes.",
          "Slide keeps only higher preferences inside the same institute alive.",
        ],
        note: "Which options a counselling offers, and exactly what they are called, can change by year and by counselling. The business rules document published for that year is the authority, not a blog, including this one.",
      },
      {
        heading: "The question to ask yourself first",
        paragraphs: [
          "Before you touch the dropdown, answer one thing honestly: if this seat is the one you end up with, are you fine with it? Not thrilled, not resigned. Fine.",
          "If the answer is yes, and the seats above it on your list are only marginally more attractive, Freeze is a perfectly good decision and it buys you peace for the rest of the season. There is no prize for staying in the game longer.",
          "If the answer is no, and there are seats above it you would genuinely be happier with, Float is what keeps them reachable. The cost is uncertainty for a few more weeks.",
        ],
      },
      {
        heading: "Where people get burned",
        paragraphs: [
          "The first trap is floating on a choice list you no longer mean. Your list was filled before the first result. If a branch on it has stopped appealing to you, floating can move you into it, and once moved, the earlier seat is gone. Read your own list again before you float.",
          "The second trap is treating Slide as a safe middle. It is not neutral. It says the institute matters more than the branch, which is a real position to hold, but hold it deliberately.",
          "The third trap is missing the deadline. An option not submitted in time is treated as the default the rules define, and that default may not be what you would have chosen. Set an alarm for the closing time, not the closing day.",
        ],
      },
      {
        heading: "A way to decide in ten minutes",
        paragraphs: [
          "Write down the seat you have. Underneath it, write only the seats above it that you would actually swap into today. If that second list is empty, freeze. If it has entries in other institutes, float. If every entry is in the same institute you already hold, slide.",
          "Then sit with it for a few minutes and show someone you trust. The option is reversible right up to the deadline, and not one second after.",
        ],
      },
    ],
    sources: [
      { label: "JoSAA business rules and schedule", href: "https://josaa.nic.in" },
      { label: "Our JoSAA counselling guide", href: "/counselling/josaa" },
    ],
  },
  {
    slug: "csab-special-rounds-plan",
    title: "CSAB special rounds: why they deserve a place in your plan",
    excerpt: "Vacant NIT, IIIT and GFTI seats get a second life. What to know before you register.",
    category: "CSAB",
    publishedAt: "2026-09-08",
    checkedOn: "2026-09-18",
    readingMinutes: 5,
    href: "/news/csab-special-rounds-plan",
    body: [
      {
        heading: "The rounds after the rounds",
        paragraphs: [
          "When JoSAA finishes, a lot of seats are still empty. Students withdrew, students never reported, students left for a different course entirely. Those seats do not vanish. They are collected and offered again through CSAB special rounds, covering NITs, IIITs and the other centrally funded institutes, but not the IITs.",
          "For a student whose JoSAA result landed short, this is not a consolation prize. It is a genuine second allotment, run on the same JEE Main rank, against a pool that has already been thinned by everyone who is happy where they are.",
        ],
      },
      {
        heading: "It is a separate counselling, not an extension",
        paragraphs: [
          "This is the part people get wrong. CSAB is its own process with its own registration, its own fee and its own choice filling. Your JoSAA registration does not carry over, and neither does your JoSAA choice list. If you do nothing, you are not in it.",
          "That means the decision to participate has to be made before the JoSAA dust settles, because the CSAB window opens quickly and does not stay open long.",
        ],
        note: "Whether you may take part while holding a JoSAA seat, and what happens to that seat if you are allotted something new, is governed by the rules published for that year. Read them on the official site before you register, not after.",
      },
      {
        heading: "Who should seriously consider it",
        paragraphs: [
          "Three groups usually gain the most. Students who ended JoSAA with no seat at all, and have nothing to lose. Students holding a seat they took reluctantly, who would move for a better branch or a better institute. And students whose category or home state position is stronger in a thinner pool than it was in the full one.",
        ],
        list: [
          "No seat from JoSAA: there is little reason not to register.",
          "A seat you would swap: worth it, once you understand what happens to the seat you hold.",
          "A seat you are happy with: read the rules carefully before risking it.",
        ],
      },
      {
        heading: "Fill the list like it is your last one",
        paragraphs: [
          "Because it might be. The instinct in special rounds is to be conservative and list only what feels safe. That instinct costs seats. The pool has already lost its most competitive takers, so the closing ranks in these rounds can move in your favour in ways that are hard to predict from last year alone.",
          "List everything you would genuinely accept, in the order you want it, and let the system do the sorting. A choice you leave off the list is a seat you cannot be given.",
        ],
      },
      {
        heading: "Before you start",
        paragraphs: [
          "Keep the same documents you used for JoSAA within reach, keep the fee payment method ready, and set reminders for both the registration close and the reporting close. Special rounds run on a compressed calendar, and the most common way to lose a seat here is simply being late.",
        ],
      },
    ],
    sources: [
      { label: "CSAB official portal", href: "https://csab.nic.in" },
      { label: "Our CSAB counselling guide", href: "/counselling/csab" },
    ],
  },
  {
    slug: "uptac-for-jee-main-aspirants",
    title: "UPTAC counselling, explained for JEE Main aspirants",
    excerpt: "How Uttar Pradesh's state counselling works and where it fits alongside JoSAA.",
    category: "UPTAC",
    publishedAt: "2026-09-03",
    checkedOn: "2026-09-18",
    readingMinutes: 6,
    href: "/news/uptac-for-jee-main-aspirants",
    body: [
      {
        heading: "A second door, open at the same time",
        paragraphs: [
          "UPTAC is the counselling that fills B.Tech seats in Uttar Pradesh, run under AKTU. It uses your JEE Main rank, it runs alongside the national counselling, and for a student from UP it is often the difference between one offer and several.",
          "It covers the state's government institutes, the ones students name without thinking, along with a long list of affiliated private colleges. That range is the point: the same rank that is uncomfortable in JoSAA can be comfortable here.",
        ],
      },
      {
        heading: "Domicile is the hinge",
        paragraphs: [
          "If you passed Class 12 from Uttar Pradesh, or your parents are UP domiciles, you compete in the main rounds with the reservation benefits the state provides. That is the position most UPTAC students are in, and it is a strong one.",
          "If you are from outside the state, you are usually limited to the special rounds that run later, without those benefits. Worth doing if the colleges appeal to you, but go in knowing the odds are different.",
        ],
        note: "Domicile rules, the documents that prove them and the round structure are set by the counselling authority each year. Check the current brochure rather than assuming last year's rules carried over.",
      },
      {
        heading: "Where it sits next to JoSAA",
        paragraphs: [
          "Treat them as parallel, not sequential. Register for both. Fill both choice lists properly. The calendars overlap, which means a UPTAC deadline can land in the middle of a JoSAA round and it is easy to let one slide while watching the other.",
          "The practical approach is to keep one calendar with both sets of dates in it, and to decide in advance what you would do if an offer from each arrives in the same week.",
        ],
      },
      {
        heading: "Filling choices without regret",
        paragraphs: [
          "The list is long, which tempts people into two mistakes: adding colleges they would never attend just to be safe, and cutting the list short because scrolling is tiring.",
          "A better method is to sort by what your day would actually look like. Where would you live? What does the campus offer beyond the classroom? Who recruits there? Then order by that, and stop adding when you reach the first college you would decline. Everything below that line is noise.",
        ],
      },
      {
        heading: "Keep the paperwork boring",
        paragraphs: [
          "Most UPTAC problems are document problems: a domicile certificate in the wrong name, an income certificate past its validity, a category certificate in a format the state does not accept. Get those checked weeks before the round, when a correction still costs you an afternoon instead of a seat.",
        ],
      },
    ],
    sources: [
      { label: "UPTAC official portal", href: "https://uptac.admissions.nic.in" },
      { label: "Our UPTAC counselling guide", href: "/counselling/uptac" },
    ],
  },
  {
    slug: "jac-delhi-universities-compared",
    title: "JAC Delhi: understanding DTU, NSUT, IIIT-Delhi, IGDTUW and DSEU",
    excerpt: "Five universities, one counselling. A clear look at how they differ.",
    category: "JAC Delhi",
    publishedAt: "2026-08-29",
    checkedOn: "2026-09-18",
    readingMinutes: 7,
    href: "/news/jac-delhi-universities-compared",
    body: [
      {
        heading: "One form, five very different places",
        paragraphs: [
          "JAC Delhi is a joint counselling: a single registration and a single choice list covering Delhi Technological University, Netaji Subhas University of Technology, Indraprastha Institute of Information Technology Delhi, Indira Gandhi Delhi Technical University for Women and Delhi Skill and Entrepreneurship University.",
          "Because the form is shared, students often treat the institutes as interchangeable and order them by hearsay. They are not interchangeable. They differ in size, in focus, in how much of the campus is engineering, and in what the day feels like.",
        ],
      },
      {
        heading: "The Delhi region rule",
        paragraphs: [
          "The seats are split between students who passed Class 12 from a school in Delhi and students who did not, with the large majority reserved for the Delhi region. If you studied outside Delhi, you are competing for a much smaller share, and your expectations should be set accordingly.",
          "This single rule explains most of the confusion around JAC Delhi cutoffs. Two students with the same rank can see completely different outcomes, and the reason is which region they are counted in.",
        ],
        note: "The exact regional split, eligibility and the certificates that establish it are published in the JAC Delhi brochure each year. Confirm there before planning around it.",
      },
      {
        heading: "How the five differ in practice",
        paragraphs: [
          "DTU and NSUT are the large, broad engineering universities of the group, with a wide branch spread and the scale that comes with it. IIIT Delhi is smaller and computing focused, with a research heavy culture that suits students who want depth over breadth. IGDTUW is a women's technical university, also in the heart of the city. DSEU runs a skills oriented portfolio that is a different proposition again.",
          "Ordering them is not a ranking exercise. It is a fit exercise: branch availability first, then the kind of campus you want to spend four years on.",
        ],
        list: [
          "Want maximum branch choice and a big campus: look hard at DTU and NSUT.",
          "Want computing depth in a small cohort: IIIT Delhi rewards that.",
          "Want a women's technical university in central Delhi: IGDTUW.",
          "Want a skills led programme: DSEU is the one built for it.",
        ],
      },
      {
        heading: "Reading last year's ranks without fooling yourself",
        paragraphs: [
          "Closing ranks in this counselling move with the region split, with seat matrix changes and with how many students in the Delhi pool sat the exam that year. A rank that closed a branch last season is a data point, not a promise.",
          "Use past ranks to sort your list, not to decide whether to fill a choice at all. The cost of listing a choice you do not get is nothing. The cost of leaving one off is the seat.",
        ],
      },
      {
        heading: "The part students forget",
        paragraphs: [
          "Delhi is the other half of this decision. Where you will live, what the commute does to your week, what the city gives you outside the classroom. Two of these campuses are a metro ride from most of the internships in the region, and that is worth something real over four years.",
        ],
      },
    ],
    sources: [
      { label: "JAC Delhi official portal", href: "https://jacdelhi.admissions.nic.in" },
      { label: "Our JAC Delhi counselling guide", href: "/counselling/jac-delhi" },
    ],
  },
  {
    slug: "branch-or-college",
    title: "Branch or college? A practical way to decide",
    excerpt: "The oldest question in JEE counselling, broken into questions you can actually answer.",
    category: "Strategy",
    publishedAt: "2026-08-24",
    checkedOn: "2026-09-18",
    readingMinutes: 6,
    href: "/news/branch-or-college",
    body: [
      {
        heading: "Why the question feels impossible",
        paragraphs: [
          "Because it is usually asked in the abstract. Branch or college, in general, has no answer. Asked about two specific seats you can actually have, it almost always does.",
          "So stop asking which matters more. Put the two real options side by side and ask better questions about them.",
        ],
      },
      {
        heading: "Question one: is the branch one you can stand for four years?",
        paragraphs: [
          "Not love. Stand. Read the actual curriculum of the branch, semester by semester, not the two line description. Find a student in it and ask what their worst semester looked like.",
          "A branch you cannot stand at a famous institute is four years of quiet misery followed by a career pivot anyway. That pivot is common, and it is easier from a place you were happy in.",
        ],
      },
      {
        heading: "Question two: what does the institute give you outside the classroom?",
        paragraphs: [
          "Peer group, clubs, labs you can walk into, alumni who pick up the phone, companies that bother to visit. This is most of what the older institutes are actually selling, and it does not appear on any cutoff table.",
          "If the better ranked institute in front of you gives you those and the other does not, that is a real argument for the institute even with a branch you rate lower.",
        ],
        note: "Be careful comparing placement claims between institutes. Different institutes count different things. Where numbers matter to you, prefer what the institute itself files publicly over what a listing site summarises.",
      },
      {
        heading: "Question three: how open is the door to change later?",
        paragraphs: [
          "Branch change after the first year exists at many institutes, and it is usually far harder than students assume, gated by a grade threshold and by how many seats the target branch has spare. Treat it as a bonus, not a plan.",
          "Minors, double majors and electives are the more realistic route. Ask what the institute allows before you count on it.",
        ],
      },
      {
        heading: "Question four: what does your family actually need?",
        paragraphs: [
          "Fees, distance, hostel availability, the cost of flying home twice a year. These are not lesser considerations. A decision that strains the people paying for it is not a good decision, however it looks on paper.",
        ],
      },
      {
        heading: "Then decide, and stop relitigating it",
        paragraphs: [
          "Once you have answers to those four, the choice usually names itself. Write down the reason in one sentence and keep it. In October, when a friend tells you they got something better, that sentence is what stops you from spending first year wondering.",
        ],
      },
    ],
    sources: [{ label: "Talk it through with a mentor", href: "/counselling-support" }],
  },
];
