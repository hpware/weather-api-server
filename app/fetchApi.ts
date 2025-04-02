import { WeatherStation } from './types/weather';

const apiKey = process.env.CWA_API;
const requestElement =
  "Weather,Now,AirTemperature,RelativeHumidity,DailyHigh,DailyLow"; // If empty, then it fetches everything.
const geoInfomation = "Coordinates,CountyName,TownName";

// AI written (我的數學真的爛到爆
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

export default async function fetchAPI(lat: string, long: string) {
  const req = await fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${apiKey}&format=JSON&WeatherElement=${requestElement}&GeoInfo=${geoInfomation}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!req.ok) {
    return { error: "ERR_REMOTE_API_RATE_LIMIT" };
  }

  const res = await req.json();
  const stations: WeatherStation[] = res.records.Station;
  
  // Find nearest station
  const userLat = parseFloat(lat);
  const userLong = parseFloat(long);
  
  let nearestStation = stations[0];
  let minDistance = Number.MAX_VALUE;

  stations.forEach(station => {
    const stationCoords = station.GeoInfo.Coordinates.find(c => c.CoordinateName === 'WGS84');
    if (stationCoords) {
      const distance = calculateDistance(
        userLat,
        userLong,
        stationCoords.StationLatitude,
        stationCoords.StationLongitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = station;
      }
    }
  });
  const WeatherElement =  nearestStation.WeatherElement;
  // Format response
  return {
    location: `${nearestStation.GeoInfo.CountyName}${nearestStation.GeoInfo.TownName}`,
    weather:WeatherElement.Weather,
    temperature:WeatherElement.AirTemperature,
    humidity: WeatherElement.RelativeHumidity,
    dailyHigh:WeatherElement.DailyExtreme.DailyHigh.TemperatureInfo.AirTemperature,
    dailyLow:WeatherElement.DailyExtreme.DailyLow.TemperatureInfo.AirTemperature
  };
}
