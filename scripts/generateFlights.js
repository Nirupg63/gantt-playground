// Script to generate increased flight data
// Run with: node scripts/generateFlights.js

const fs = require('fs');
const path = require('path');

// Base aircraft data
const baseAircraft = [
  { id: 1, type: "Airbus A380-800", registration: "A6-EOS", capacity: 615, status: "active", color: "#3b82f6" },
  { id: 2, type: "Boeing 777-300ER", registration: "A6-ENP", capacity: 360, status: "active", color: "#10b981" },
  { id: 3, type: "Airbus A350-900", registration: "A7-EOS", capacity: 325, status: "active", color: "#f59e0b" },
  { id: 4, type: "Boeing 787-9 Dreamliner", registration: "A8-EOS", capacity: 290, status: "active", color: "#8b5cf6" },
  { id: 5, type: "Airbus A330-300", registration: "A9-EOS", capacity: 277, status: "active", color: "#06b6d4" }
];

// Destinations for variety
const destinations = [
  "LHR", "CDG", "JFK", "LAX", "SIN", "HKG", "NRT", "SYD", "BKK", "ICN",
  "BOM", "DEL", "KUL", "CGK", "MNL", "DAC", "FRA", "AMS", "MAD", "ZRH"
];

function generateFlights(count, aircraftCount = 5) {
  const flights = [];
  let flightId = 1;
  let pairId = 1;
  
  for (let i = 0; i < count; i += 2) {
    const aircraftId = (i % aircraftCount) + 1;
    const origin = "DXB";
    const destination = destinations[i % destinations.length];
    
    // Outbound flight
    const outboundDate = new Date('2025-08-18');
    outboundDate.setDate(outboundDate.getDate() + Math.floor(i / 10));
    const outboundStart = new Date(outboundDate);
    outboundStart.setHours(8 + (i % 16), (i * 15) % 60);
    const outboundEnd = new Date(outboundStart);
    outboundEnd.setHours(outboundStart.getHours() + 4 + (i % 8));
    
    // Return flight
    const returnStart = new Date(outboundEnd);
    returnStart.setHours(returnStart.getHours() + 2);
    const returnEnd = new Date(returnStart);
    returnEnd.setHours(returnStart.getHours() + 4 + (i % 8));
    
    flights.push({
      id: flightId++,
      flightNumber: `EK${100 + i}`,
      aircraftId,
      origin,
      destination,
      start_date: outboundStart.toISOString().slice(0, 16).replace('T', ' '),
      end_date: outboundEnd.toISOString().slice(0, 16).replace('T', ' '),
      status: "scheduled",
      passengers: 200 + (i % 300),
      crew: 8 + (i % 8),
      gate: `A${(i % 20) + 1}`,
      terminal: "3",
      flightPairId: pairId,
      isReturn: false
    });
    
    flights.push({
      id: flightId++,
      flightNumber: `EK${101 + i}`,
      aircraftId,
      origin: destination,
      destination: origin,
      start_date: returnStart.toISOString().slice(0, 16).replace('T', ' '),
      end_date: returnEnd.toISOString().slice(0, 16).replace('T', ' '),
      status: "scheduled",
      passengers: 200 + (i % 300),
      crew: 8 + (i % 8),
      gate: `B${(i % 20) + 1}`,
      terminal: "3",
      flightPairId: pairId,
      isReturn: true
    });
    
    pairId++;
  }
  
  return flights;
}

// Generate data for different loads
const lowFlights = generateFlights(100, 5);
const mediumFlights = generateFlights(300, 10);
const highFlights = generateFlights(1000, 20);

// Write to files
const dataDir = path.join(__dirname, '../app/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(dataDir, 'lowFlights.ts'),
  `import { Flight } from '../../types/activity';\n\nexport const lowFlights: Flight[] = ${JSON.stringify(lowFlights, null, 2)};`
);

fs.writeFileSync(
  path.join(dataDir, 'mediumFlights.ts'),
  `import { Flight } from '../../types/activity';\n\nexport const mediumFlights: Flight[] = ${JSON.stringify(mediumFlights, null, 2)};`
);

fs.writeFileSync(
  path.join(dataDir, 'highFlights.ts'),
  `import { Flight } from '../../types/activity';\n\nexport const highFlights: Flight[] = ${JSON.stringify(highFlights, null, 2)};`
);

console.log('Generated flight data:');
console.log(`- Low: ${lowFlights.length} flights`);
console.log(`- Medium: ${mediumFlights.length} flights`);
console.log(`- High: ${highFlights.length} flights`);
