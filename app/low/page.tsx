'use client'

import { useState, useEffect } from 'react'
import FlightGanttChart from '../../components/FlightGanttChart'
import { Aircraft, Flight } from '../../types/activity'
import Link from 'next/link'

export default function LowLoad() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [selectedDate, setSelectedDate] = useState('2025-08-18')

  useEffect(() => {
    // Load data from the low flights JSON file
    fetch('/data/flights-low.json')
      .then(response => response.json())
      .then(data => {
        setAircraft(data.aircraft)
        setFlights(data.flights)
      })
      .catch(error => {
        console.error('Error loading low flights data:', error)
      })
  }, [])

  const filteredFlights = flights

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                ← Back to Home
              </button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Emirates Airlines - Low Flight Load Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Viewing {flights.length} flights with {aircraft.length} aircraft from Dubai International Airport (DXB)
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Flight Schedule
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
              flights={filteredFlights}
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
