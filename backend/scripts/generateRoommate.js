import { NEIGHBORHOODS } from "../constants/neighborhoods.js";

// Typical monthly budget for one room in each neighborhood. Kept here
// (not shared with generateSublet.js) so the two features stay independent.
const AREA_BUDGET = {
  Allston: 1200,
  "Back Bay": 1750,
  "Beacon Hill": 1800,
  Brighton: 1150,
  Brookline: 1450,
  Cambridge: 1650,
  Chinatown: 1550,
  Dorchester: 1000,
  Fenway: 1500,
  "Jamaica Plain": 1150,
  Longwood: 1450,
  "Mission Hill": 1250,
  "North End": 1650,
  Roxbury: 1000,
  Somerville: 1250,
  "South End": 1600,
};

// Most students move in around the start of a semester or co-op
// (January, May, September).
const MOVE_IN_DATES = [
  "2026-12-15",
  "2027-01-01",
  "2027-01-01",
  "2027-01-01",
  "2027-01-05",
  "2027-01-15",
  "2027-02-01",
  "2027-03-01",
  "2027-05-01",
  "2027-05-01",
  "2027-05-01",
  "2027-05-15",
  "2027-06-01",
  "2027-07-01",
  "2027-08-15",
  "2027-09-01",
  "2027-09-01",
];

const SLEEP_SCHEDULES = [
  { value: "early", weight: 3 },
  { value: "late", weight: 3 },
  { value: "flexible", weight: 4 },
];

const PETS = [
  { value: "has", weight: 2 },
  { value: "ok", weight: 5 },
  { value: "no", weight: 3 },
];

const PROGRAMS = [
  "computer science",
  "data science",
  "information systems",
  "bioengineering",
  "public health",
  "business analytics",
  "mechanical engineering",
  "nursing",
  "law",
  "architecture",
  "economics",
  "psychology",
];

const BIO_PARTS = {
  intro: [
    (p) => `Hi! I'm a grad student in ${p} at Northeastern.`,
    (p) => `I'm a first-year master's student in ${p}.`,
    (p) => `I study ${p} and I'm starting a new semester in Boston.`,
    (p) => `Second-year ${p} student coming back from co-op.`,
    (p) => `I'm a PhD student in ${p} looking for a place to share.`,
  ],
  sleep: {
    early: [
      "I usually go to bed early and get up around 6.",
      "I'm an early bird and like a quiet place at night.",
    ],
    late: [
      "I'm a night owl and often study late.",
      "I stay up late but I use headphones and keep it quiet.",
    ],
    flexible: [
      "My sleep schedule is pretty flexible.",
      "I can adjust to early or late roommates.",
    ],
  },
  pets: {
    has: [
      "I have a cat, so I need a roommate who is fine with pets.",
      "I have a small, friendly dog.",
    ],
    ok: [
      "I don't have pets, but I love them.",
      "Pets are totally fine with me.",
    ],
    no: [
      "I'm allergic, so no pets please.",
      "I'd prefer a place without pets.",
    ],
  },
  smoking: {
    true: ["I smoke, but only outside."],
    false: ["I don't smoke.", "Non-smoker."],
  },
  habits: [
    "I keep shared spaces clean and like to split chores.",
    "I cook most nights and am happy to share.",
    "I'm quiet during the week and like hiking on weekends.",
    "I go to the gym in the morning and study at Snell most days.",
    "I like board games and the occasional movie night.",
    "I'm friendly but respect people's space.",
    "I work part-time on campus, so I'm out a lot.",
  ],
  looking: [
    "Looking for a clean, respectful roommate.",
    "Hoping to find someone easygoing to split a 2BR.",
    "Looking for one or two roommates to find a place together.",
    "Happy to look at apartments together.",
  ],
};

// Picks a value from [{ value, weight }].
function pick(faker, options) {
  return faker.helpers.weightedArrayElement(options);
}

// Builds one synthetic roommate profile for the given author.
export function generateRoommate(faker, author, hidden) {
  const neighborhoods = faker.helpers.arrayElements(NEIGHBORHOODS, {
    min: 1,
    max: 3,
  });
  const average =
    neighborhoods.reduce((sum, n) => sum + AREA_BUDGET[n], 0) /
    neighborhoods.length;
  const rawBudget = average + faker.number.int({ min: -300, max: 350 });
  const budget = Math.min(2200, Math.max(800, Math.round(rawBudget / 50) * 50));

  const moveInDate = new Date(faker.helpers.arrayElement(MOVE_IN_DATES));
  const sleepSchedule = pick(faker, SLEEP_SCHEDULES);
  const pets = pick(faker, PETS);
  const smoking = faker.datatype.boolean({ probability: 0.1 });

  const program = faker.helpers.arrayElement(PROGRAMS);
  const bio = [
    faker.helpers.arrayElement(BIO_PARTS.intro)(program),
    faker.helpers.arrayElement(BIO_PARTS.sleep[sleepSchedule]),
    faker.helpers.arrayElement(BIO_PARTS.pets[pets]),
    faker.helpers.arrayElement(BIO_PARTS.smoking[smoking]),
    ...faker.helpers.arrayElements(BIO_PARTS.habits, { min: 1, max: 2 }),
    faker.helpers.arrayElement(BIO_PARTS.looking),
  ]
    .join(" ")
    .slice(0, 500);

  const createdAt = faker.date.recent({ days: 60 });

  return {
    budget,
    neighborhoods,
    moveInDate,
    sleepSchedule,
    pets,
    smoking,
    bio,
    hidden,
    authorId: author._id,
    authorName: author.name,
    authorEmail: author.email,
    seeded: true,
    createdAt,
    updatedAt: createdAt,
  };
}
