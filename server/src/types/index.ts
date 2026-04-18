export interface Zone {
    name: string
    lat: number
    lng: number
    urgencyScore: number
    volunteersDeployed: number
    volunteersNeeded: number
    needType: string
  }
  
  export interface GeminiResponse {
    zones: Zone[]
  }