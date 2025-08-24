'use client'

import { useState, useEffect } from 'react'
import FlightGanttChart from '../../components/FlightGanttChart'
import { Aircraft, Flight } from '../../types/activity'
import Link from 'next/link'

export default function Home() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [selectedDate, setSelectedDate] = useState('2025-08-18')

  useEffect(() => {
    // Load sample data for home page
    const sampleAircraft: Aircraft[] = [
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
      }
    ]

    const sampleFlights: Flight[] = [
      {
        id: 1,
        flightNumber: "EK123",
        aircraftId: 1,
        origin: "DXB",
        destination: "LHR",
        start_date: "2025-08-15 08:00",
        end_date: "2025-08-15 12:30",
        status: "scheduled",
        passengers: 350,
        crew: 12,
        gate: "A1",
        terminal: "3",
        flightPairId: 1,
        isReturn: false
      },
      {
        id: 2,
        flightNumber: "EK456",
        aircraftId: 2,
        origin: "DXB",
        destination: "JFK",
        start_date: "2025-09-20 12:00",
        end_date: "2025-09-20 19:30",
        status: "boarding",
        passengers: 280,
        crew: 10,
        gate: "B12",
        terminal: "3",
        flightPairId: 2,
        isReturn: false
      }
    ]

    setAircraft(sampleAircraft)
    setFlights(sampleFlights)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Emirates Airlines Flight Gantt Chart Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Interactive flight scheduling visualization with different load levels from Dubai International Airport (DXB)
          </p>

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
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
              Sample Flight Schedule
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Flight Timeline</h3>
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
