import { NEIGHBORHOODS } from "../constants/neighborhoods.js";

// Typical monthly rent for one room and minutes to Northeastern by transit.
const AREA = {
  Allston: { rent: 1300, commute: 30 },
  "Back Bay": { rent: 1900, commute: 15 },
  "Beacon Hill": { rent: 2000, commute: 22 },
  Brighton: { rent: 1250, commute: 35 },
  Brookline: { rent: 1600, commute: 25 },
  Cambridge: { rent: 1800, commute: 30 },
  Chinatown: { rent: 1700, commute: 18 },
  Dorchester: { rent: 1100, commute: 35 },
  Fenway: { rent: 1650, commute: 8 },
  "Jamaica Plain": { rent: 1250, commute: 22 },
  Longwood: { rent: 1600, commute: 10 },
  "Mission Hill": { rent: 1350, commute: 8 },
  "North End": { rent: 1800, commute: 30 },
  Roxbury: { rent: 1100, commute: 12 },
  Somerville: { rent: 1350, commute: 40 },
  "South End": { rent: 1750, commute: 15 },
};

// Most sublets start around the start of a semester or co-op
// (January, May, September).
const START_DATES = [
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
  "2027-09-01",
  "2027-09-01",
];

// Weighted: 4 months (a semester) and 6 months (a co-op) are most common.
const LENGTHS_IN_MONTHS = [2, 3, 3, 4, 4, 4, 4, 5, 6, 6, 6, 6, 7, 8];

const ROOM_TYPES = [
  "Private room",
  "Furnished room",
  "Room in a 3BR",
  "Room in a 2BR",
  "Studio",
  "Large bedroom",
  "Master bedroom",
  "Cozy room",
  "Sunny room",
  "Quiet room",
];

const DESCRIPTION_PARTS = {
  intro: [
    "I'm leaving for a co-op and need someone to take my room.",
    "I'm going abroad next semester and looking for a subletter.",
    "Subletting my room while I'm away on co-op.",
    "Looking for someone to take over my room for a few months.",
    "My roommates are staying, so I need a subletter for my room.",
  ],
  place: [
    "The apartment is on the second floor of a quiet building.",
    "The room gets a lot of sun and has a big closet.",
    "Shared kitchen and bathroom are cleaned every week.",
    "The building has laundry in the basement.",
    "The apartment has a dishwasher and in-unit laundry.",
    "There is a small desk and good Wi-Fi for studying.",
  ],
  roommates: [
    "My roommates are Northeastern grad students and are friendly and quiet.",
    "You will share the place with two other students.",
    "Roommates are clean and usually busy with classes.",
    "Roommates work during the day, so it is quiet.",
  ],
  extra: [
    "Utilities are included in the rent.",
    "Utilities are about $60 a month, split evenly.",
    "Close to the Green Line and several bus stops.",
    "Grocery stores and cafes are a short walk away.",
    "No smoking inside, please.",
    "Dates are a little flexible, just ask.",
  ],
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function addMonthsUTC(date, months) {
  const d = new Date(date);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
}

// Builds one synthetic listing for the given author.
export function generateSublet(faker, author, index) {
  const neighborhood = faker.helpers.arrayElement(NEIGHBORHOODS);
  const area = AREA[neighborhood];

  const startDate = new Date(faker.helpers.arrayElement(START_DATES));
  const months = faker.helpers.arrayElement(LENGTHS_IN_MONTHS);
  // End the day before the same date `months` later (Jan 1 -> Jun 30).
  const endDate = addMonthsUTC(startDate, months);
  endDate.setUTCDate(endDate.getUTCDate() - 1);

  const rawRent = area.rent + faker.number.int({ min: -350, max: 450 });
  const rent = Math.min(3200, Math.max(900, Math.round(rawRent / 25) * 25));
  const commuteMinutes = Math.max(
    3,
    area.commute + faker.number.int({ min: -4, max: 8 }),
  );
  const furnished = faker.datatype.boolean({ probability: 0.65 });

  const roomType = faker.helpers.arrayElement(ROOM_TYPES);
  const range = `${MONTHS[startDate.getUTCMonth()]}–${MONTHS[endDate.getUTCMonth()]}`;
  const title = `${roomType} in ${neighborhood}, ${range}`;

  const description = [
    faker.helpers.arrayElement(DESCRIPTION_PARTS.intro),
    ...faker.helpers.arrayElements(DESCRIPTION_PARTS.place, { min: 1, max: 2 }),
    faker.helpers.arrayElement(DESCRIPTION_PARTS.roommates),
    ...faker.helpers.arrayElements(DESCRIPTION_PARTS.extra, { min: 1, max: 2 }),
    furnished
      ? "The room comes with a bed, desk and dresser."
      : "The room is unfurnished.",
  ].join(" ");

  const createdAt = faker.date.recent({ days: 60 });

  return {
    title,
    neighborhood,
    rent,
    startDate,
    endDate,
    furnished,
    commuteMinutes,
    photoUrl: `https://picsum.photos/seed/subletboard-${index}/600/400`,
    description,
    status: faker.datatype.boolean({ probability: 0.15 })
      ? "rented"
      : "available",
    authorId: author._id,
    authorName: author.name,
    authorEmail: author.email,
    seeded: true,
    createdAt,
    updatedAt: createdAt,
  };
}
