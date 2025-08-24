'use client'

import { Flight, Aircraft } from '../types/activity'
import { TrendingUp, TrendingDown, Plane, Users, Clock, DollarSign, AlertTriangle } from 'lucide-react'

interface AnalyticsDashboardProps {
  flights: Flight[]
  aircraft: Aircraft[]
  selectedDate: string
}

export default function AnalyticsDashboard({ flights, aircraft, selectedDate }: AnalyticsDashboardProps) {
  const today = new Date(selectedDate)
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
  
  const dayFlights = flights.filter(flight => {
    const startDate = new Date(flight.start_date)
    const endDate = new Date(flight.end_date)
    return startDate >= startOfDay && endDate <= endOfDay
  })

  const totalPassengers = dayFlights.reduce((sum, flight) => sum + flight.passengers, 0)
  const totalCrew = dayFlights.reduce((sum, flight) => sum + flight.crew, 0)
  const totalRevenue = totalPassengers * 150 // Assuming $150 average ticket price
  const onTimeFlights = dayFlights.filter(f => f.status === 'arrived' || f.status === 'departed').length
  const delayedFlights = dayFlights.filter(f => f.status === 'delayed').length
  const cancelledFlights = dayFlights.filter(f => f.status === 'cancelled').length
  
  const onTimeRate = dayFlights.length > 0 ? (onTimeFlights / dayFlights.length) * 100 : 0
  const delayRate = dayFlights.length > 0 ? (delayedFlights / dayFlights.length) * 100 : 0
  
  const aircraftUtilization = aircraft.map(ac => {
    const aircraftFlights = dayFlights.filter(f => f.aircraftId === ac.id)
    const totalFlightTime = aircraftFlights.reduce((sum, flight) => {
      const start = new Date(flight.start_date)
      const end = new Date(flight.end_date)
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60) // hours
    }, 0)
    return {
      aircraft: ac,
      utilization: (totalFlightTime / 24) * 100,
      flights: aircraftFlights.length
    }
  }).sort((a, b) => b.utilization - a.utilization)

  const topRoutes = dayFlights.reduce((acc, flight) => {
    const route = `${flight.origin} → ${flight.destination}`
    acc[route] = (acc[route] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const sortedRoutes = Object.entries(topRoutes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Analytics Dashboard</h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Flights</p>
              <p className="text-2xl font-bold text-blue-900">{dayFlights.length}</p>
            </div>
            <Plane className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Passengers</p>
              <p className="text-2xl font-bold text-green-900">{totalPassengers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">On-Time Rate</p>
              <p className="text-2xl font-bold text-yellow-900">{onTimeRate.toFixed(1)}%</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Revenue</p>
              <p className="text-2xl font-bold text-purple-900">${(totalRevenue / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Flight Status Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">On Time</span>
              <span className="text-sm font-medium text-green-600">{onTimeFlights} flights</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Delayed</span>
              <span className="text-sm font-medium text-yellow-600">{delayedFlights} flights</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cancelled</span>
              <span className="text-sm font-medium text-red-600">{cancelledFlights} flights</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Crew & Staff</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Crew</span>
              <span className="text-sm font-medium text-blue-600">{totalCrew}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Aircraft</span>
              <span className="text-sm font-medium text-green-600">
                {aircraft.filter(a => a.status === 'active').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Maintenance</span>
              <span className="text-sm font-medium text-yellow-600">
                {aircraft.filter(a => a.status === 'maintenance').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Aircraft Utilization */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-3">Aircraft Utilization</h4>
        <div className="space-y-3">
          {aircraftUtilization.slice(0, 5).map((item) => (
            <div key={item.aircraft.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">
                  {item.aircraft.type} ({item.aircraft.registration})
                </span>
                <span className="text-xs text-gray-500">{item.flights} flights</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.utilization > 80 ? 'bg-green-500' : 
                      item.utilization > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(item.utilization, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {item.utilization.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Routes */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Top Routes Today</h4>
        <div className="space-y-2">
          {sortedRoutes.map(([route, count], index) => (
            <div key={route} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                <span className="text-sm font-medium text-gray-900">{route}</span>
              </div>
              <span className="text-sm text-blue-600 font-medium">{count} flights</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
