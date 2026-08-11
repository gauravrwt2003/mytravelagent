// Multi-Modal Transit Data Generator & Search Engine (INR Currency)

const AIRLINES = [
  { name: "RoamingBuddy Express", code: "RB", logo: "✈️", rating: 4.8 },
  { name: "IndiGo Express", code: "6E", logo: "🛫", rating: 4.7 },
  { name: "Air India Connect", code: "AI", logo: "✈️", rating: 4.6 }
];

const RAIL_OPERATORS = [
  { name: "Vande Bharat Express", code: "VB", logo: "🚆", rating: 4.9 },
  { name: "Rajdhani Superfast", code: "RJ", logo: "🚆", rating: 4.8 },
  { name: "Shatabdi Express", code: "SH", logo: "🚄", rating: 4.7 }
];

const BUS_OPERATORS = [
  { name: "RoamingBuddy Volvo AC Sleeper", code: "RBV", logo: "🚌", rating: 4.9 },
  { name: "Zingbus Multi-Axle", code: "ZB", logo: "🚍", rating: 4.7 },
  { name: "IntrCity SmartBus", code: "IC", logo: "🚌", rating: 4.8 }
];

export function searchTransitOptions(params) {
  const { source, destination, departureDate, preferredTimeRange = 'any', mode = 'all' } = params;
  
  let results = [];

  if (mode === 'all' || mode === 'flight') {
    results.push(...generateFlightOptions(source, destination, departureDate));
  }
  if (mode === 'all' || mode === 'train') {
    results.push(...generateTrainOptions(source, destination, departureDate));
  }
  if (mode === 'all' || mode === 'bus') {
    results.push(...generateBusOptions(source, destination, departureDate));
  }

  if (preferredTimeRange !== 'any') {
    results = results.filter(item => {
      const hour = parseInt(item.departureTime.split(':')[0], 10);
      if (preferredTimeRange === 'morning') return hour >= 6 && hour < 12;
      if (preferredTimeRange === 'afternoon') return hour >= 12 && hour < 17;
      if (preferredTimeRange === 'evening') return hour >= 17 && hour < 22;
      if (preferredTimeRange === 'night') return hour >= 22 || hour < 6;
      return true;
    });
  }

  return results.sort((a, b) => a.price - b.price);
}

function generateFlightOptions(src, dest, date) {
  return [
    {
      id: `flight-1-${src}-${dest}`,
      mode: "flight",
      provider: AIRLINES[0].name,
      providerLogo: AIRLINES[0].logo,
      code: `${AIRLINES[0].code}-402`,
      source: src,
      destination: dest,
      departureTime: "07:30",
      arrivalTime: "09:45",
      duration: "2h 15m",
      price: 3850,
      currency: "INR",
      availableSeats: 9,
      classType: "Economy Flexible",
      amenities: ["Free WiFi", "In-Flight Meal", "USB Power"],
      date: date
    },
    {
      id: `flight-2-${src}-${dest}`,
      mode: "flight",
      provider: AIRLINES[1].name,
      providerLogo: AIRLINES[1].logo,
      code: `${AIRLINES[1].code}-819`,
      source: src,
      destination: dest,
      departureTime: "13:15",
      arrivalTime: "15:40",
      duration: "2h 25m",
      price: 4250,
      currency: "INR",
      availableSeats: 4,
      classType: "Saver Fare",
      amenities: ["In-Flight Snack", "USB Power"],
      date: date
    },
    {
      id: `flight-3-${src}-${dest}`,
      mode: "flight",
      provider: AIRLINES[2].name,
      providerLogo: AIRLINES[2].logo,
      code: `${AIRLINES[2].code}-990`,
      source: src,
      destination: dest,
      departureTime: "18:45",
      arrivalTime: "20:55",
      duration: "2h 10m",
      price: 6800,
      currency: "INR",
      availableSeats: 12,
      classType: "Business Class Lounge",
      amenities: ["Gourmet Dining", "Extra Legroom", "Recliner Seat"],
      date: date
    }
  ];
}

function generateTrainOptions(src, dest, date) {
  return [
    {
      id: `train-1-${src}-${dest}`,
      mode: "train",
      provider: RAIL_OPERATORS[0].name,
      providerLogo: RAIL_OPERATORS[0].logo,
      code: `${RAIL_OPERATORS[0].code}-20901`,
      source: src,
      destination: dest,
      departureTime: "06:00",
      arrivalTime: "11:30",
      duration: "5h 30m",
      price: 1450,
      currency: "INR",
      availableSeats: 18,
      classType: "Executive Chair Car (EC)",
      amenities: ["Hot Breakfast", "Power Sockets", "Speedy WiFi"],
      date: date
    },
    {
      id: `train-2-${src}-${dest}`,
      mode: "train",
      provider: RAIL_OPERATORS[1].name,
      providerLogo: RAIL_OPERATORS[1].logo,
      code: `${RAIL_OPERATORS[1].code}-12952`,
      source: src,
      destination: dest,
      departureTime: "16:20",
      arrivalTime: "21:10",
      duration: "4h 50m",
      price: 2150,
      currency: "INR",
      availableSeats: 6,
      classType: "1st AC Sleeper Coupe",
      amenities: ["Bed Linen", "Dinner Included", "Quiet Zone"],
      date: date
    },
    {
      id: `train-3-${src}-${dest}`,
      mode: "train",
      provider: RAIL_OPERATORS[2].name,
      providerLogo: RAIL_OPERATORS[2].logo,
      code: `${RAIL_OPERATORS[2].code}-12004`,
      source: src,
      destination: dest,
      departureTime: "22:15",
      arrivalTime: "05:45",
      duration: "7h 30m",
      price: 850,
      currency: "INR",
      availableSeats: 24,
      classType: "3AC Tier Berth",
      amenities: ["Pillow & Blanket", "Charging Port"],
      date: date
    }
  ];
}

function generateBusOptions(src, dest, date) {
  return [
    {
      id: `bus-1-${src}-${dest}`,
      mode: "bus",
      provider: BUS_OPERATORS[0].name,
      providerLogo: BUS_OPERATORS[0].logo,
      code: `${BUS_OPERATORS[0].code}-RB99`,
      source: src,
      destination: dest,
      departureTime: "21:30",
      arrivalTime: "05:00",
      duration: "7h 30m",
      price: 950,
      currency: "INR",
      availableSeats: 12,
      classType: "AC Volvo Multi-Axle Sleeper",
      amenities: ["Flat Berth", "Charging Socket", "Live GPS"],
      date: date
    },
    {
      id: `bus-2-${src}-${dest}`,
      mode: "bus",
      provider: BUS_OPERATORS[1].name,
      providerLogo: BUS_OPERATORS[1].logo,
      code: `${BUS_OPERATORS[1].code}-ZB77`,
      source: src,
      destination: dest,
      departureTime: "08:00",
      arrivalTime: "14:30",
      duration: "6h 30m",
      price: 650,
      currency: "INR",
      availableSeats: 14,
      classType: "AC Seater 2+1",
      amenities: ["Free WiFi", "Water Bottle"],
      date: date
    }
  ];
}
