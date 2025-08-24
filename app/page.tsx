'use client'

import { useState, useEffect } from 'react'
import FlightGanttChart from '../components/FlightGanttChart'
import { Aircraft, Flight } from '../types/activity'
import Link from 'next/link'
import { backupAircraft } from './data/flightSchedules'
import { testFlights } from './data/testFlights'

export default function Test() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [selectedDate, setSelectedDate] = useState('2025-08-18') // Monday of current week

  useEffect(() => {
    // Load test data with multiple aircraft and connected flight pairs
    const testAircraft: Aircraft[] = backupAircraft

    setAircraft(testAircraft)
    setFlights(testFlights)
  }, [])

  const handleUpdateFlight = (id: number, updates: Partial<Flight>) => {
    setFlights(prevFlights => 
      prevFlights.map(flight => 
        flight.id === id ? { ...flight, ...updates } : flight
      )
    )
  }

  const handleDeleteFlight = (id: number) => {
    setFlights(prevFlights => prevFlights.filter(flight => flight.id !== id))
  }

  const handleSwapFlights = (flight1Id: number, flight2Id: number) => {
    setFlights(prevFlights => {
      const flight1 = prevFlights.find(f => f.id === flight1Id)
      const flight2 = prevFlights.find(f => f.id === flight2Id)
      
      if (!flight1 || !flight2) return prevFlights
      
      // Swap the aircraft IDs
      return prevFlights.map(flight => {
        if (flight.id === flight1Id) {
          return { ...flight, aircraftId: flight2.aircraftId }
        }
        if (flight.id === flight2Id) {
          return { ...flight, aircraftId: flight1.aircraftId }
        }
        return flight
      })
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Emirates Airlines - Test Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Aircraft-based flight grouping with connected pairs - Week view by default, showing 15 aircraft with 78 conflict-free flights
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
              Test Flight Schedule - 15 Aircraft with 78 Conflict-Free Flights
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
            
            {/* Drag and Drop Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-800 mb-2">How to Use Drag and Drop:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Drag flights</strong> to move them between aircraft</li>
                <li>• <strong>Flight pairs</strong> (outbound + return) move together automatically</li>
                <li>• <strong>Drop on aircraft row</strong> to move flight to that aircraft</li>
                <li>• <strong>Drop on another flight</strong> to swap their positions</li>
                <li>• <strong>Blue highlighting</strong> shows valid drop zones</li>
              </ul>
            </div>
            
            <FlightGanttChart
              flights={flights}
              aircraft={aircraft}
              weatherData={{}}
              onUpdate={handleUpdateFlight}
              onDelete={handleDeleteFlight}
              onSwapFlights={handleSwapFlights}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
