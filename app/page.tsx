'use client'

import { useState, useEffect } from 'react'
import FlightGanttChart from '../components/FlightGanttChart'
import { Aircraft, Flight } from '../types/activity'
import Link from 'next/link'

export default function Test() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [selectedDate, setSelectedDate] = useState('2025-08-18') // Monday of current week

  useEffect(() => {
    // Load test data with multiple aircraft and connected flight pairs
    const testAircraft: Aircraft[] = [
      {
        id: 1,
        type: "Airbus A380-800",
        registration: "A6-EOS",
        capacity: 615,
        status: "active",
        color: "#3b82f6"
      },
      {
        id: 2,
        type: "Boeing 777-300ER",
        registration: "A6-ENP",
        capacity: 360,
        status: "active",
        color: "#10b981"
      },
      {
        id: 3,
        type: "Airbus A350-900",
        registration: "A7-EOS",
        capacity: 325,
        status: "active",
        color: "#f59e0b"
      },
      {
        id: 4,
        type: "Boeing 787-9 Dreamliner",
        registration: "A8-EOS",
        capacity: 290,
        status: "active",
        color: "#8b5cf6"
      },
      {
        id: 5,
        type: "Airbus A330-300",
        registration: "A9-EOS",
        capacity: 277,
        status: "active",
        color: "#06b6d4"
      }
    ]

    const testFlights: Flight[] = [
      {
        id: 1,
        flightNumber: "EK456",
        aircraftId: 2,
        origin: "DXB",
        destination: "JFK",
        start_date: "2025-08-18 02:30",
        end_date: "2025-08-18 08:45",
        status: "scheduled",
        passengers: 280,
        crew: 10,
        gate: "B12",
        terminal: "3",
        flightPairId: 1,
        isReturn: false
      },
      {
        id: 2,
        flightNumber: "EK457",
        aircraftId: 2,
        origin: "JFK",
        destination: "DXB",
        start_date: "2025-08-20 10:30",
        end_date: "2025-08-21 06:45",
        status: "scheduled",
        passengers: 275,
        crew: 10,
        gate: "B15",
        terminal: "3",
        flightPairId: 1,
        isReturn: true
      },
      {
        id: 3,
        flightNumber: "EK123",
        aircraftId: 1,
        origin: "DXB",
        destination: "LHR",
        start_date: "2025-08-19 08:00",
        end_date: "2025-08-19 12:30",
        status: "scheduled",
        passengers: 350,
        crew: 12,
        gate: "A1",
        terminal: "3",
        flightPairId: 2,
        isReturn: false
      },
      {
        id: 4,
        flightNumber: "EK124",
        aircraftId: 1,
        origin: "LHR",
        destination: "DXB",
        start_date: "2025-08-21 14:00",
        end_date: "2025-08-21 22:30",
        status: "scheduled",
        passengers: 340,
        crew: 12,
        gate: "A3",
        terminal: "3",
        flightPairId: 2,
        isReturn: true
      },
      {
        id: 5,
        flightNumber: "EK789",
        aircraftId: 3,
        origin: "DXB",
        destination: "CDG",
        start_date: "2025-08-20 03:15",
        end_date: "2025-08-20 08:30",
        status: "scheduled",
        passengers: 320,
        crew: 11,
        gate: "C5",
        terminal: "3",
        flightPairId: 3,
        isReturn: false
      },
      {
        id: 6,
        flightNumber: "EK790",
        aircraftId: 3,
        origin: "CDG",
        destination: "DXB",
        start_date: "2025-08-22 10:00",
        end_date: "2025-08-22 19:15",
        status: "scheduled",
        passengers: 315,
        crew: 11,
        gate: "C8",
        terminal: "3",
        flightPairId: 3,
        isReturn: true
      },
      {
        id: 7,
        flightNumber: "EK234",
        aircraftId: 4,
        origin: "DXB",
        destination: "SIN",
        start_date: "2025-08-19 22:00",
        end_date: "2025-08-20 09:30",
        status: "scheduled",
        passengers: 290,
        crew: 10,
        gate: "E12",
        terminal: "3",
        flightPairId: 4,
        isReturn: false
      },
      {
        id: 8,
        flightNumber: "EK235",
        aircraftId: 4,
        origin: "SIN",
        destination: "DXB",
        start_date: "2025-08-21 15:00",
        end_date: "2025-08-21 17:30",
        status: "scheduled",
        passengers: 285,
        crew: 10,
        gate: "E15",
        terminal: "3",
        flightPairId: 4,
        isReturn: true
      },
      {
        id: 9,
        flightNumber: "EK567",
        aircraftId: 5,
        origin: "DXB",
        destination: "SYD",
        start_date: "2025-08-18 23:45",
        end_date: "2025-08-19 19:30",
        status: "scheduled",
        passengers: 400,
        crew: 14,
        gate: "F3",
        terminal: "3",
        flightPairId: 5,
        isReturn: false
      },
      {
        id: 10,
        flightNumber: "EK568",
        aircraftId: 5,
        origin: "SYD",
        destination: "DXB",
        start_date: "2025-08-22 22:00",
        end_date: "2025-08-23 03:15",
        status: "scheduled",
        passengers: 395,
        crew: 14,
        gate: "F6",
        terminal: "3",
        flightPairId: 5,
        isReturn: true
      }
    ]

    setAircraft(testAircraft)
    setFlights(testFlights)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Emirates Airlines - Test Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Aircraft-based flight grouping with connected pairs - Week view by default
          </p>

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <Link href="/home">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Home Dashboard
              </button>
            </Link>
            <Link href="/low">
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Low Load (4 flights)
              </button>
            </Link>
            <Link href="/medium">
              <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium">
                Medium Load (12 flights)
              </button>
            </Link>
            <Link href="/high">
              <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                High Load (31 flights)
              </button>
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Test Flight Schedule - Aircraft Grouped View
            </h2>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Flight Timeline (Week View by Default)</h3>
            <FlightGanttChart
              flights={flights}
              aircraft={aircraft}
              weatherData={{}}
              onUpdate={() => {}}
              onDelete={() => {}}
              onSwapFlights={() => {}}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
