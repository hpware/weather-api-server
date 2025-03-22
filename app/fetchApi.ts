const apiKey = process.env.CWA_API;
const requestElement =
  "Weather,Now,AirTemperature,RelativeHumidity,DailyHigh,DailyLow";
const geoInfomation = "Coordinates,CountyName,TownName";

export default async function fetchAPI(lat: string, long: string, location?: string ) {
    const latAfterDot = lat.match(/\.(\d+)/);
    if (latAfterDot && latAfterDot[1].length >= 7) {

    }
    const longAfterDot = long.match(/\.(\d+)/);
    if (longAfterDot && longAfterDot[1].length >= 7) {

    }
  const req = await fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${apiKey}&format=JSON&WeatherElement=${requestElement}&GeoInfo=${geoInfomation}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!req.ok) {
    throw new Error(`API request failed with status ${req.status}`);
  }
  const res = await req.json();
  return res;
}