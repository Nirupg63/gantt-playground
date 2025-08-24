'use client'

import { useState } from 'react'
import { Flight, Aircraft, ConflictResolution } from '../types/activity'
import { AlertTriangle, Clock, Plane, MapPin, DollarSign, CheckCircle, XCircle } from 'lucide-react'

interface ConflictResolverProps {
  conflicts: Array<{flight1: Flight, flight2: Flight, aircraftId: number}>
  aircraft: Aircraft[]
  onResolveConflict: (resolution: ConflictResolution, flight1Id: number, flight2Id: number) => void
}

export default function ConflictResolver({ conflicts, aircraft, onResolveConflict }: ConflictResolverProps) {
  const [selectedConflict, setSelectedConflict] = useState<number | null>(null)
  const [selectedResolution, setSelectedResolution] = useState<ConflictResolution | null>(null)

  const generateResolutions = (conflict: {flight1: Flight, flight2: Flight, aircraftId: number}): ConflictResolution[] => {
    const { flight1, flight2, aircraftId } = conflict
    const aircraftInfo = aircraft.find(a => a.id === aircraftId)
    
    const resolutions: ConflictResolution[] = [
      {
        type: 'delay',
        description: `Delay ${flight2.flightNumber} by 30 minutes to avoid overlap`,
        impact: 'low',
        estimatedCost: 1500,
        recommended: true
      },
      {
        type: 'aircraft_swap',
        description: `Swap ${flight1.flightNumber} to aircraft ${aircraft.find(a => a.id !== aircraftId && a.status === 'active')?.registration || 'N/A'}`,
        impact: 'medium',
        estimatedCost: 2500,
        recommended: false
      },
      {
        type: 'reroute',
        description: `Reroute ${flight2.flightNumber} through alternative route`,
        impact: 'high',
        estimatedCost: 5000,
        recommended: false
      },
      {
        type: 'cancel',
        description: `Cancel ${flight2.flightNumber} and rebook passengers`,
        impact: 'high',
        estimatedCost: 8000,
        recommended: false
      }
    ]
    
    return resolutions
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay': return <Clock className="w-4 h-4" />
      case 'aircraft_swap': return <Plane className="w-4 h-4" />
      case 'reroute': return <MapPin className="w-4 h-4" />
      case 'cancel': return <XCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  if (conflicts.length === 0) {
    return null
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Conflict Resolution</h3>
        <span className="text-sm text-gray-500">({conflicts.length} conflicts detected)</span>
      </div>

      <div className="space-y-4">
        {conflicts.map((conflict, index) => {
          const aircraftInfo = aircraft.find(a => a.id === conflict.aircraftId)
          const resolutions = generateResolutions(conflict)
          const isExpanded = selectedConflict === index
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedConflict(isExpanded ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">
                      Aircraft Conflict: {aircraftInfo?.type} ({aircraftInfo?.registration})
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {isExpanded ? '▼' : '▶'}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 space-y-4">
                  {/* Conflict Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <div className="font-medium text-blue-800 mb-2">{conflict.flight1.flightNumber}</div>
                      <div className="text-blue-700">
                        <div>{conflict.flight1.origin} → {conflict.flight1.destination}</div>
                        <div className="text-xs text-blue-600">
                          {new Date(conflict.flight1.start_date).toLocaleTimeString()} - {new Date(conflict.flight1.end_date).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 p-3 rounded border border-red-200">
                      <div className="font-medium text-red-800 mb-2">{conflict.flight2.flightNumber}</div>
                      <div className="text-red-700">
                        <div>{conflict.flight2.origin} → {conflict.flight2.destination}</div>
                        <div className="text-xs text-red-600">
                          {new Date(conflict.flight2.start_date).toLocaleTimeString()} - {new Date(conflict.flight2.end_date).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resolution Options */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Recommended Solutions</h4>
                    <div className="space-y-2">
                      {resolutions.map((resolution, resIndex) => (
                        <div 
                          key={resIndex}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedResolution === resolution 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedResolution(resolution)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getTypeIcon(resolution.type)}
                              <div>
                                <div className="font-medium text-gray-900">{resolution.description}</div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(resolution.impact)}`}>
                                    {resolution.impact} impact
                                  </span>
                                  {resolution.estimatedCost && (
                                    <span className="flex items-center space-x-1">
                                      <DollarSign className="w-3 h-3" />
                                      <span>${resolution.estimatedCost.toLocaleString()}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {resolution.recommended && (
                                <span className="text-green-600 text-sm font-medium flex items-center space-x-1">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Recommended</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  {selectedResolution && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          onResolveConflict(selectedResolution, conflict.flight1.id, conflict.flight2.id)
                          setSelectedResolution(null)
                          setSelectedConflict(null)
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Apply Resolution
                      </button>
                      <button
                        onClick={() => setSelectedResolution(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
