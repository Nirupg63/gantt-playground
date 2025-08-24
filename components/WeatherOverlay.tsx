'use client'

import { useState } from 'react'
import { WeatherCondition } from '../types/activity'
import { Cloud, CloudRain, CloudSnow, Zap, Eye, Thermometer, Wind } from 'lucide-react'

interface WeatherOverlayProps {
  airports: string[]
  onWeatherChange: (airport: string, weather: WeatherCondition) => void
}

// Mock weather data - in a real app, this would come from a weather API
const mockWeatherData: Record<string, WeatherCondition> = {
  'JFK': {
    condition: 'clear',
    temperature: 22,
    windSpeed: 15,
    visibility: 10,
    description: 'Clear skies with light winds'
  },
  'LAX': {
    condition: 'cloudy',
    temperature: 18,
    windSpeed: 8,
    visibility: 8,
    description: 'Partly cloudy with calm conditions'
  },
  'ORD': {
    condition: 'rain',
    temperature: 12,
    windSpeed: 25,
    visibility: 3,
    description: 'Heavy rain with strong winds'
  },
  'LHR': {
    condition: 'fog',
    temperature: 8,
    windSpeed: 12,
    visibility: 1,
    description: 'Dense fog reducing visibility'
  },
  'CDG': {
    condition: 'clear',
    temperature: 16,
    windSpeed: 18,
    visibility: 9,
    description: 'Clear conditions with moderate winds'
  },
  'ATL': {
    condition: 'storm',
    temperature: 24,
    windSpeed: 35,
    visibility: 2,
    description: 'Thunderstorms with heavy rain'
  },
  'SFO': {
    condition: 'fog',
    temperature: 14,
    windSpeed: 10,
    visibility: 2,
    description: 'Morning fog clearing by afternoon'
  },
  'DEN': {
    condition: 'snow',
    temperature: -2,
    windSpeed: 20,
    visibility: 5,
    description: 'Light snow with moderate winds'
  },
  'MIA': {
    condition: 'clear',
    temperature: 28,
    windSpeed: 12,
    visibility: 10,
    description: 'Clear and sunny with light breeze'
  },
  'FRA': {
    condition: 'cloudy',
    temperature: 10,
    windSpeed: 22,
    visibility: 7,
    description: 'Overcast with strong winds'
  },
  'DXB': {
    condition: 'clear',
    temperature: 32,
    windSpeed: 8,
    visibility: 10,
    description: 'Clear and hot with light winds'
  },
  'SYD': {
    condition: 'rain',
    temperature: 20,
    windSpeed: 30,
    visibility: 4,
    description: 'Heavy rainfall with strong winds'
  },
  'AKL': {
    condition: 'clear',
    temperature: 16,
    windSpeed: 15,
    visibility: 9,
    description: 'Clear skies with moderate winds'
  },
  'PEK': {
    condition: 'cloudy',
    temperature: 14,
    windSpeed: 18,
    visibility: 6,
    description: 'Cloudy with moderate winds'
  }
}

export default function WeatherOverlay({ airports, onWeatherChange }: WeatherOverlayProps) {
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null)
  const [showWeatherForm, setShowWeatherForm] = useState(false)
  const [weatherForm, setWeatherForm] = useState<Partial<WeatherCondition>>({})

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear': return <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />
      case 'rain': return <CloudRain className="w-6 h-6 text-blue-500" />
      case 'snow': return <CloudSnow className="w-6 h-6 text-blue-300" />
      case 'storm': return <Zap className="w-6 h-6 text-yellow-500" />
      case 'fog': return <Eye className="w-6 h-6 text-gray-400" />
      default: return <Cloud className="w-6 h-6 text-gray-500" />
    }
  }

  const getWeatherColor = (condition: string) => {
    switch (condition) {
      case 'clear': return 'bg-green-50 border-green-200'
      case 'cloudy': return 'bg-gray-50 border-gray-200'
      case 'rain': return 'bg-blue-50 border-blue-200'
      case 'snow': return 'bg-blue-50 border-blue-200'
      case 'storm': return 'bg-red-50 border-red-200'
      case 'fog': return 'bg-gray-50 border-gray-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const handleWeatherUpdate = () => {
    if (selectedAirport && weatherForm.condition && weatherForm.temperature !== undefined) {
      const updatedWeather: WeatherCondition = {
        condition: weatherForm.condition as any,
        temperature: weatherForm.temperature,
        windSpeed: weatherForm.windSpeed || 0,
        visibility: weatherForm.visibility || 10,
        description: weatherForm.description || 'Updated weather conditions'
      }
      
      onWeatherChange(selectedAirport, updatedWeather)
      setWeatherForm({})
      setShowWeatherForm(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Weather Conditions</h3>
        <button
          onClick={() => setShowWeatherForm(!showWeatherForm)}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showWeatherForm ? 'Cancel' : 'Update Weather'}
        </button>
      </div>

      {/* Weather Update Form */}
      {showWeatherForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Airport</label>
              <select
                value={selectedAirport || ''}
                onChange={(e) => setSelectedAirport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Airport</option>
                {airports.map(airport => (
                  <option key={airport} value={airport}>{airport}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                value={weatherForm.condition || ''}
                onChange={(e) => setWeatherForm({ ...weatherForm, condition: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Condition</option>
                <option value="clear">Clear</option>
                <option value="cloudy">Cloudy</option>
                <option value="rain">Rain</option>
                <option value="snow">Snow</option>
                <option value="storm">Storm</option>
                <option value="fog">Fog</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
              <input
                type="number"
                value={weatherForm.temperature || ''}
                onChange={(e) => setWeatherForm({ ...weatherForm, temperature: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="22"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wind Speed (km/h)</label>
              <input
                type="number"
                value={weatherForm.windSpeed || ''}
                onChange={(e) => setWeatherForm({ ...weatherForm, windSpeed: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={weatherForm.description || ''}
              onChange={(e) => setWeatherForm({ ...weatherForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Weather description..."
            />
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => {
                setWeatherForm({})
                setShowWeatherForm(false)
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleWeatherUpdate}
              disabled={!selectedAirport || !weatherForm.condition || weatherForm.temperature === undefined}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Update Weather
            </button>
          </div>
        </div>
      )}

      {/* Weather Display */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {airports.map(airport => {
          const weather = mockWeatherData[airport]
          if (!weather) return null
          
          return (
            <div
              key={airport}
              className={`p-4 rounded-lg border ${getWeatherColor(weather.condition)} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => {
                setSelectedAirport(airport)
                setWeatherForm(weather)
                setShowWeatherForm(true)
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{airport}</span>
                {getWeatherIcon(weather.condition)}
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4" />
                  <span>{weather.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="w-4 h-4" />
                  <span>{weather.windSpeed} km/h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{weather.visibility} km</span>
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
  )
}
