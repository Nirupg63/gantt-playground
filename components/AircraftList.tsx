'use client'

import { Aircraft } from '../types/activity'
import { Plane, Hash, Users, Activity, Edit, Trash2 } from 'lucide-react'

interface AircraftListProps {
  aircraft: Aircraft[]
  onUpdate: (id: number, updates: Partial<Aircraft>) => void
  onDelete: (id: number) => void
  selectedAircraftId?: number
  onSelectAircraft?: (aircraftId: number) => void
}

export default function AircraftList({ 
  aircraft, 
  onUpdate, 
  onDelete, 
  selectedAircraftId,
  onSelectAircraft 
}: AircraftListProps) {
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
      case 'maintenance': return <Activity className="w-4 h-4" />
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
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Plane className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Aircraft Fleet</h3>
      </div>

      {aircraft.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No aircraft in fleet</p>
          <p className="text-sm">Add aircraft to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {aircraft.map((aircraftItem) => (
            <div
              key={aircraftItem.id}
              className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedAircraftId === aircraftItem.id 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectAircraft?.(aircraftItem.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Plane className="w-4 h-4 text-primary-600" />
                    <h4 className="font-medium text-gray-900 text-sm">{aircraftItem.type}</h4>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                    <Hash className="w-3 h-3" />
                    <span>{aircraftItem.registration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-600 mb-3">
                    <Users className="w-3 h-3" />
                    <span>Capacity: {aircraftItem.capacity} passengers</span>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle edit - you can implement inline editing here
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(aircraftItem.id)
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBgColor(aircraftItem.status)} ${getStatusColor(aircraftItem.status)}`}>
                {getStatusIcon(aircraftItem.status)}
                <span className="capitalize">{aircraftItem.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fleet Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-gray-900 mb-3 text-sm">Fleet Summary</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {aircraft.filter(a => a.status === 'active').length}
            </div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">
              {aircraft.filter(a => a.status === 'maintenance').length}
            </div>
            <div className="text-gray-600">Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {aircraft.filter(a => a.status === 'grounded').length}
            </div>
            <div className="text-gray-600">Grounded</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {aircraft.length}
            </div>
            <div className="text-gray-600">Total</div>
          </div>
        </div>
      </div>
    </div>
  )
}
