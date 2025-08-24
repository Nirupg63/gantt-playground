'use client'

import { useState, useEffect } from 'react'
import FlightGanttChart from '../components/FlightGanttChart'
import AircraftList from '../components/AircraftList'
import AircraftForm from '../components/AircraftForm'
import FlightForm from '../components/FlightForm'
import ConflictResolver from '../components/ConflictResolver'
import WeatherOverlay from '../components/WeatherOverlay'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import NotificationCenter from '../components/NotificationCenter'
import { Aircraft, Flight, FlightPair, WeatherCondition, ConflictResolution } from '../types/activity'

export default function Home() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [flightPairs, setFlightPairs] = useState<FlightPair[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedAircraftId, setSelectedAircraftId] = useState<number | undefined>()
  const [activeTab, setActiveTab] = useState<'aircraft' | 'flights' | 'weather'>('aircraft')
  const [weatherData, setWeatherData] = useState<Record<string, WeatherCondition>>({})

  useEffect(() => {
    // Load sample aircraft data
    const sampleAircraft: Aircraft[] = [
      {
        id: 1,
        type: 'Boeing 737-800',
        registration: 'N12345',
        capacity: 189,
        status: 'active',
        color: '#3b82f6'
      },
      {
        id: 2,
        type: 'Airbus A320',
        registration: 'N67890',
        capacity: 150,
        status: 'active',
        color: '#10b981'
      },
      {
        id: 3,
        type: 'Boeing 777-300ER',
        registration: 'N11111',
        capacity: 396,
        status: 'active',
        color: '#f59e0b'
      },
      {
        id: 4,
        type: 'Airbus A350-900',
        registration: 'N22222',
        capacity: 325,
        status: 'maintenance',
        color: '#8b5cf6'
      },
      {
        id: 5,
        type: 'Boeing 787-9 Dreamliner',
        registration: 'N33333',
        capacity: 290,
        status: 'active',
        color: '#06b6d4'
      },
      {
        id: 6,
        type: 'Airbus A330-300',
        registration: 'N44444',
        capacity: 277,
        status: 'active',
        color: '#84cc16'
      }
    ]

    // Load sample flight data
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    const sampleFlights: Flight[] = [
      // Flight Pair 1: JFK ↔ LAX
      {
        id: 1,
        flightNumber: 'AA123',
        aircraftId: 1,
        origin: 'JFK',
        destination: 'LAX',
        start_date: `${todayStr} 08:00`,
        end_date: `${todayStr} 11:30`,
        status: 'scheduled',
        passengers: 175,
        crew: 6,
        gate: 'A1',
        terminal: '1',
        flightPairId: 1,
        isReturn: false
      },
      {
        id: 2,
        flightNumber: 'AA124',
        aircraftId: 1,
        origin: 'LAX',
        destination: 'JFK',
        start_date: `${todayStr} 14:00`,
        end_date: `${todayStr} 21:30`,
        status: 'scheduled',
        passengers: 165,
        crew: 6,
        gate: 'A3',
        terminal: '1',
        flightPairId: 1,
        isReturn: true
      },
      // Flight Pair 2: LAX ↔ ORD
      {
        id: 3,
        flightNumber: 'AA456',
        aircraftId: 2,
        origin: 'LAX',
        destination: 'ORD',
        start_date: `${todayStr} 12:00`,
        end_date: `${todayStr} 17:30`,
        status: 'boarding',
        passengers: 140,
        crew: 5,
        gate: 'B12',
        terminal: '2',
        flightPairId: 2,
        isReturn: false
      },
      {
        id: 4,
        flightNumber: 'AA457',
        aircraftId: 2,
        origin: 'ORD',
        destination: 'LAX',
        start_date: `${todayStr} 19:00`,
        end_date: `${todayStr} 22:30`,
        status: 'scheduled',
        passengers: 135,
        crew: 5,
        gate: 'B15',
        terminal: '2',
        flightPairId: 2,
        isReturn: true
      },
      // Flight Pair 3: ORD ↔ LHR
      {
        id: 5,
        flightNumber: 'AA789',
        aircraftId: 3,
        origin: 'ORD',
        destination: 'LHR',
        start_date: `${todayStr} 18:00`,
        end_date: `${todayStr} 23:00`,
        status: 'scheduled',
        passengers: 350,
        crew: 12,
        gate: 'C5',
        terminal: '3',
        flightPairId: 3,
        isReturn: false
      },
      {
        id: 6,
        flightNumber: 'AA790',
        aircraftId: 3,
        origin: 'LHR',
        destination: 'ORD',
        start_date: `${todayStr} 07:00`,
        end_date: `${todayStr} 10:00`,
        status: 'scheduled',
        passengers: 320,
        crew: 12,
        gate: 'C8',
        terminal: '3',
        flightPairId: 3,
        isReturn: true
      },
      // Flight Pair 4: LHR ↔ CDG
      {
        id: 7,
        flightNumber: 'BA789',
        aircraftId: 2,
        origin: 'LHR',
        destination: 'CDG',
        start_date: `${todayStr} 06:30`,
        end_date: `${todayStr} 09:15`,
        status: 'arrived',
        passengers: 120,
        crew: 4,
        gate: 'D8',
        terminal: '2',
        flightPairId: 4,
        isReturn: false
      },
      {
        id: 8,
        flightNumber: 'BA790',
        aircraftId: 2,
        origin: 'CDG',
        destination: 'LHR',
        start_date: `${todayStr} 16:00`,
        end_date: `${todayStr} 16:45`,
        status: 'scheduled',
        passengers: 110,
        crew: 4,
        gate: 'D10',
        terminal: '2',
        flightPairId: 4,
        isReturn: true
      },
      // Flight Pair 5: ATL ↔ SFO
      {
        id: 9,
        flightNumber: 'DL234',
        aircraftId: 3,
        origin: 'ATL',
        destination: 'SFO',
        start_date: `${todayStr} 10:15`,
        end_date: `${todayStr} 12:45`,
        status: 'departed',
        passengers: 280,
        crew: 8,
        gate: 'E12',
        terminal: '1',
        flightPairId: 5,
        isReturn: false
      },
      {
        id: 10,
        flightNumber: 'DL235',
        aircraftId: 3,
        origin: 'SFO',
        destination: 'ATL',
        start_date: `${todayStr} 15:00`,
        end_date: `${todayStr} 21:30`,
        status: 'scheduled',
        passengers: 265,
        crew: 8,
        gate: 'E15',
        terminal: '1',
        flightPairId: 5,
        isReturn: true
      },
      // Flight Pair 6: DEN ↔ MIA
      {
        id: 11,
        flightNumber: 'UA567',
        aircraftId: 1,
        origin: 'DEN',
        destination: 'MIA',
        start_date: `${todayStr} 16:45`,
        end_date: `${todayStr} 20:30`,
        status: 'scheduled',
        passengers: 155,
        crew: 5,
        gate: 'F3',
        terminal: '3',
        flightPairId: 6,
        isReturn: false
      },
      {
        id: 12,
        flightNumber: 'UA568',
        aircraftId: 1,
        origin: 'MIA',
        destination: 'DEN',
        start_date: `${todayStr} 22:00`,
        end_date: `${todayStr} 01:15`,
        status: 'scheduled',
        passengers: 140,
        crew: 5,
        gate: 'F6',
        terminal: '3',
        flightPairId: 6,
        isReturn: true
      },
      // Flight Pair 7: FRA ↔ JFK
      {
        id: 13,
        flightNumber: 'LH901',
        aircraftId: 2,
        origin: 'FRA',
        destination: 'JFK',
        start_date: `${todayStr} 22:00`,
        end_date: `${todayStr} 01:30`,
        status: 'scheduled',
        passengers: 135,
        crew: 6,
        gate: 'G7',
        terminal: '2',
        flightPairId: 7,
        isReturn: false
      },
      {
        id: 14,
        flightNumber: 'LH902',
        aircraftId: 2,
        origin: 'JFK',
        destination: 'FRA',
        start_date: `${todayStr} 03:00`,
        end_date: `${todayStr} 16:30`,
        status: 'scheduled',
        passengers: 125,
        crew: 6,
        gate: 'G10',
        terminal: '2',
        flightPairId: 7,
        isReturn: true
      },
      // Flight Pair 8: CDG ↔ LAX
      {
        id: 15,
        flightNumber: 'AF456',
        aircraftId: 5,
        origin: 'CDG',
        destination: 'LAX',
        start_date: `${todayStr} 07:15`,
        end_date: `${todayStr} 10:45`,
        status: 'scheduled',
        passengers: 245,
        crew: 9,
        gate: 'H2',
        terminal: '1',
        flightPairId: 8,
        isReturn: false
      },
      {
        id: 16,
        flightNumber: 'AF457',
        aircraftId: 5,
        origin: 'LAX',
        destination: 'CDG',
        start_date: `${todayStr} 12:00`,
        end_date: `${todayStr} 05:30`,
        status: 'scheduled',
        passengers: 230,
        crew: 9,
        gate: 'H5',
        terminal: '1',
        flightPairId: 8,
        isReturn: true
      },
      // Flight Pair 9: DXB ↔ JFK
      {
        id: 17,
        flightNumber: 'EK789',
        aircraftId: 6,
        origin: 'DXB',
        destination: 'JFK',
        start_date: `${todayStr} 13:30`,
        end_date: `${todayStr} 19:45`,
        status: 'scheduled',
        passengers: 200,
        crew: 7,
        gate: 'I5',
        terminal: '3',
        flightPairId: 9,
        isReturn: false
      },
      {
        id: 18,
        flightNumber: 'EK790',
        aircraftId: 6,
        origin: 'JFK',
        destination: 'DXB',
        start_date: `${todayStr} 21:00`,
        end_date: `${todayStr} 19:15`,
        status: 'scheduled',
        passengers: 185,
        crew: 7,
        gate: 'I8',
        terminal: '3',
        flightPairId: 9,
        isReturn: true
      },
      // Flight Pair 10: SYD ↔ SFO
      {
        id: 19,
        flightNumber: 'QF123',
        aircraftId: 5,
        origin: 'SYD',
        destination: 'SFO',
        start_date: `${todayStr} 20:00`,
        end_date: `${todayStr} 23:30`,
        status: 'scheduled',
        passengers: 180,
        crew: 6,
        gate: 'J8',
        terminal: '2',
        flightPairId: 10,
        isReturn: false
      },
      {
        id: 20,
        flightNumber: 'QF124',
        aircraftId: 5,
        origin: 'SFO',
        destination: 'SYD',
        start_date: `${todayStr} 01:00`,
        end_date: `${todayStr} 06:30`,
        status: 'scheduled',
        passengers: 165,
        crew: 6,
        gate: 'J11',
        terminal: '2',
        flightPairId: 10,
        isReturn: true
      },
      // Flight Pair 11: AKL ↔ LAX
      {
        id: 21,
        flightNumber: 'NZ456',
        aircraftId: 6,
        origin: 'AKL',
        destination: 'LAX',
        start_date: `${todayStr} 23:45`,
        end_date: `${todayStr} 02:15`,
        status: 'scheduled',
        passengers: 220,
        crew: 8,
        gate: 'K1',
        terminal: '1',
        flightPairId: 11,
        isReturn: false
      },
      {
        id: 22,
        flightNumber: 'NZ457',
        aircraftId: 6,
        origin: 'LAX',
        destination: 'AKL',
        start_date: `${todayStr} 04:00`,
        end_date: `${todayStr} 08:30`,
        status: 'scheduled',
        passengers: 200,
        crew: 8,
        gate: 'K4',
        terminal: '1',
        flightPairId: 11,
        isReturn: true
      },
      // Single flight (no return)
      {
        id: 23,
        flightNumber: 'CA789',
        aircraftId: 1,
        origin: 'PEK',
        destination: 'JFK',
        start_date: `${todayStr} 09:30`,
        end_date: `${todayStr} 12:45`,
        status: 'cancelled',
        passengers: 0,
        crew: 0,
        gate: 'L3',
        terminal: '2'
      }
    ]

    // Load sample flight pairs data
    const sampleFlightPairs: FlightPair[] = [
      {
        id: 1,
        outboundFlightId: 1,
        returnFlightId: 2,
        aircraftId: 1,
        route: 'JFK ↔ LAX',
        totalDuration: 14.5
      },
      {
        id: 2,
        outboundFlightId: 3,
        returnFlightId: 4,
        aircraftId: 2,
        route: 'LAX ↔ ORD',
        totalDuration: 10.5
      },
      {
        id: 3,
        outboundFlightId: 5,
        returnFlightId: 6,
        aircraftId: 3,
        route: 'ORD ↔ LHR',
        totalDuration: 8.0
      },
      {
        id: 4,
        outboundFlightId: 7,
        returnFlightId: 8,
        aircraftId: 2,
        route: 'LHR ↔ CDG',
        totalDuration: 2.75
      },
      {
        id: 5,
        outboundFlightId: 9,
        returnFlightId: 10,
        aircraftId: 3,
        route: 'ATL ↔ SFO',
        totalDuration: 11.25
      },
      {
        id: 6,
        outboundFlightId: 11,
        returnFlightId: 12,
        aircraftId: 1,
        route: 'DEN ↔ MIA',
        totalDuration: 8.5
      },
      {
        id: 7,
        outboundFlightId: 13,
        returnFlightId: 14,
        aircraftId: 2,
        route: 'FRA ↔ JFK',
        totalDuration: 18.5
      },
      {
        id: 8,
        outboundFlightId: 15,
        returnFlightId: 16,
        aircraftId: 5,
        route: 'CDG ↔ LAX',
        totalDuration: 22.75
      },
      {
        id: 9,
        outboundFlightId: 17,
        returnFlightId: 18,
        aircraftId: 6,
        route: 'DXB ↔ JFK',
        totalDuration: 29.75
      },
      {
        id: 10,
        outboundFlightId: 19,
        returnFlightId: 20,
        aircraftId: 5,
        route: 'SYD ↔ SFO',
        totalDuration: 32.5
      },
      {
        id: 11,
        outboundFlightId: 21,
        returnFlightId: 22,
        aircraftId: 6,
        route: 'AKL ↔ LAX',
        totalDuration: 28.75
      }
    ]

    setAircraft(sampleAircraft)
    setFlights(sampleFlights)
    setFlightPairs(sampleFlightPairs)
    
    // Initialize weather data
    const initialWeather: Record<string, WeatherCondition> = {
      'JFK': { condition: 'clear', temperature: 22, windSpeed: 15, visibility: 10, description: 'Clear skies with light winds' },
      'LAX': { condition: 'cloudy', temperature: 18, windSpeed: 8, visibility: 8, description: 'Partly cloudy with calm conditions' },
      'ORD': { condition: 'rain', temperature: 12, windSpeed: 25, visibility: 3, description: 'Heavy rain with strong winds' },
      'LHR': { condition: 'fog', temperature: 8, windSpeed: 12, visibility: 1, description: 'Dense fog reducing visibility' },
      'CDG': { condition: 'clear', temperature: 16, windSpeed: 18, visibility: 9, description: 'Clear conditions with moderate winds' },
      'ATL': { condition: 'storm', temperature: 24, windSpeed: 35, visibility: 2, description: 'Thunderstorms with heavy rain' },
      'SFO': { condition: 'fog', temperature: 14, windSpeed: 10, visibility: 2, description: 'Morning fog clearing by afternoon' },
      'DEN': { condition: 'snow', temperature: -2, windSpeed: 20, visibility: 5, description: 'Light snow with moderate winds' },
      'MIA': { condition: 'clear', temperature: 28, windSpeed: 12, visibility: 10, description: 'Clear and sunny with light breeze' },
      'FRA': { condition: 'cloudy', temperature: 10, windSpeed: 22, visibility: 7, description: 'Overcast with strong winds' },
      'DXB': { condition: 'clear', temperature: 32, windSpeed: 8, visibility: 10, description: 'Clear and hot with light winds' },
      'SYD': { condition: 'rain', temperature: 20, windSpeed: 30, visibility: 4, description: 'Heavy rainfall with strong winds' },
      'AKL': { condition: 'clear', temperature: 16, windSpeed: 15, visibility: 9, description: 'Clear skies with moderate winds' },
      'PEK': { condition: 'cloudy', temperature: 14, windSpeed: 18, visibility: 6, description: 'Cloudy with moderate winds' }
    }
    setWeatherData(initialWeather)
  }, [])

  const addAircraft = (aircraftData: Omit<Aircraft, 'id'>) => {
    const newAircraft: Aircraft = {
      ...aircraftData,
      id: Math.max(...aircraft.map(a => a.id), 0) + 1
    }
    setAircraft([...aircraft, newAircraft])
  }

  const updateAircraft = (id: number, updates: Partial<Aircraft>) => {
    setAircraft(aircraft.map(aircraftItem => 
      aircraftItem.id === id ? { ...aircraftItem, ...updates } : aircraftItem
    ))
  }

  const deleteAircraft = (id: number) => {
    setAircraft(aircraft.filter(aircraftItem => aircraftItem.id !== id))
    // Also remove flights associated with this aircraft
    setFlights(flights.filter(flight => flight.aircraftId !== id))
  }

  const addFlight = (flightData: Omit<Flight, 'id'>) => {
    const newFlight: Flight = {
      ...flightData,
      id: Math.max(...flights.map(f => f.id), 0) + 1
    }
    setFlights([...flights, newFlight])
  }

  const updateFlight = (id: number, updates: Partial<Flight>) => {
    setFlights(flights.map(flight => 
      flight.id === id ? { ...flight, ...updates } : flight
    ))
  }

  const deleteFlight = (id: number) => {
    setFlights(flights.filter(flight => flight.id !== id))
  }

  const swapFlights = (flight1Id: number, flight2Id: number) => {
    const flight1 = flights.find(f => f.id === flight1Id)
    const flight2 = flights.find(f => f.id === flight2Id)
    
    if (flight1 && flight2) {
      // Swap the times of the two flights
      const updatedFlights = flights.map(flight => {
        if (flight.id === flight1Id) {
          return { ...flight, start_date: flight2.start_date, end_date: flight2.end_date }
        }
        if (flight.id === flight2Id) {
          return { ...flight, start_date: flight1.start_date, end_date: flight1.end_date }
        }
        return flight
      })
      
      setFlights(updatedFlights)
    }
  }

  const resolveConflict = (resolution: ConflictResolution, flight1Id: number, flight2Id: number) => {
    const flight1 = flights.find(f => f.id === flight1Id)
    const flight2 = flights.find(f => f.id === flight2Id)
    
    if (!flight1 || !flight2) return
    
    switch (resolution.type) {
      case 'delay':
        // Delay the second flight by 30 minutes
        const delayMinutes = 30
        const newStartDate = new Date(flight2.start_date)
        newStartDate.setMinutes(newStartDate.getMinutes() + delayMinutes)
        const newEndDate = new Date(flight2.end_date)
        newEndDate.setMinutes(newEndDate.getMinutes() + delayMinutes)
        
        updateFlight(flight2Id, {
          start_date: newStartDate.toISOString(),
          end_date: newEndDate.toISOString(),
          status: 'delayed',
          delayReason: 'Conflict resolution - delayed to avoid overlap',
          estimatedDelay: delayMinutes
        })
        break
        
      case 'aircraft_swap':
        // Find an available aircraft
        const availableAircraft = aircraft.find(a => 
          a.id !== flight1.aircraftId && 
          a.status === 'active' &&
          !flights.some(f => 
            f.aircraftId === a.id && 
            f.id !== flight1.id &&
            new Date(f.start_date) < new Date(flight1.end_date) &&
            new Date(f.end_date) > new Date(flight1.start_date)
          )
        )
        
        if (availableAircraft) {
          updateFlight(flight1Id, { aircraftId: availableAircraft.id })
        }
        break
        
      case 'cancel':
        updateFlight(flight2Id, { 
          status: 'cancelled',
          passengers: 0,
          crew: 0
        })
        break
        
      default:
        break
    }
  }

  const updateWeather = (airport: string, weather: WeatherCondition) => {
    setWeatherData(prev => ({
      ...prev,
      [airport]: weather
    }))
  }

  const filteredFlights = selectedAircraftId 
    ? flights.filter(flight => flight.aircraftId === selectedAircraftId)
    : flights

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <NotificationCenter
              flights={flights}
              aircraft={aircraft}
              weatherData={weatherData}
              selectedDate={selectedDate}
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Airline Flight Management System
          </h1>
          <p className="text-lg text-gray-600">
            Manage your aircraft fleet and flight schedules with an interactive Gantt chart
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Aircraft List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <AircraftList
                aircraft={aircraft}
                onUpdate={updateAircraft}
                onDelete={deleteAircraft}
                selectedAircraftId={selectedAircraftId}
                onSelectAircraft={setSelectedAircraftId}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
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
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('aircraft')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'aircraft'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Aircraft Management
                  </button>
                  <button
                    onClick={() => setActiveTab('flights')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'flights'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Flight Management
                  </button>
                  <button
                    onClick={() => setActiveTab('weather')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'weather'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Weather & Operations
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'aircraft' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Aircraft</h3>
                    <AircraftForm onSubmit={addAircraft} />
                  </div>
                </div>
              ) : activeTab === 'flights' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Flight</h3>
                    <FlightForm onSubmit={addFlight} aircraft={aircraft} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Flight Timeline</h3>
                    <FlightGanttChart
                      flights={filteredFlights}
                      aircraft={aircraft}
                      weatherData={weatherData}
                      onUpdate={updateFlight}
                      onDelete={deleteFlight}
                      onSwapFlights={swapFlights}
                      selectedDate={selectedDate}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Dashboard</h3>
                    <AnalyticsDashboard
                      flights={flights}
                      aircraft={aircraft}
                      selectedDate={selectedDate}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Weather Conditions</h3>
                    <WeatherOverlay
                      airports={Array.from(new Set(flights.flatMap(f => [f.origin, f.destination])))}
                      onWeatherChange={updateWeather}
                    />
                  </div>
                  
                  {/* Weather Summary Card */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Weather Summary</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from(new Set(flights.flatMap(f => [f.origin, f.destination]))).map(airport => {
                          const weather = weatherData[airport]
                          if (!weather) return null
                          
                          const getWeatherIcon = (condition: string) => {
                            switch (condition) {
                              case 'clear': return <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                              case 'cloudy': return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                              case 'rain': return <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                              case 'snow': return <div className="w-4 h-4 bg-blue-200 rounded-full"></div>
                              case 'storm': return <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                              case 'fog': return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                              default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                            }
                          }
                          
                          const getWeatherColor = (condition: string) => {
                            switch (condition) {
                              case 'clear': return 'border-green-200 bg-green-50'
                              case 'cloudy': return 'border-gray-200 bg-gray-50'
                              case 'rain': return 'border-blue-200 bg-blue-50'
                              case 'snow': return 'border-blue-200 bg-blue-50'
                              case 'storm': return 'border-red-200 bg-red-50'
                              case 'fog': return 'border-gray-200 bg-gray-50'
                              default: return 'border-gray-200 bg-gray-50'
                            }
                          }
                          
                          return (
                            <div
                              key={airport}
                              className={`p-3 rounded-lg border ${getWeatherColor(weather.condition)}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900 text-sm">{airport}</span>
                                {getWeatherIcon(weather.condition)}
                              </div>
                              
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center justify-between">
                                  <span>Temp:</span>
                                  <span className="font-medium">{weather.temperature}°C</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Wind:</span>
                                  <span className="font-medium">{weather.windSpeed} km/h</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Visibility:</span>
                                  <span className="font-medium">{weather.visibility} km</span>
                                </div>
                              </div>
                              
                              <div className="mt-2 text-xs text-gray-500 truncate">
                                {weather.description}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Conflict Resolution</h3>
                    <ConflictResolver
                      conflicts={(() => {
                        const conflicts: Array<{flight1: Flight, flight2: Flight, aircraftId: number}> = []
                        const today = new Date(selectedDate)
                        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
                        
                        const dayFlights = flights.filter(flight => {
                          const startDate = new Date(flight.start_date)
                          const endDate = new Date(flight.end_date)
                          return startDate >= startOfDay && endDate <= endOfDay
                        })
                        
                        for (let i = 0; i < dayFlights.length; i++) {
                          for (let j = i + 1; j < dayFlights.length; j++) {
                            const flight1 = dayFlights[i]
                            const flight2 = dayFlights[j]
                            
                            if (flight1.aircraftId === flight2.aircraftId) {
                              const start1 = new Date(flight1.start_date)
                              const end1 = new Date(flight1.end_date)
                              const start2 = new Date(flight2.start_date)
                              const end2 = new Date(flight2.end_date)
                              
                              if (start1 < end2 && start2 < end1) {
                                conflicts.push({ flight1, flight2, aircraftId: flight1.aircraftId })
                              }
                            }
                          }
                        }
                        
                        return conflicts
                      })()}
                      aircraft={aircraft}
                      onResolveConflict={resolveConflict}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
