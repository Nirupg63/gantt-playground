'use client'

import { useState } from 'react'
import { AircraftFormData } from '../types/activity'
import { Plane, Hash, Users, Activity, Calendar, Wrench } from 'lucide-react'

interface AircraftFormProps {
  onSubmit: (aircraft: Omit<AircraftFormData, 'id'>) => void
}

export default function AircraftForm({ onSubmit }: AircraftFormProps) {
  const [formData, setFormData] = useState<AircraftFormData>({
    type: '',
    registration: '',
    capacity: 150,
    status: 'active'
  })

  const [maintenanceDate, setMaintenanceDate] = useState('')
  const [maintenanceNotes, setMaintenanceNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.type.trim() && formData.registration.trim()) {
      // If status is maintenance, add maintenance info
      const aircraftData = {
        ...formData,
        maintenanceDate: formData.status === 'maintenance' ? maintenanceDate : undefined,
        maintenanceNotes: formData.status === 'maintenance' ? maintenanceNotes : undefined
      }
      
      onSubmit(aircraftData)
      setFormData({
        type: '',
        registration: '',
        capacity: 150,
        status: 'active'
      })
      setMaintenanceDate('')
      setMaintenanceNotes('')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'maintenance': return 'text-yellow-600'
      case 'grounded': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />
      case 'maintenance': return <Wrench className="w-4 h-4" />
      case 'grounded': return <Activity className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100'
      case 'maintenance': return 'bg-yellow-100'
      case 'grounded': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Aircraft Type
        </label>
        <div className="relative">
          <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="e.g., Boeing 737, Airbus A320"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Registration
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={formData.registration}
            onChange={(e) => setFormData({ ...formData, registration: e.target.value.toUpperCase() })}
            placeholder="e.g., N12345, G-ABCD"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Passenger Capacity
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
            min="1"
            max="1000"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="grounded">Grounded</option>
        </select>
      </div>

      {/* Maintenance Details */}
      {formData.status === 'maintenance' && (
        <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-medium text-yellow-800 flex items-center space-x-2">
            <Wrench className="w-4 h-4" />
            <span>Maintenance Details</span>
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              Maintenance Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <input
                type="date"
                value={maintenanceDate}
                onChange={(e) => setMaintenanceDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              Maintenance Notes
            </label>
            <textarea
              value={maintenanceNotes}
              onChange={(e) => setMaintenanceNotes(e.target.value)}
              placeholder="Describe the maintenance required..."
              rows={3}
              className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
      >
        Add Aircraft
      </button>
    </form>
  )
}
