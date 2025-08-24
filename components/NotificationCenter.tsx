'use client'

import { useState, useEffect } from 'react'
import { Flight, Aircraft, WeatherCondition } from '../types/activity'
import { Bell, X, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationCenterProps {
  flights: Flight[]
  aircraft: Aircraft[]
  weatherData: Record<string, WeatherCondition>
  selectedDate: string
}

export default function NotificationCenter({ flights, aircraft, weatherData, selectedDate }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    generateNotifications()
  }, [flights, aircraft, weatherData, selectedDate])

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  const generateNotifications = () => {
    const newNotifications: Notification[] = []
    const today = new Date(selectedDate)
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
    
    const dayFlights = flights.filter(flight => {
      const startDate = new Date(flight.start_date)
      const endDate = new Date(flight.end_date)
      return startDate >= startOfDay && endDate <= endOfDay
    })

    // Check for flight conflicts
    const conflicts: Array<{flight1: Flight, flight2: Flight, aircraftId: number}> = []
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

    if (conflicts.length > 0) {
      newNotifications.push({
        id: 'conflicts',
        type: 'error',
        title: 'Flight Conflicts Detected',
        message: `${conflicts.length} aircraft conflicts detected for today's schedule`,
        timestamp: new Date(),
        read: false
      })
    }

    // Check for weather warnings
    Object.entries(weatherData).forEach(([airport, weather]) => {
      if (weather.condition === 'storm' || weather.condition === 'fog') {
        newNotifications.push({
          id: `weather-${airport}`,
          type: 'warning',
          title: `Weather Warning - ${airport}`,
          message: `${weather.condition} conditions at ${airport}: ${weather.description}`,
          timestamp: new Date(),
          read: false
        })
      }
      
      // Temperature extremes
      if (weather.temperature > 35 || weather.temperature < -10) {
        newNotifications.push({
          id: `temp-${airport}`,
          type: 'warning',
          title: `Temperature Alert - ${airport}`,
          message: `Extreme temperature at ${airport}: ${weather.temperature}°C`,
          timestamp: new Date(),
          read: false
        })
      }
      
      // High wind speed warnings
      if (weather.windSpeed > 30) {
        newNotifications.push({
          id: `wind-${airport}`,
          type: 'warning',
          title: `Wind Warning - ${airport}`,
          message: `High winds at ${airport}: ${weather.windSpeed} km/h`,
          timestamp: new Date(),
          read: false
        })
      }
      
      // Low visibility warnings
      if (weather.visibility < 3) {
        newNotifications.push({
          id: `visibility-${airport}`,
          type: 'error',
          title: `Visibility Alert - ${airport}`,
          message: `Low visibility at ${airport}: ${weather.visibility} km`,
          timestamp: new Date(),
          read: false
        })
      }
    })

    // Check for weather-related flight impacts
    dayFlights.forEach(flight => {
      const originWeather = weatherData[flight.origin]
      const destWeather = weatherData[flight.destination]
      
      if (originWeather) {
        if (originWeather.condition === 'storm' || 
            (originWeather.condition === 'fog' && originWeather.visibility < 2) ||
            originWeather.windSpeed > 25) {
          newNotifications.push({
            id: `flight-weather-${flight.id}-origin`,
            type: 'warning',
            title: `Weather Impact on Flight ${flight.flightNumber}`,
            message: `Departure from ${flight.origin} may be delayed due to ${originWeather.condition} conditions`,
            timestamp: new Date(),
            read: false
          })
        }
      }
      
      if (destWeather) {
        if (destWeather.condition === 'storm' || 
            (destWeather.condition === 'fog' && destWeather.visibility < 2) ||
            destWeather.windSpeed > 25) {
          newNotifications.push({
            id: `flight-weather-${flight.id}-dest`,
            type: 'warning',
            title: `Weather Impact on Flight ${flight.flightNumber}`,
            message: `Arrival at ${flight.destination} may be affected by ${destWeather.condition} conditions`,
            timestamp: new Date(),
            read: false
          })
        }
      }
    })

    // Check for delayed flights
    const delayedFlights = dayFlights.filter(f => f.status === 'delayed')
    if (delayedFlights.length > 0) {
      newNotifications.push({
        id: 'delayed-flights',
        type: 'warning',
        title: 'Delayed Flights',
        message: `${delayedFlights.length} flights are currently delayed`,
        timestamp: new Date(),
        read: false
      })
    }

    // Check for maintenance aircraft
    const maintenanceAircraft = aircraft.filter(a => a.status === 'maintenance')
    if (maintenanceAircraft.length > 0) {
      newNotifications.push({
        id: 'maintenance',
        type: 'info',
        title: 'Aircraft Maintenance',
        message: `${maintenanceAircraft.length} aircraft currently under maintenance`,
        timestamp: new Date(),
        read: false
      })
    }

    // Check for high utilization aircraft
    const highUtilization = aircraft.map(ac => {
      const aircraftFlights = dayFlights.filter(f => f.aircraftId === ac.id)
      const totalFlightTime = aircraftFlights.reduce((sum, flight) => {
        const start = new Date(flight.start_date)
        const end = new Date(flight.end_date)
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      }, 0)
      return { aircraft: ac, utilization: (totalFlightTime / 24) * 100 }
    }).filter(item => item.utilization > 90)

    if (highUtilization.length > 0) {
      newNotifications.push({
        id: 'high-utilization',
        type: 'info',
        title: 'High Aircraft Utilization',
        message: `${highUtilization.length} aircraft operating at >90% capacity today`,
        timestamp: new Date(),
        read: false
      })
    }

    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n.id))
      const filteredNew = newNotifications.filter(n => !existingIds.has(n.id))
      return [...prev, ...filteredNew]
    })
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info': return 'border-blue-200 bg-blue-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'error': return 'border-red-200 bg-red-50'
      case 'success': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" />
                <p>All clear! No notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} ${
                      !notification.read ? 'ring-2 ring-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleTimeString()}
                            </span>
                            <button
                              onClick={() => clearNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
