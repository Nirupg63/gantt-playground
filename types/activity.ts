export interface Aircraft {
  id: number
  type: string
  registration: string
  capacity: number
  status: 'active' | 'maintenance' | 'grounded'
  color?: string
}

export interface Flight {
  id: number
  flightNumber: string
  aircraftId: number
  origin: string
  destination: string
  start_date: string
  end_date: string
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'delayed' | 'cancelled'
  passengers: number
  crew: number
  gate?: string
  terminal?: string
  flightPairId?: number // New field to link flights in pairs
  isReturn?: boolean // New field to identify return flights
  weather?: WeatherCondition
  delayReason?: string
  estimatedDelay?: number // in minutes
}

export interface FlightPair {
  id: number
  outboundFlightId: number
  returnFlightId: number
  aircraftId: number
  route: string // e.g., "JFK ↔ LAX"
  totalDuration: number // Total round-trip duration in hours
}

export interface WeatherCondition {
  condition: 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog'
  temperature: number
  windSpeed: number
  visibility: number
  description: string
}

export interface FlightFormData {
  flightNumber: string
  aircraftId: number
  origin: string
  destination: string
  start_date: string
  end_date: string
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'delayed' | 'cancelled'
  passengers: number
  crew: number
  gate?: string
  terminal?: string
  isReturn?: boolean
  returnFlightNumber?: string
  returnStartDate?: string
  returnEndDate?: string
}

export interface AircraftFormData {
  type: string
  registration: string
  capacity: number
  status: 'active' | 'maintenance' | 'grounded'
}

export interface ConflictResolution {
  type: 'delay' | 'reroute' | 'aircraft_swap' | 'cancel'
  description: string
  impact: 'low' | 'medium' | 'high'
  estimatedCost?: number
  recommended: boolean
}
