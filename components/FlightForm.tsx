'use client'

import { useState } from 'react'
import { FlightFormData, Aircraft } from '../types/activity'
import { Plane, MapPin, Clock, Users, Hash, Building, RotateCcw } from 'lucide-react'

interface FlightFormProps {
  onSubmit: (flight: Omit<FlightFormData, 'id'>) => void
  aircraft: Aircraft[]
}

export default function FlightForm({ onSubmit, aircraft }: FlightFormProps) {
  const [formData, setFormData] = useState<FlightFormData>({
    flightNumber: '',
    aircraftId: 0,
    origin: '',
    destination: '',
    start_date: new Date().toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
    status: 'scheduled',
    passengers: 0,
    crew: 4,
    gate: '',
    terminal: ''
  })

  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [returnFlight, setReturnFlight] = useState({
    flightNumber: '',
    start_date: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString().slice(0, 16),
    gate: '',
    terminal: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.flightNumber.trim() && formData.aircraftId && formData.origin.trim() && formData.destination.trim()) {
      // Submit outbound flight
      onSubmit(formData)
      
      // Submit return flight if it's a round trip
      if (isRoundTrip && returnFlight.flightNumber.trim()) {
        const returnFlightData: FlightFormData = {
          ...formData,
          flightNumber: returnFlight.flightNumber,
          origin: formData.destination, // Swap origin/destination
          destination: formData.origin,
          start_date: returnFlight.start_date,
          end_date: returnFlight.end_date,
          gate: returnFlight.gate,
          terminal: returnFlight.terminal,
          isReturn: true
        }
        onSubmit(returnFlightData)
      }
      
      // Reset form
      setFormData({
        flightNumber: '',
        aircraftId: 0,
        origin: '',
        destination: '',
        start_date: new Date().toISOString().slice(0, 16),
        end_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
        status: 'scheduled',
        passengers: 0,
        crew: 4,
        gate: '',
        terminal: ''
      })
      setReturnFlight({
        flightNumber: '',
        start_date: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16),
        end_date: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString().slice(0, 16),
        gate: '',
        terminal: ''
      })
      setIsRoundTrip(false)
    }
  }

  const getSelectedAircraft = () => {
    return aircraft.find(a => a.id === formData.aircraftId)
  }

  const handleRoundTripToggle = () => {
    setIsRoundTrip(!isRoundTrip)
    if (!isRoundTrip) {
      // Auto-generate return flight number
      const baseNumber = formData.flightNumber.replace(/(\d+)$/, (match, num) => {
        const nextNum = parseInt(num) + 1
        return match.replace(num, nextNum.toString())
      })
      setReturnFlight(prev => ({
        ...prev,
        flightNumber: baseNumber
      }))
    }
  }

  const updateReturnFlight = (field: keyof typeof returnFlight, value: string) => {
    setReturnFlight(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Round Trip Toggle */}
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Round Trip Flight</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isRoundTrip}
            onChange={handleRoundTripToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Outbound Flight Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Outbound Flight
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Flight Number
          </label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.flightNumber}
              onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value.toUpperCase() })}
              placeholder="e.g., AA123, BA456"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aircraft
          </label>
          <select
            value={formData.aircraftId}
            onChange={(e) => setFormData({ ...formData, aircraftId: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value={0}>Select Aircraft</option>
            {aircraft.filter(a => a.status === 'active').map(aircraft => (
              <option key={aircraft.id} value={aircraft.id}>
                {aircraft.type} - {aircraft.registration} (Capacity: {aircraft.capacity})
              </option>
            ))}
          </select>
          {formData.aircraftId > 0 && getSelectedAircraft() && (
            <div className="mt-1 text-xs text-gray-600">
              Selected: {getSelectedAircraft()?.type} - {getSelectedAircraft()?.registration}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origin
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value.toUpperCase() })}
                placeholder="e.g., JFK, LHR"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value.toUpperCase() })}
                placeholder="e.g., LAX, CDG"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Flight Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="scheduled">Scheduled</option>
            <option value="boarding">Boarding</option>
            <option value="departed">Departed</option>
            <option value="arrived">Arrived</option>
            <option value="delayed">Delayed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passengers
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 0 })}
                min="0"
                max={getSelectedAircraft()?.capacity || 1000}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crew
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={formData.crew}
                onChange={(e) => setFormData({ ...formData, crew: parseInt(e.target.value) || 0 })}
                min="1"
                max="20"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gate
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.gate}
                onChange={(e) => setFormData({ ...formData, gate: e.target.value.toUpperCase() })}
                placeholder="e.g., A1, B12"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terminal
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.terminal}
                onChange={(e) => setFormData({ ...formData, terminal: e.target.value.toUpperCase() })}
                placeholder="e.g., 1, 2, 3"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Return Flight Section */}
      {isRoundTrip && (
        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-lg font-medium text-green-900 border-b border-green-200 pb-2">
            Return Flight
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Return Flight Number
            </label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
              <input
                type="text"
                value={returnFlight.flightNumber}
                onChange={(e) => updateReturnFlight('flightNumber', e.target.value.toUpperCase())}
                placeholder="e.g., AA124, BA457"
                className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Return Departure Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                <input
                  type="datetime-local"
                  value={returnFlight.start_date}
                  onChange={(e) => updateReturnFlight('start_date', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Return Arrival Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                <input
                  type="datetime-local"
                  value={returnFlight.end_date}
                  onChange={(e) => updateReturnFlight('end_date', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Return Gate
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                <input
                  type="text"
                  value={returnFlight.gate}
                  onChange={(e) => updateReturnFlight('gate', e.target.value.toUpperCase())}
                  placeholder="e.g., A3, B15"
                  className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Return Terminal
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                <input
                  type="text"
                  value={returnFlight.terminal}
                  onChange={(e) => updateReturnFlight('terminal', e.target.value.toUpperCase())}
                  placeholder="e.g., 1, 2, 3"
                  className="w-full pl-10 pr-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium"
      >
        {isRoundTrip ? 'Add Round Trip Flights' : 'Add Flight'}
      </button>
    </form>
  )
}
