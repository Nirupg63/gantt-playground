'use client'

import { useEffect, useRef, useState } from 'react'
import { Flight, Aircraft, FlightPair, WeatherCondition } from '../types/activity'
import { format, parseISO, addHours, startOfDay, endOfDay, differenceInMinutes, addDays, addWeeks, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { Edit, Trash2, Clock, Plane, MapPin, Users, AlertTriangle, Cloud, CloudRain, CloudSnow, Zap, Eye, Thermometer, Wind, ZoomIn, ZoomOut } from 'lucide-react'

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

type ZoomLevel = 'week' | 'month'

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
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('week')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedDateObj = parseISO(selectedDate)
  
  // Calculate time range based on zoom level
  const getTimeRange = () => {
    switch (zoomLevel) {
      case 'week':
        return {
          start: startOfWeek(selectedDateObj, { weekStartsOn: 1 }), // Monday start
          end: endOfWeek(selectedDateObj, { weekStartsOn: 1 }),
          timeSlots: Array.from({ length: 7 * 24 }, (_, i) => {
            const day = Math.floor(i / 24)
            const hour = i % 24
            return addHours(addDays(startOfWeek(selectedDateObj, { weekStartsOn: 1 }), day), hour)
          }),
          timeFormat: 'HH:mm',
          timeStep: 1, // 1 hour
          timeStepUnit: 'hour',
          showDateHeaders: true
        }
      case 'month':
        return {
          start: startOfMonth(selectedDateObj),
          end: endOfMonth(selectedDateObj),
          timeSlots: Array.from({ length: 31 * 24 }, (_, i) => {
            const day = Math.floor(i / 24)
            const hour = i % 24
            return addHours(addDays(startOfMonth(selectedDateObj), day), hour)
          }),
          timeFormat: 'HH:mm',
          timeStep: 1, // 1 hour
          timeStepUnit: 'hour',
          showDateHeaders: true
        }
    }
  }

  const timeRange = getTimeRange()

  // Filter flights for the selected time range
  const rangeFlights = flights.filter(flight => {
    const startDate = parseISO(flight.start_date)
    const endDate = parseISO(flight.end_date)
    return startDate >= timeRange.start && endDate <= timeRange.end
  })

  // Group flights by aircraft
  const flightsByAircraft = aircraft.map(aircraftItem => {
    const aircraftFlights = rangeFlights.filter(flight => flight.aircraftId === aircraftItem.id)
    return {
      aircraft: aircraftItem,
      flights: aircraftFlights
    }
  }).filter(group => group.flights.length > 0)

  // Detect flight conflicts (overlapping flights for the same aircraft)
  const detectConflicts = () => {
    const conflicts: Array<{flight1: Flight, flight2: Flight, aircraftId: number}> = []
    
    for (let i = 0; i < rangeFlights.length; i++) {
      for (let j = i + 1; j < rangeFlights.length; j++) {
        const flight1 = rangeFlights[i]
        const flight2 = rangeFlights[j]
        
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

  const getFlightPosition = (flight: Flight) => {
    const startDate = parseISO(flight.start_date)
    const endDate = parseISO(flight.end_date)
    
    let left: number
    let width: number
    
    switch (zoomLevel) {
      case 'week':
        const startDay = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1 // Convert Sunday=0 to Sunday=6
        const startHour = startDate.getHours() + startDate.getMinutes() / 60
        left = ((startDay * 24 + startHour) / (7 * 24)) * 100
        
        const endDay = endDate.getDay() === 0 ? 6 : endDate.getDay() - 1
        const endHour = endDate.getHours() + endDate.getMinutes() / 60
        const totalWidth = ((endDay * 24 + endHour) - (startDay * 24 + startHour)) / (7 * 24) * 100
        width = Math.max(totalWidth, 0.5) // Minimum width for visibility
        break
      case 'month':
        const startDayOfMonth = startDate.getDate() - 1
        const startHourOfDay = startDate.getHours() + startDate.getMinutes() / 60
        left = ((startDayOfMonth * 24 + startHourOfDay) / (31 * 24)) * 100
        
        const endDayOfMonth = endDate.getDate() - 1
        const endHourOfDay = endDate.getHours() + endDate.getMinutes() / 60
        const totalWidthMonth = ((endDayOfMonth * 24 + endHourOfDay) - (startDayOfMonth * 24 + startHourOfDay)) / (31 * 24) * 100
        width = Math.max(totalWidthMonth, 0.3) // Minimum width for visibility
        break
    }
    
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
    switch (zoomLevel) {
      case 'week':
        return format(date, 'EEE')
      case 'month':
        return format(date, 'd')
      default:
        return format(date, 'EEE')
    }
  }

  const getZoomLabel = () => {
    switch (zoomLevel) {
      case 'week':
        return `Week of ${format(timeRange.start, 'MMM d')} - ${format(timeRange.end, 'MMM d, yyyy')}`
      case 'month':
        return format(selectedDateObj, 'MMMM yyyy')
      default:
        return `Week of ${format(timeRange.start, 'MMM d')} - ${format(timeRange.end, 'MMM d, yyyy')}`
    }
  }

  // Drag and Drop handlers for flight pairs
  const handleDragStart = (e: React.DragEvent, flight: Flight) => {
    setDraggedFlight(flight)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', flight.id.toString())
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
      // Find the flight pair for the dragged flight
      const draggedPair = connectedPairs.find(pair => 
        pair.outbound.id === draggedFlight.id || pair.return.id === draggedFlight.id
      )
      
      // Find the flight pair for the target flight
      const targetPair = connectedPairs.find(pair => 
        pair.outbound.id === targetFlight.id || pair.return.id === targetFlight.id
      )
      
      if (draggedPair && targetPair) {
        // Swap the entire flight pairs
        onSwapFlights(draggedPair.outbound.id, targetPair.outbound.id)
        onSwapFlights(draggedPair.return.id, targetPair.return.id)
      } else {
        // Fallback to individual flight swap
        onSwapFlights(draggedFlight.id, targetFlight.id)
      }
    }
    setDraggedFlight(null)
    setDragOverFlight(null)
  }

  // Handle dropping on aircraft row (to move flight to different aircraft)
  const handleAircraftDrop = (e: React.DragEvent, targetAircraft: Aircraft) => {
    e.preventDefault()
    if (draggedFlight && draggedFlight.aircraftId !== targetAircraft.id) {
      // Update the aircraft ID for the dragged flight
      onUpdate(draggedFlight.id, { aircraftId: targetAircraft.id })
      
      // If it's part of a pair, also update the return flight
      const draggedPair = connectedPairs.find(pair => 
        pair.outbound.id === draggedFlight.id || pair.return.id === draggedFlight.id
      )
      
      if (draggedPair) {
        const otherFlight = draggedPair.outbound.id === draggedFlight.id ? draggedPair.return : draggedPair.outbound
        onUpdate(otherFlight.id, { aircraftId: targetAircraft.id })
      }
    }
    setDraggedFlight(null)
    setDragOverFlight(null)
  }

  const handleAircraftDragOver = (e: React.DragEvent, aircraft: Aircraft) => {
    e.preventDefault()
    if (draggedFlight && draggedFlight.aircraftId !== aircraft.id) {
      e.dataTransfer.dropEffect = 'move'
    }
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

  // Get connected flight pairs
  const getConnectedPairs = () => {
    const pairs: Array<{outbound: Flight, return: Flight}> = []
    const processedFlights = new Set<number>()
    
    rangeFlights.forEach(flight => {
      if (processedFlights.has(flight.id)) return
      
      if (flight.flightPairId) {
        const returnFlight = rangeFlights.find(f => 
          f.flightPairId === flight.flightPairId && 
          f.id !== flight.id && 
          f.isReturn !== flight.isReturn
        )
        
        if (returnFlight) {
          const outbound = flight.isReturn ? returnFlight : flight
          const returnF = flight.isReturn ? flight : returnFlight
          pairs.push({ outbound, return: returnF })
          processedFlights.add(flight.id)
          processedFlights.add(returnFlight.id)
        }
      }
    })
    
    return pairs
  }

  const connectedPairs = getConnectedPairs()

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 p-3 sm:p-4 rounded-lg space-y-3 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-x-4">
          <h3 className="text-base sm:text-lg font-semibold">Flight Schedule for {getZoomLabel()}</h3>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <Plane className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{rangeFlights.length} flights</span>
            {conflicts.length > 0 && (
              <div className="flex items-center space-x-1 text-orange-600">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{conflicts.length} conflicts</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-xs sm:text-sm text-gray-600 font-medium">Zoom:</span>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setZoomLevel('week')}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm transition-colors ${
                zoomLevel === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setZoomLevel('month')}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm transition-colors ${
                zoomLevel === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
          </div>
          
          {/* Manual Zoom Controls */}
          <div className="flex items-center space-x-1 ml-1 sm:ml-2">
            <button
              onClick={() => {
                if (zoomLevel === 'month') return
                if (zoomLevel === 'week') setZoomLevel('month')
              }}
              disabled={zoomLevel === 'month'}
              className="p-1 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => {
                if (zoomLevel === 'week') return
                if (zoomLevel === 'month') setZoomLevel('week')
              }}
              disabled={zoomLevel === 'week'}
              className="p-1 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
        
        {/* Weather Summary */}
        {weatherData && (
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
            <span className="font-medium text-gray-700">Weather Summary:</span>
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto">
              {Array.from(new Set(rangeFlights.flatMap(f => [f.origin, f.destination]))).slice(0, 5).map(airport => {
                const weather = weatherData[airport]
                if (!weather) return null
                return (
                  <div key={airport} className="flex items-center space-x-1 sm:space-x-2 bg-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-200 flex-shrink-0">
                    <span className="font-medium text-gray-700 text-xs sm:text-sm">{airport}</span>
                    {getWeatherIcon(weather.condition)}
                    <span className="text-gray-600 text-xs sm:text-sm">{weather.temperature}°C</span>
                    <span className="text-gray-500 text-xs hidden sm:block">{weather.condition}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setShowConflicts(!showConflicts)}
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
              showConflicts 
                ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            {showConflicts ? 'Hide' : 'Show'} Conflicts
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-blue-500 rounded-full"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full"></div>
              <span>In Flight</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-orange-500 rounded-full"></div>
              <span>Delayed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Warnings */}
      {showConflicts && conflicts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
          <h4 className="font-medium text-orange-800 mb-2 sm:mb-3 flex items-center space-x-1 sm:space-x-2">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Flight Conflicts Detected</span>
          </h4>
          <div className="space-y-2">
            {conflicts.map((conflict, index) => {
              const aircraftInfo = getAircraftInfo(conflict.aircraftId)
              return (
                <div key={index} className="text-xs sm:text-sm text-orange-700 bg-orange-100 p-2 sm:p-3 rounded border border-orange-200">
                  <div className="font-medium mb-1">
                    Aircraft Conflict: {aircraftInfo?.type} ({aircraftInfo?.registration})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs">
                    <div>
                      <span className="font-medium">{conflict.flight1.flightNumber}:</span> {conflict.flight1.origin} → {conflict.flight1.destination}
                      <br />
                      <span className="text-orange-600">
                        {format(parseISO(conflict.flight1.start_date), 'MMM d, HH:mm')} - {format(parseISO(conflict.flight1.end_date), 'MMM d, HH:mm')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">{conflict.flight2.flightNumber}:</span> {conflict.flight2.origin} → {conflict.flight2.destination}
                      <br />
                      <span className="text-orange-600">
                        {format(parseISO(conflict.flight2.start_date), 'MMM d, HH:mm')} - {format(parseISO(conflict.flight2.end_date), 'MMM d, HH:mm')}
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
        {/* Time Header - Date headers and hourly slots */}
        <div className="border-b border-gray-200">
          {/* Date Headers */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <div className="w-48 sm:w-64 bg-gray-50 p-2 sm:p-3 font-medium text-gray-700 border-r border-gray-200 flex-shrink-0">
              <span className="hidden sm:inline">Aircraft & Flight</span>
              <span className="sm:hidden">Aircraft</span>
            </div>
            {Array.from({ length: zoomLevel === 'week' ? 7 : 31 }, (_, i) => {
              const date = zoomLevel === 'week' 
                ? addDays(startOfWeek(selectedDateObj, { weekStartsOn: 1 }), i)
                : addDays(startOfMonth(selectedDateObj), i)
              return (
                <div
                  key={i}
                  className="flex-1 p-1 sm:p-2 text-center text-xs text-gray-600 border-r border-gray-200 min-w-[80px] sm:min-w-[120px] flex-shrink-0"
                >
                  <div className="font-medium">{format(date, 'EEE')}</div>
                  <div className="text-gray-500 hidden sm:block">{format(date, 'MMM d')}</div>
                  <div className="text-gray-500 sm:hidden">{format(date, 'd')}</div>
                </div>
              )
            })}
          </div>
          
          {/* Hour Headers */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <div className="w-48 sm:w-64 bg-gray-50 p-2 border-r border-gray-200 flex-shrink-0">
              <div className="text-xs text-gray-500 text-center">Hours</div>
            </div>
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className="flex-1 p-1 text-center text-xs text-gray-500 border-r border-gray-200 min-w-[40px] sm:min-w-[60px] flex-shrink-0"
              >
                <span className="hidden sm:inline">{format(addHours(new Date(), hour), 'HH:mm')}</span>
                <span className="sm:hidden">{format(addHours(new Date(), hour), 'HH')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aircraft Rows with Flights */}
        {flightsByAircraft.length === 0 ? (
          <div className="p-4 sm:p-8 text-center text-gray-500">
            <Plane className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-gray-300" />
            <p className="text-sm sm:text-base">No flights scheduled for this {zoomLevel}</p>
            <p className="text-xs sm:text-sm">Add some flights to see them in the timeline</p>
          </div>
        ) : (
          flightsByAircraft.map(({ aircraft: aircraftItem, flights: aircraftFlights }) => (
            <div 
              key={aircraftItem.id} 
              className={`flex border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                draggedFlight && draggedFlight.aircraftId !== aircraftItem.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onDragOver={(e) => handleAircraftDragOver(e, aircraftItem)}
              onDrop={(e) => handleAircraftDrop(e, aircraftItem)}
            >
              {/* Left Side - Aircraft Information */}
              <div className="w-48 sm:w-64 p-2 sm:p-3 border-r border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="font-medium text-gray-900 text-sm sm:text-base">{aircraftItem.type}</div>
                <div className="text-xs sm:text-sm text-gray-600">{aircraftItem.registration}</div>
                <div className="text-xs text-gray-500 hidden sm:block">Capacity: {aircraftItem.capacity}</div>
                {draggedFlight && draggedFlight.aircraftId !== aircraftItem.id && (
                  <div className="text-xs text-blue-600 font-medium mt-1 sm:mt-2">
                    Drop here to move flight
                  </div>
                )}
              </div>
              
              {/* Right Side - Timeline with Flights */}
              <div className="flex-1 relative h-16">
                {/* Drop zone indicator */}
                {draggedFlight && draggedFlight.aircraftId !== aircraftItem.id && (
                  <div className="absolute inset-0 bg-blue-50 bg-opacity-30 border-2 border-dashed border-blue-300 rounded flex items-center justify-center">
                    <div className="text-blue-600 text-sm font-medium">
                      Drop flight here to move to {aircraftItem.registration}
                    </div>
                  </div>
                )}
                
                {aircraftFlights.map((flight) => {
                  const isDragging = draggedFlight?.id === flight.id
                  const isDragOver = dragOverFlight?.id === flight.id
                  const hasConflict = isFlightInConflict(flight.id)
                  const position = getFlightPosition(flight)
                  
                  // Check if this flight is part of a pair being dragged
                  const draggedPair = draggedFlight ? connectedPairs.find(pair => 
                    pair.outbound.id === draggedFlight.id || pair.return.id === draggedFlight.id
                  ) : null
                  const isPartOfDraggedPair = draggedPair && (
                    draggedPair.outbound.id === flight.id || draggedPair.return.id === flight.id
                  )
                  
                  return (
                    <div
                      key={flight.id}
                      className={`absolute top-1/2 transform -translate-y-1/2 h-8 rounded-md border-2 ${getAircraftColor(flight.aircraftId)} ${getStatusColor(flight.status)} opacity-80 cursor-move ${
                        hasConflict ? 'ring-2 ring-orange-400 ring-opacity-75' : ''
                      } ${isDragging || isPartOfDraggedPair ? 'opacity-50' : ''} ${isDragOver ? 'ring-2 ring-blue-400' : ''} ${
                        isPartOfDraggedPair ? 'ring-2 ring-blue-300 ring-opacity-50' : ''
                      }`}
                      style={{ left: position.left, width: position.width }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, flight)}
                      onDragOver={(e) => handleDragOver(e, flight)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, flight)}
                      title={`${flight.flightNumber} - Drag to move entire flight pair`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-white px-2 truncate">
                          {flight.flightNumber}
                        </span>
                      </div>
                    </div>
                  )
                })}
                
                {/* Connected Flight Pair Lines */}
                {connectedPairs
                  .filter(pair => 
                    aircraftFlights.some(f => f.id === pair.outbound.id || f.id === pair.return.id)
                  )
                  .map((pair, index) => {
                    const outboundPos = getFlightPosition(pair.outbound)
                    const returnPos = getFlightPosition(pair.return)
                    
                    // Calculate line position between flights
                    const outboundCenter = parseFloat(outboundPos.left) + parseFloat(outboundPos.width) / 2
                    const returnCenter = parseFloat(returnPos.left) + parseFloat(returnPos.width) / 2
                    
                    if (Math.abs(outboundCenter - returnCenter) < 5) return null // Skip if flights are too close
                    
                    const lineLeft = Math.min(outboundCenter, returnCenter)
                    const lineWidth = Math.abs(outboundCenter - returnCenter)
                    
                    // Check if this pair is being dragged
                    const isPairBeingDragged = draggedFlight && (
                      pair.outbound.id === draggedFlight.id || pair.return.id === draggedFlight.id
                    )
                    
                    return (
                      <div
                        key={index}
                        className={`absolute top-1/2 transform -translate-y-1/2 h-0.5 bg-blue-400 transition-opacity ${
                          isPairBeingDragged ? 'opacity-30' : 'opacity-60'
                        }`}
                        style={{
                          left: `${lineLeft}%`,
                          width: `${lineWidth}%`,
                          zIndex: 1
                        }}
                      />
                    )
                  })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
        <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">{zoomLevel.charAt(0).toUpperCase() + zoomLevel.slice(1)} Flight Summary</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{rangeFlights.length}</div>
            <div className="text-gray-600">Total Flights</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              {rangeFlights.filter(f => f.status === 'arrived').length}
            </div>
            <div className="text-gray-600">Arrived</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-bold text-yellow-600">
              {rangeFlights.filter(f => f.status === 'boarding' || f.status === 'departed').length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="text-center hidden sm:block">
            <div className="text-lg sm:text-2xl font-bold text-orange-600">
              {rangeFlights.filter(f => f.status === 'delayed').length}
            </div>
            <div className="text-gray-600">Delayed</div>
          </div>
          <div className="text-center hidden sm:block">
            <div className="text-lg sm:text-2xl font-bold text-red-600">{connectedPairs.length}</div>
            <div className="text-gray-600">Flight Pairs</div>
          </div>
        </div>
      </div>
    </div>
  )
}
