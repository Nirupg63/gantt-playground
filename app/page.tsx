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
      // Airbus A380-800 variants
      {
        id: 1,
        type: "Airbus A380-800",
        registration: "A6-EOS",
        capacity: 615,
        status: "active",
        color: "#3b82f6"
      },
      {
        id: 6,
        type: "Airbus A380-800",
        registration: "A6-EOU",
        capacity: 615,
        status: "active",
        color: "#1d4ed8"
      },
      {
        id: 7,
        type: "Airbus A380-800",
        registration: "A6-EOV",
        capacity: 615,
        status: "active",
        color: "#1e40af"
      },

      // Boeing 777-300ER variants
      {
        id: 2,
        type: "Boeing 777-300ER",
        registration: "A6-ENP",
        capacity: 360,
        status: "active",
        color: "#10b981"
      },
      {
        id: 8,
        type: "Boeing 777-300ER",
        registration: "A6-ENQ",
        capacity: 360,
        status: "active",
        color: "#059669"
      },
      {
        id: 9,
        type: "Boeing 777-300ER",
        registration: "A6-ENR",
        capacity: 360,
        status: "active",
        color: "#047857"
      },

      // Airbus A350-900 variants
      {
        id: 3,
        type: "Airbus A350-900",
        registration: "A7-EOS",
        capacity: 325,
        status: "active",
        color: "#f59e0b"
      },
      {
        id: 10,
        type: "Airbus A350-900",
        registration: "A7-EOT",
        capacity: 325,
        status: "active",
        color: "#d97706"
      },
      {
        id: 11,
        type: "Airbus A350-900",
        registration: "A7-EOU",
        capacity: 325,
        status: "active",
        color: "#b45309"
      },

      // Boeing 787-9 Dreamliner variants
      {
        id: 4,
        type: "Boeing 787-9 Dreamliner",
        registration: "A8-EOS",
        capacity: 290,
        status: "active",
        color: "#8b5cf6"
      },
      {
        id: 12,
        type: "Boeing 787-9 Dreamliner",
        registration: "A8-EOT",
        capacity: 290,
        status: "active",
        color: "#7c3aed"
      },
      {
        id: 13,
        type: "Boeing 787-9 Dreamliner",
        registration: "A8-EOU",
        capacity: 290,
        status: "active",
        color: "#6d28d9"
      },

      // Airbus A330-300 variants
      {
        id: 5,
        type: "Airbus A330-300",
        registration: "A9-EOS",
        capacity: 277,
        status: "active",
        color: "#06b6d4"
      },
      {
        id: 14,
        type: "Airbus A330-300",
        registration: "A9-EOT",
        capacity: 277,
        status: "active",
        color: "#0891b2"
      },
      {
        id: 15,
        type: "Airbus A330-300",
        registration: "A9-EOU",
        capacity: 277,
        status: "active",
        color: "#0e7490"
      }
    ]

    const testFlights: Flight[] = [
      // Aircraft 1 (A6-EOS - Airbus A380-800) - Multiple flights
      {
        id: 1,
        flightNumber: "EK123",
        aircraftId: 1,
        origin: "DXB",
        destination: "LHR",
        start_date: "2025-08-18 08:00",
        end_date: "2025-08-18 12:30",
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
        flightNumber: "EK124",
        aircraftId: 1,
        origin: "LHR",
        destination: "DXB",
        start_date: "2025-08-18 14:00",
        end_date: "2025-08-18 22:30",
        status: "scheduled",
        passengers: 340,
        crew: 12,
        gate: "A3",
        terminal: "3",
        flightPairId: 1,
        isReturn: true
      },
      {
        id: 3,
        flightNumber: "EK789",
        aircraftId: 1,
        origin: "DXB",
        destination: "CDG",
        start_date: "2025-08-20 03:15",
        end_date: "2025-08-20 08:30",
        status: "scheduled",
        passengers: 320,
        crew: 11,
        gate: "C5",
        terminal: "3",
        flightPairId: 2,
        isReturn: false
      },
      {
        id: 4,
        flightNumber: "EK790",
        aircraftId: 1,
        origin: "CDG",
        destination: "DXB",
        start_date: "2025-08-20 10:00",
        end_date: "2025-08-20 19:15",
        status: "scheduled",
        passengers: 315,
        crew: 11,
        gate: "C8",
        terminal: "3",
        flightPairId: 2,
        isReturn: true
      },

      // Aircraft 6 (A6-EOU - Airbus A380-800) - Additional flights
      {
        id: 31,
        flightNumber: "EK456",
        aircraftId: 6,
        origin: "DXB",
        destination: "JFK",
        start_date: "2025-08-18 02:30",
        end_date: "2025-08-18 08:45",
        status: "scheduled",
        passengers: 400,
        crew: 14,
        gate: "B12",
        terminal: "3",
        flightPairId: 16,
        isReturn: false
      },
      {
        id: 32,
        flightNumber: "EK457",
        aircraftId: 6,
        origin: "JFK",
        destination: "DXB",
        start_date: "2025-08-18 10:30",
        end_date: "2025-08-19 06:45",
        status: "scheduled",
        passengers: 395,
        crew: 14,
        gate: "B15",
        terminal: "3",
        flightPairId: 16,
        isReturn: true
      },

      // Aircraft 7 (A6-EOV - Airbus A380-800) - Additional flights
      {
        id: 33,
        flightNumber: "EK789",
        aircraftId: 7,
        origin: "DXB",
        destination: "LAX",
        start_date: "2025-08-19 01:00",
        end_date: "2025-08-19 07:15",
        status: "scheduled",
        passengers: 380,
        crew: 13,
        gate: "C1",
        terminal: "3",
        flightPairId: 17,
        isReturn: false
      },
      {
        id: 34,
        flightNumber: "EK790",
        aircraftId: 7,
        origin: "LAX",
        destination: "DXB",
        start_date: "2025-08-19 09:00",
        end_date: "2025-08-20 05:15",
        status: "scheduled",
        passengers: 375,
        crew: 13,
        gate: "C4",
        terminal: "3",
        flightPairId: 17,
        isReturn: true
      },

      // Aircraft 2 (A6-ENP - Boeing 777-300ER) - Multiple flights
      {
        id: 7,
        flightNumber: "EK234",
        aircraftId: 2,
        origin: "DXB",
        destination: "SIN",
        start_date: "2025-08-18 22:00",
        end_date: "2025-08-19 09:30",
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
        aircraftId: 2,
        origin: "SIN",
        destination: "DXB",
        start_date: "2025-08-19 15:00",
        end_date: "2025-08-19 17:30",
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
        aircraftId: 2,
        origin: "DXB",
        destination: "SYD",
        start_date: "2025-08-20 23:45",
        end_date: "2025-08-21 19:30",
        status: "scheduled",
        passengers: 360,
        crew: 12,
        gate: "F3",
        terminal: "3",
        flightPairId: 5,
        isReturn: false
      },
      {
        id: 10,
        flightNumber: "EK568",
        aircraftId: 2,
        origin: "SYD",
        destination: "DXB",
        start_date: "2025-08-22 22:00",
        end_date: "2025-08-23 03:15",
        status: "scheduled",
        passengers: 355,
        crew: 12,
        gate: "F6",
        terminal: "3",
        flightPairId: 5,
        isReturn: true
      },

      // Aircraft 8 (A6-ENQ - Boeing 777-300ER) - Additional flights
      {
        id: 35,
        flightNumber: "EK890",
        aircraftId: 8,
        origin: "DXB",
        destination: "BKK",
        start_date: "2025-08-18 21:30",
        end_date: "2025-08-19 07:00",
        status: "scheduled",
        passengers: 280,
        crew: 9,
        gate: "G7",
        terminal: "3",
        flightPairId: 18,
        isReturn: false
      },
      {
        id: 36,
        flightNumber: "EK891",
        aircraftId: 8,
        origin: "BKK",
        destination: "DXB",
        start_date: "2025-08-19 08:00",
        end_date: "2025-08-19 10:30",
        status: "scheduled",
        passengers: 275,
        crew: 9,
        gate: "G10",
        terminal: "3",
        flightPairId: 18,
        isReturn: true
      },

      // Aircraft 9 (A6-ENR - Boeing 777-300ER) - Additional flights
      {
        id: 37,
        flightNumber: "EK234",
        aircraftId: 9,
        origin: "DXB",
        destination: "HKG",
        start_date: "2025-08-20 14:00",
        end_date: "2025-08-21 03:30",
        status: "scheduled",
        passengers: 300,
        crew: 11,
        gate: "H8",
        terminal: "3",
        flightPairId: 19,
        isReturn: false
      },
      {
        id: 38,
        flightNumber: "EK235",
        aircraftId: 9,
        origin: "HKG",
        destination: "DXB",
        start_date: "2025-08-21 05:00",
        end_date: "2025-08-21 08:30",
        status: "scheduled",
        passengers: 295,
        crew: 11,
        gate: "H11",
        terminal: "3",
        flightPairId: 19,
        isReturn: true
      },

      // Aircraft 3 (A7-EOS - Airbus A350-900) - Multiple flights
      {
        id: 13,
        flightNumber: "EK345",
        aircraftId: 3,
        origin: "DXB",
        destination: "HKG",
        start_date: "2025-08-18 07:15",
        end_date: "2025-08-18 20:45",
        status: "scheduled",
        passengers: 260,
        crew: 9,
        gate: "H2",
        terminal: "3",
        flightPairId: 7,
        isReturn: false
      },
      {
        id: 14,
        flightNumber: "EK346",
        aircraftId: 3,
        origin: "HKG",
        destination: "DXB",
        start_date: "2025-08-18 12:00",
        end_date: "2025-08-18 15:30",
        status: "scheduled",
        passengers: 255,
        crew: 9,
        gate: "H5",
        terminal: "3",
        flightPairId: 7,
        isReturn: true
      },
      {
        id: 15,
        flightNumber: "EK678",
        aircraftId: 3,
        origin: "DXB",
        destination: "NRT",
        start_date: "2025-08-20 13:30",
        end_date: "2025-08-21 05:45",
        status: "scheduled",
        passengers: 200,
        crew: 7,
        gate: "I5",
        terminal: "3",
        flightPairId: 8,
        isReturn: false
      },
      {
        id: 16,
        flightNumber: "EK679",
        aircraftId: 3,
        origin: "NRT",
        destination: "DXB",
        start_date: "2025-08-21 21:00",
        end_date: "2025-08-22 13:15",
        status: "scheduled",
        passengers: 195,
        crew: 7,
        gate: "I8",
        terminal: "3",
        flightPairId: 8,
        isReturn: true
      },

      // Aircraft 10 (A7-EOT - Airbus A350-900) - Additional flights
      {
        id: 39,
        flightNumber: "EK012",
        aircraftId: 10,
        origin: "DXB",
        destination: "ICN",
        start_date: "2025-08-18 20:00",
        end_date: "2025-08-19 12:30",
        status: "scheduled",
        passengers: 180,
        crew: 6,
        gate: "J8",
        terminal: "3",
        flightPairId: 20,
        isReturn: false
      },
      {
        id: 40,
        flightNumber: "EK013",
        aircraftId: 10,
        origin: "ICN",
        destination: "DXB",
        start_date: "2025-08-19 01:00",
        end_date: "2025-08-19 05:30",
        status: "scheduled",
        passengers: 175,
        crew: 6,
        gate: "J11",
        terminal: "3",
        flightPairId: 20,
        isReturn: true
      },

      // Aircraft 11 (A7-EOU - Airbus A350-900) - Additional flights
      {
        id: 41,
        flightNumber: "EK456",
        aircraftId: 11,
        origin: "DXB",
        destination: "SIN",
        start_date: "2025-08-21 06:00",
        end_date: "2025-08-21 17:30",
        status: "scheduled",
        passengers: 250,
        crew: 9,
        gate: "I12",
        terminal: "3",
        flightPairId: 21,
        isReturn: false
      },
      {
        id: 42,
        flightNumber: "EK457",
        aircraftId: 11,
        origin: "SIN",
        destination: "DXB",
        start_date: "2025-08-21 19:00",
        end_date: "2025-08-21 21:30",
        status: "scheduled",
        passengers: 245,
        crew: 9,
        gate: "I15",
        terminal: "3",
        flightPairId: 21,
        isReturn: true
      },

      // Aircraft 4 (A8-EOS - Boeing 787-9 Dreamliner) - Multiple flights
      {
        id: 19,
        flightNumber: "EK456",
        aircraftId: 4,
        origin: "DXB",
        destination: "BOM",
        start_date: "2025-08-18 23:45",
        end_date: "2025-08-19 04:15",
        status: "scheduled",
        passengers: 220,
        crew: 8,
        gate: "K1",
        terminal: "3",
        flightPairId: 10,
        isReturn: false
      },
      {
        id: 20,
        flightNumber: "EK457",
        aircraftId: 4,
        origin: "BOM",
        destination: "DXB",
        start_date: "2025-08-19 04:00",
        end_date: "2025-08-19 06:30",
        status: "scheduled",
        passengers: 215,
        crew: 8,
        gate: "K4",
        terminal: "3",
        flightPairId: 10,
        isReturn: true
      },
      {
        id: 21,
        flightNumber: "EK789",
        aircraftId: 4,
        origin: "DXB",
        destination: "DEL",
        start_date: "2025-08-20 15:30",
        end_date: "2025-08-20 20:45",
        status: "scheduled",
        passengers: 240,
        crew: 9,
        gate: "L3",
        terminal: "3",
        flightPairId: 11,
        isReturn: false
      },
      {
        id: 22,
        flightNumber: "EK790",
        aircraftId: 4,
        origin: "DEL",
        destination: "DXB",
        start_date: "2025-08-20 22:00",
        end_date: "2025-08-21 00:30",
        status: "scheduled",
        passengers: 235,
        crew: 9,
        gate: "L6",
        terminal: "3",
        flightPairId: 11,
        isReturn: true
      },

      // Aircraft 12 (A8-EOT - Boeing 787-9 Dreamliner) - Additional flights
      {
        id: 43,
        flightNumber: "EK234",
        aircraftId: 12,
        origin: "DXB",
        destination: "KUL",
        start_date: "2025-08-18 11:00",
        end_date: "2025-08-18 22:30",
        status: "scheduled",
        passengers: 280,
        crew: 10,
        gate: "M5",
        terminal: "3",
        flightPairId: 22,
        isReturn: false
      },
      {
        id: 44,
        flightNumber: "EK235",
        aircraftId: 12,
        origin: "KUL",
        destination: "DXB",
        start_date: "2025-08-19 13:00",
        end_date: "2025-08-19 16:30",
        status: "scheduled",
        passengers: 275,
        crew: 10,
        gate: "M8",
        terminal: "3",
        flightPairId: 22,
        isReturn: true
      },

      // Aircraft 13 (A8-EOU - Boeing 787-9 Dreamliner) - Additional flights
      {
        id: 45,
        flightNumber: "EK567",
        aircraftId: 13,
        origin: "DXB",
        destination: "CGK",
        start_date: "2025-08-20 08:00",
        end_date: "2025-08-20 19:15",
        status: "scheduled",
        passengers: 270,
        crew: 10,
        gate: "N8",
        terminal: "3",
        flightPairId: 23,
        isReturn: false
      },
      {
        id: 46,
        flightNumber: "EK568",
        aircraftId: 13,
        origin: "CGK",
        destination: "DXB",
        start_date: "2025-08-20 21:00",
        end_date: "2025-08-20 23:15",
        status: "scheduled",
        passengers: 265,
        crew: 10,
        gate: "N11",
        terminal: "3",
        flightPairId: 23,
        isReturn: true
      },

      // Aircraft 5 (A9-EOS - Airbus A330-300) - Multiple flights
      {
        id: 25,
        flightNumber: "EK567",
        aircraftId: 5,
        origin: "DXB",
        destination: "CGK",
        start_date: "2025-08-19 15:30",
        end_date: "2025-08-20 02:45",
        status: "scheduled",
        passengers: 320,
        crew: 11,
        gate: "N2",
        terminal: "3",
        flightPairId: 13,
        isReturn: false
      },
      {
        id: 26,
        flightNumber: "EK568",
        aircraftId: 5,
        origin: "CGK",
        destination: "DXB",
        start_date: "2025-08-20 20:00",
        end_date: "2025-08-20 23:15",
        status: "scheduled",
        passengers: 315,
        crew: 11,
        gate: "N5",
        terminal: "3",
        flightPairId: 13,
        isReturn: true
      },
      {
        id: 27,
        flightNumber: "EK123",
        aircraftId: 5,
        origin: "DXB",
        destination: "MNL",
        start_date: "2025-08-21 22:30",
        end_date: "2025-08-22 14:00",
        status: "scheduled",
        passengers: 240,
        crew: 9,
        gate: "O8",
        terminal: "3",
        flightPairId: 14,
        isReturn: false
      },
      {
        id: 28,
        flightNumber: "EK124",
        aircraftId: 5,
        origin: "MNL",
        destination: "DXB",
        start_date: "2025-08-22 04:30",
        end_date: "2025-08-22 08:00",
        status: "scheduled",
        passengers: 235,
        crew: 9,
        gate: "O11",
        terminal: "3",
        flightPairId: 14,
        isReturn: true
      },

      // Aircraft 14 (A9-EOT - Airbus A330-300) - Additional flights
      {
        id: 47,
        flightNumber: "EK456",
        aircraftId: 14,
        origin: "DXB",
        destination: "DAC",
        start_date: "2025-08-18 17:00",
        end_date: "2025-08-18 22:30",
        status: "scheduled",
        passengers: 130,
        crew: 5,
        gate: "P3",
        terminal: "3",
        flightPairId: 24,
        isReturn: false
      },
      {
        id: 48,
        flightNumber: "EK457",
        aircraftId: 14,
        origin: "DAC",
        destination: "DXB",
        start_date: "2025-08-18 23:00",
        end_date: "2025-08-19 02:30",
        status: "scheduled",
        passengers: 125,
        crew: 5,
        gate: "P6",
        terminal: "3",
        flightPairId: 24,
        isReturn: true
      },

      // Aircraft 15 (A9-EOU - Airbus A330-300) - Additional flights
      {
        id: 49,
        flightNumber: "EK789",
        aircraftId: 15,
        origin: "DXB",
        destination: "BOM",
        start_date: "2025-08-21 12:00",
        end_date: "2025-08-21 16:30",
        status: "scheduled",
        passengers: 200,
        crew: 7,
        gate: "K8",
        terminal: "3",
        flightPairId: 25,
        isReturn: false
      },
      {
        id: 50,
        flightNumber: "EK790",
        aircraftId: 15,
        origin: "BOM",
        destination: "DXB",
        start_date: "2025-08-21 18:00",
        end_date: "2025-08-21 20:30",
        status: "scheduled",
        passengers: 195,
        crew: 7,
        gate: "K11",
        terminal: "3",
        flightPairId: 25,
        isReturn: true
      }
    ]

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
            Aircraft-based flight grouping with connected pairs - Week view by default, showing 15 aircraft with 50+ flights
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
              Test Flight Schedule - 15 Aircraft with Multiple Configurations
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
