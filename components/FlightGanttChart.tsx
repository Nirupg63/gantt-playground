'use client'

import { useEffect, useRef, useState } from 'react'
import { Flight, Aircraft, FlightPair, WeatherCondition } from '../types/activity'
import { format, parseISO, addHours, startOfDay, endOfDay, differenceInMinutes } from 'date-fns'
import { Edit, Trash2, Clock, Plane, MapPin, Users, AlertTriangle, Cloud, CloudRain, CloudSnow, Zap, Eye, Thermometer, Wind } from 'lucide-react'

interface FlightGanttChartProps {
  flights: Flight[]
  aircraft: Aircraft[]
  flightPairs?: FlightPair[]
  weatherData?: Record<string, WeatherCondition>
  onUpdate: (id: number, updates: Partial<Flight>) => void
  onDelete: (id: number) => void
  onSwapFlights: (flight1Id: number, flight2Id: number) => void
  selectedDate: string
}

export default function FlightGanttChart({ 
  flights, 
  aircraft, 
  flightPairs,
  weatherData,
  onUpdate, 
  onDelete, 
  onSwapFlights,
  selectedDate 
}: FlightGanttChartProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<Flight>>({})
  const [draggedFlight, setDraggedFlight] = useState<Flight | null>(null)
  const [dragOverFlight, setDragOverFlight] = useState<Flight | null>(null)
  const [showConflicts, setShowConflicts] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedDateObj = parseISO(selectedDate)
  const startOfSelectedDay = startOfDay(selectedDateObj)
  const endOfSelectedDay = endOfDay(selectedDateObj)

  // Filter flights for the selected date
  const dayFlights = flights.filter(flight => {
    const startDate = parseISO(flight.start_date)
    const endDate = parseISO(flight.end_date)
    return startDate >= startOfSelectedDay && endDate <= endOfSelectedDay
  })

  // Detect flight conflicts (overlapping flights for the same aircraft)
  const detectConflicts = () => {
    const conflicts: Array<{flight1: Flight, flight2: Flight, aircraftId: number}> = []
    
    for (let i = 0; i < dayFlights.length; i++) {
      for (let j = i + 1; j < dayFlights.length; j++) {
        const flight1 = dayFlights[i]
        const flight2 = dayFlights[j]
        
        if (flight1.aircraftId === flight2.aircraftId) {
          const start1 = parseISO(flight1.start_date)
          const end1 = parseISO(flight1.end_date)
          const start2 = parseISO(flight2.start_date)
          const end2 = parseISO(flight2.end_date)
          
          // Check if flights overlap
          if (start1 < end2 && start2 < end1) {
            conflicts.push({ flight1, flight2, aircraftId: flight1.aircraftId })
          }
        }
      }
    }
    
    return conflicts
  }

  const conflicts = detectConflicts()

  // Generate time slots (24 hours)
  const timeSlots = Array.from({ length: 24 }, (_, i) => addHours(startOfSelectedDay, i))

  const getFlightPosition = (flight: Flight) => {
    const startDate = parseISO(flight.start_date)
    const endDate = parseISO(flight.end_date)
    
    const startHour = startDate.getHours() + startDate.getMinutes() / 60
    const endHour = endDate.getHours() + endDate.getMinutes() / 60
    
    const left = (startHour / 24) * 100
    const width = ((endHour - startHour) / 24) * 100
    
    return { left: `${left}%`, width: `${width}%` }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500'
      case 'boarding': return 'bg-yellow-500'
      case 'departed': return 'bg-green-500'
      case 'arrived': return 'bg-green-600'
      case 'delayed': return 'bg-orange-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getAircraftColor = (aircraftId: number) => {
    const aircraftItem = aircraft.find(a => a.id === aircraftId)
    if (!aircraftItem) return 'border-gray-500'
    
    switch (aircraftItem.status) {
      case 'active': return 'border-green-500'
      case 'maintenance': return 'border-yellow-500'
      case 'grounded': return 'border-red-500'
      default: return 'border-gray-500'
    }
  }

  const isFlightInConflict = (flightId: number) => {
    return conflicts.some(conflict => 
      conflict.flight1.id === flightId || conflict.flight2.id === flightId
    )
  }

  const handleEdit = (flight: Flight) => {
    setEditingId(flight.id)
    setEditForm({
      flightNumber: flight.flightNumber,
      aircraftId: flight.aircraftId,
      origin: flight.origin,
      destination: flight.destination,
      start_date: flight.start_date,
      end_date: flight.end_date,
      passengers: flight.passengers,
      crew: flight.crew,
      gate: flight.gate,
      terminal: flight.terminal
    })
  }

  const handleSave = () => {
    if (editingId && editForm.flightNumber) {
      onUpdate(editingId, editForm)
      setEditingId(null)
      setEditForm({})
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm')
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, flight: Flight) => {
    setDraggedFlight(flight)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, flight: Flight) => {
    e.preventDefault()
    if (draggedFlight && draggedFlight.id !== flight.id) {
      setDragOverFlight(flight)
    }
  }

  const handleDragLeave = () => {
    setDragOverFlight(null)
  }

  const handleDrop = (e: React.DragEvent, targetFlight: Flight) => {
    e.preventDefault()
    if (draggedFlight && draggedFlight.id !== targetFlight.id) {
      onSwapFlights(draggedFlight.id, targetFlight.id)
    }
    setDraggedFlight(null)
    setDragOverFlight(null)
  }

  const getAircraftInfo = (aircraftId: number) => {
    return aircraft.find(a => a.id === aircraftId)
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear': return <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
      case 'cloudy': return <Cloud className="w-3 h-3 text-gray-500" />
      case 'rain': return <CloudRain className="w-3 h-3 text-blue-500" />
      case 'snow': return <CloudSnow className="w-3 h-3 text-blue-300" />
      case 'storm': return <Zap className="w-3 h-3 text-yellow-500" />
      case 'fog': return <Eye className="w-3 h-3 text-gray-400" />
      default: return <Cloud className="w-3 h-3 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">Flight Schedule for {format(selectedDateObj, 'EEEE, MMMM d, yyyy')}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Plane className="w-4 h-4" />
            <span>{dayFlights.length} flights</span>
            {conflicts.length > 0 && (
              <div className="flex items-center space-x-1 text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                <span>{conflicts.length} conflicts</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Weather Summary */}
        {weatherData && (
          <div className="flex items-center space-x-4 text-sm">
            <span className="font-medium text-gray-700">Weather Summary:</span>
            <div className="flex items-center space-x-3">
              {Array.from(new Set(dayFlights.flatMap(f => [f.origin, f.destination]))).slice(0, 5).map(airport => {
                const weather = weatherData[airport]
                if (!weather) return null
                return (
                  <div key={airport} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <span className="font-medium text-gray-700">{airport}</span>
                    {getWeatherIcon(weather.condition)}
                    <span className="text-gray-600">{weather.temperature}°C</span>
                    <span className="text-gray-500 text-xs">{weather.condition}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowConflicts(!showConflicts)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              showConflicts 
                ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            {showConflicts ? 'Hide' : 'Show'} Conflicts
          </button>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>In Flight</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Delayed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Warnings */}
      {showConflicts && conflicts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-medium text-orange-800 mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Flight Conflicts Detected</span>
          </h4>
          <div className="space-y-2">
            {conflicts.map((conflict, index) => {
              const aircraftInfo = getAircraftInfo(conflict.aircraftId)
              return (
                <div key={index} className="text-sm text-orange-700 bg-orange-100 p-3 rounded border border-orange-200">
                  <div className="font-medium mb-1">
                    Aircraft Conflict: {aircraftInfo?.type} ({aircraftInfo?.registration})
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-medium">{conflict.flight1.flightNumber}:</span> {conflict.flight1.origin} → {conflict.flight1.destination}
                      <br />
                      <span className="text-orange-600">
                        {format(parseISO(conflict.flight1.start_date), 'HH:mm')} - {format(parseISO(conflict.flight1.end_date), 'HH:mm')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">{conflict.flight2.flightNumber}:</span> {conflict.flight2.origin} → {conflict.flight2.destination}
                      <br />
                      <span className="text-orange-600">
                        {format(parseISO(conflict.flight2.start_date), 'HH:mm')} - {format(parseISO(conflict.flight2.end_date), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Gantt Chart */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Time Header */}
        <div className="flex border-b border-gray-200">
          <div className="w-64 bg-gray-50 p-3 font-medium text-gray-700 border-r border-gray-200">
            Aircraft & Flight
          </div>
          {timeSlots.map((time, index) => (
            <div
              key={index}
              className="flex-1 p-2 text-center text-xs text-gray-600 border-r border-gray-200 min-w-[60px]"
            >
              {formatTime(time)}
            </div>
          ))}
        </div>

        {/* Flights */}
        {dayFlights.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No flights scheduled for this date</p>
            <p className="text-sm">Add some flights to see them in the timeline</p>
          </div>
        ) : (
          dayFlights.map((flight) => {
            const aircraftInfo = getAircraftInfo(flight.aircraftId)
            const isDragging = draggedFlight?.id === flight.id
            const isDragOver = dragOverFlight?.id === flight.id
            const hasConflict = isFlightInConflict(flight.id)
            
            return (
              <div 
                key={flight.id} 
                className={`flex border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  isDragging ? 'opacity-50' : ''
                } ${isDragOver ? 'bg-blue-50 border-blue-200' : ''} ${
                  hasConflict ? 'bg-orange-50 border-orange-200' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, flight)}
                onDragOver={(e) => handleDragOver(e, flight)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, flight)}
              >
                {/* Flight Info */}
                <div className="w-64 p-3 border-r border-gray-200 bg-gray-50">
                  {editingId === flight.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editForm.flightNumber || ''}
                        onChange={(e) => setEditForm({ ...editForm, flightNumber: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <div className="flex space-x-1">
                        <button
                          onClick={handleSave}
                          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm">{flight.flightNumber}</h4>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEdit(flight)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDelete(flight.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center space-x-1 mb-1">
                          <Plane className="w-3 h-3" />
                          <span>{aircraftInfo?.type || 'Unknown'} - {aircraftInfo?.registration || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="w-3 h-3" />
                          <span>{flight.origin} → {flight.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1 mb-1">
                          <Users className="w-3 h-3" />
                          <span>{flight.passengers}/{flight.crew} pax/crew</span>
                        </div>
                        {weatherData && (weatherData[flight.origin] || weatherData[flight.destination]) && (
                          <div className="space-y-1 text-xs">
                            {/* Origin Weather */}
                            {weatherData[flight.origin] && (
                              <div className="flex items-center space-x-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                <span className="font-medium">Origin:</span>
                                {getWeatherIcon(weatherData[flight.origin].condition)}
                                <span className="capitalize">{weatherData[flight.origin].condition}</span>
                                <Thermometer className="w-3 h-3" />
                                <span>{weatherData[flight.origin].temperature}°C</span>
                                <Wind className="w-3 h-3" />
                                <span>{weatherData[flight.origin].windSpeed}km/h</span>
                                <Eye className="w-3 h-3" />
                                <span>{weatherData[flight.origin].visibility}km</span>
                              </div>
                            )}
                            {/* Destination Weather */}
                            {weatherData[flight.destination] && (
                              <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-2 py-1 rounded">
                                <span className="font-medium">Dest:</span>
                                {getWeatherIcon(weatherData[flight.destination].condition)}
                                <span className="capitalize">{weatherData[flight.destination].condition}</span>
                                <Thermometer className="w-3 h-3" />
                                <span>{weatherData[flight.destination].temperature}°C</span>
                                <Wind className="w-3 h-3" />
                                <span>{weatherData[flight.destination].windSpeed}km/h</span>
                                <Eye className="w-3 h-3" />
                                <span>{weatherData[flight.destination].visibility}km</span>
                              </div>
                            )}
                            
                            {/* Weather Impact Assessment */}
                            {(() => {
                              const originWeather = weatherData[flight.origin]
                              const destWeather = weatherData[flight.destination]
                              const impacts = []
                              
                              if (originWeather) {
                                if (originWeather.condition === 'storm') impacts.push('Departure delays likely')
                                if (originWeather.condition === 'fog' && originWeather.visibility < 2) impacts.push('Low visibility departure')
                                if (originWeather.windSpeed > 25) impacts.push('High winds at origin')
                              }
                              
                              if (destWeather) {
                                if (destWeather.condition === 'storm') impacts.push('Arrival delays likely')
                                if (destWeather.condition === 'fog' && destWeather.visibility < 2) impacts.push('Low visibility arrival')
                                if (destWeather.windSpeed > 25) impacts.push('High winds at destination')
                              }
                              
                              if (impacts.length > 0) {
                                return (
                                  <div className="bg-orange-50 border border-orange-200 px-2 py-1 rounded text-orange-700">
                                    <div className="flex items-center space-x-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      <span className="font-medium">Weather Impact:</span>
                                    </div>
                                    <div className="text-xs space-y-1 mt-1">
                                      {impacts.map((impact, idx) => (
                                        <div key={idx} className="flex items-center space-x-1">
                                          <span>•</span>
                                          <span>{impact}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            })()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(flight.status)}`}></div>
                        <span className="text-xs text-gray-600 capitalize">{flight.status}</span>
                        {hasConflict && (
                          <div className="flex items-center space-x-1 text-orange-600">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="text-xs">Conflict</span>
                          </div>
                        )}
                        {/* Weather Status Indicator */}
                        {weatherData && (() => {
                          const originWeather = weatherData[flight.origin]
                          const destWeather = weatherData[flight.destination]
                          const hasWeatherIssues = (originWeather && (
                            originWeather.condition === 'storm' || 
                            (originWeather.condition === 'fog' && originWeather.visibility < 2) ||
                            originWeather.windSpeed > 25
                          )) || (destWeather && (
                            destWeather.condition === 'storm' || 
                            (destWeather.condition === 'fog' && destWeather.visibility < 2) ||
                            destWeather.windSpeed > 25
                          ))
                          
                          if (hasWeatherIssues) {
                            return (
                              <div className="flex items-center space-x-1 text-red-600">
                                <Cloud className="w-3 h-3" />
                                <span className="text-xs">Weather Risk</span>
                              </div>
                            )
                          }
                          return null
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline Bar */}
                <div className="flex-1 relative">
                  <div className="relative h-full">
                    <div
                      className={`absolute top-1/2 transform -translate-y-1/2 h-8 rounded-md border-2 ${getAircraftColor(flight.aircraftId)} ${getStatusColor(flight.status)} opacity-80 cursor-move ${
                        hasConflict ? 'ring-2 ring-orange-400 ring-opacity-75' : ''
                      }`}
                      style={getFlightPosition(flight)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-white px-2 truncate">
                          {flight.flightNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Daily Flight Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{dayFlights.length}</div>
            <div className="text-gray-600">Total Flights</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {dayFlights.filter(f => f.status === 'arrived').length}
            </div>
            <div className="text-gray-600">Arrived</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {dayFlights.filter(f => f.status === 'boarding' || f.status === 'departed').length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {dayFlights.filter(f => f.status === 'delayed').length}
            </div>
            <div className="text-gray-600">Delayed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {conflicts.length}
            </div>
            <div className="text-gray-600">Conflicts</div>
          </div>
        </div>
      </div>
    </div>
  )
}
