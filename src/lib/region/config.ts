import { Region } from "@/types";

export interface CityData {
  name: string;
  lat: number;
  lng: number;
}

export interface StateData {
  name: string;
  cities: CityData[];
}

export const REGIONS_DATA: Record<string, StateData> = {
  Maharashtra: {
    name: "Maharashtra",
    cities: [
      { name: "Mumbai", lat: 19.076, lng: 72.8777 },
      { name: "Pune", lat: 18.5204, lng: 73.8567 },
      { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
      { name: "Nashik", lat: 19.9975, lng: 73.7898 },
    ],
  },
  Karnataka: {
    name: "Karnataka",
    cities: [
      { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
      { name: "Mysuru", lat: 12.2958, lng: 76.6394 },
      { name: "Hubballi", lat: 15.3647, lng: 75.124 },
      { name: "Mangaluru", lat: 12.9141, lng: 74.856 },
    ],
  },
  "Tamil Nadu": {
    name: "Tamil Nadu",
    cities: [
      { name: "Chennai", lat: 13.0827, lng: 80.2707 },
      { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
      { name: "Madurai", lat: 9.9252, lng: 78.1198 },
      { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
    ],
  },
  Telangana: {
    name: "Telangana",
    cities: [
      { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
      { name: "Warangal", lat: 17.9689, lng: 79.5941 },
      { name: "Nizamabad", lat: 18.6725, lng: 78.0941 },
    ],
  },
  "Delhi NCR": {
    name: "Delhi NCR",
    cities: [
      { name: "New Delhi", lat: 28.6139, lng: 77.209 },
      { name: "Noida", lat: 28.5355, lng: 77.391 },
      { name: "Gurugram", lat: 28.4595, lng: 77.0266 },
    ],
  },
  "West Bengal": {
    name: "West Bengal",
    cities: [
      { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
      { name: "Howrah", lat: 22.5958, lng: 88.2636 },
      { name: "Siliguri", lat: 26.7271, lng: 88.3953 },
      { name: "Durgapur", lat: 23.5204, lng: 87.3119 },
    ],
  },
  "Uttar Pradesh": {
    name: "Uttar Pradesh",
    cities: [
      { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
      { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
      { name: "Kanpur", lat: 26.4499, lng: 80.3319 },
      { name: "Agra", lat: 27.1767, lng: 78.0081 },
    ],
  },
  Gujarat: {
    name: "Gujarat",
    cities: [
      { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
      { name: "Surat", lat: 21.1702, lng: 72.8311 },
      { name: "Vadodara", lat: 22.3072, lng: 73.1812 },
    ],
  },
};

export const INDIAN_STATES: StateData[] = Object.values(REGIONS_DATA);

export const DEFAULT_REGION: Region = {
  country: "India",
  state: "Delhi NCR",
  city: "New Delhi",
};

// Calculate Haversine distance in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest city from coordinates
export function resolveRegionFromCoords(lat: number, lng: number): Region {
  let closestDist = Infinity;
  let bestRegion: Region = DEFAULT_REGION;

  for (const [stateName, stateData] of Object.entries(REGIONS_DATA)) {
    for (const city of stateData.cities) {
      const dist = haversineDistance(lat, lng, city.lat, city.lng);
      if (dist < closestDist) {
        closestDist = dist;
        bestRegion = {
          country: "India",
          state: stateName,
          city: city.name,
        };
      }
    }
  }

  return bestRegion;
}
