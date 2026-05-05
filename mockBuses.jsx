// ─── MOCK BUS DATA ───────────────────────────────────────────────────────────
// This file replaces the broken API call. All routes work with any date.

export const OPERATORS = [
  { id: 1, name: 'Daewoo Express',   logo: '🟦', rating: 4.8 },
  { id: 2, name: 'Faisal Movers',   logo: '🟥', rating: 4.5 },
  { id: 3, name: 'Skyways',         logo: '🟨', rating: 4.3 },
  { id: 4, name: 'Bilal Travels',   logo: '🟩', rating: 4.1 },
];

// Route-specific schedules (departure/arrival hours per route pair)
const ROUTE_SCHEDULES = {
  default: [
    { depHour: 7,  depMin: 0,  durHours: 5,  durMins: 30, type: 'AC',      operatorIdx: 0, price: 2500, seats: 40 },
    { depHour: 9,  depMin: 30, durHours: 5,  durMins: 45, type: 'NonAC',   operatorIdx: 1, price: 1800, seats: 45 },
    { depHour: 14, depMin: 0,  durHours: 6,  durMins: 0,  type: 'Sleeper', operatorIdx: 2, price: 3200, seats: 30 },
    { depHour: 22, depMin: 0,  durHours: 5,  durMins: 0,  type: 'AC',      operatorIdx: 3, price: 2700, seats: 38 },
  ],
  'Lahore-Karachi': [
    { depHour: 6,  depMin: 0,  durHours: 14, durMins: 0,  type: 'AC',      operatorIdx: 0, price: 4500, seats: 40 },
    { depHour: 8,  depMin: 30, durHours: 14, durMins: 30, type: 'NonAC',   operatorIdx: 1, price: 3200, seats: 45 },
    { depHour: 19, depMin: 0,  durHours: 13, durMins: 30, type: 'Sleeper', operatorIdx: 2, price: 5500, seats: 30 },
    { depHour: 21, depMin: 0,  durHours: 14, durMins: 0,  type: 'AC',      operatorIdx: 3, price: 4800, seats: 38 },
  ],
  'Islamabad-Lahore': [
    { depHour: 7,  depMin: 0,  durHours: 4,  durMins: 30, type: 'AC',      operatorIdx: 0, price: 1500, seats: 40 },
    { depHour: 10, depMin: 0,  durHours: 4,  durMins: 45, type: 'NonAC',   operatorIdx: 1, price: 1100, seats: 45 },
    { depHour: 14, depMin: 30, durHours: 4,  durMins: 30, type: 'AC',      operatorIdx: 2, price: 1600, seats: 35 },
    { depHour: 20, depMin: 0,  durHours: 4,  durMins: 0,  type: 'Sleeper', operatorIdx: 3, price: 2200, seats: 30 },
  ],
  'Karachi-Islamabad': [
    { depHour: 5,  depMin: 30, durHours: 15, durMins: 0,  type: 'AC',      operatorIdx: 0, price: 4800, seats: 40 },
    { depHour: 7,  depMin: 0,  durHours: 15, durMins: 30, type: 'NonAC',   operatorIdx: 1, price: 3400, seats: 45 },
    { depHour: 18, depMin: 0,  durHours: 14, durMins: 30, type: 'Sleeper', operatorIdx: 2, price: 5800, seats: 30 },
    { depHour: 20, depMin: 0,  durHours: 15, durMins: 0,  type: 'AC',      operatorIdx: 3, price: 5000, seats: 38 },
  ],
  'Lahore-Multan': [
    { depHour: 8,  depMin: 0,  durHours: 4,  durMins: 0,  type: 'AC',      operatorIdx: 0, price: 1300, seats: 40 },
    { depHour: 11, depMin: 0,  durHours: 4,  durMins: 15, type: 'NonAC',   operatorIdx: 1, price: 950,  seats: 45 },
    { depHour: 15, depMin: 0,  durHours: 4,  durMins: 0,  type: 'AC',      operatorIdx: 2, price: 1400, seats: 35 },
    { depHour: 21, depMin: 0,  durHours: 3,  durMins: 45, type: 'Sleeper', operatorIdx: 3, price: 1900, seats: 30 },
  ],
};

// Generates seat layout for a bus (40 seats = 10 rows × 4 seats)
export function generateSeats(totalSeats = 40, bookedPercent = 0.3) {
  const seats = [];
  const rows = Math.ceil(totalSeats / 4);
  const rowLabels = 'ABCDEFGHIJ'.split('');
  let id = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= 4; c++) {
      if (id > totalSeats) break;
      seats.push({
        id,
        seatNumber: `${rowLabels[r]}${c}`,
        status: Math.random() < bookedPercent ? 'booked' : 'available',
      });
      id++;
    }
  }
  return seats;
}

// Main function: returns 4 buses for any from/to/date combination
export function searchBuses(from, to, date) {
  const normalize = (s) => s.trim().toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());

  const normFrom = normalize(from);
  const normTo   = normalize(to);
  const routeKey = `${normFrom}-${normTo}`;

  const templates = ROUTE_SCHEDULES[routeKey] || ROUTE_SCHEDULES.default;

  return templates.map((t, idx) => {
    const operator  = OPERATORS[t.operatorIdx];
    const depDate   = new Date(`${date}T00:00:00`);
    depDate.setHours(t.depHour, t.depMin, 0, 0);

    const arrDate = new Date(depDate);
    arrDate.setHours(arrDate.getHours() + t.durHours);
    arrDate.setMinutes(arrDate.getMinutes() + t.durMins);

    // Slightly randomise available seats per result
    const availableSeats = t.seats - Math.floor(Math.random() * 8);

    return {
      id: idx + 1,
      bus: {
        id: operator.id,
        name: operator.name,
        type: t.type,
        logo: operator.logo,
        rating: operator.rating,
        totalSeats: t.seats,
      },
      route: { origin: normFrom, destination: normTo },
      departureTime: depDate.toISOString(),
      arrivalTime:   arrDate.toISOString(),
      price: t.price,
      availableSeats,
      seats: generateSeats(t.seats),
    };
  });
}