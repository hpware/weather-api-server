const apiKey = process.env.CWA_API;
const requestElement =
  "Weather,Now,AirTemperature,RelativeHumidity,DailyHigh,DailyLow"; // If empty, then it fetches everything.
const geoInfomation = "Coordinates,CountyName,TownName";

export default async function fetchAPI(
  lat: string,
  long: string,
  location?: string,
) {
  const latAfterDot = lat.match(/\.(\d+)/);
  console.log(latAfterDot);
  if (latAfterDot && latAfterDot[1].length >= 7) {
    console.log("a");
  }
  const longAfterDot = long.match(/\.(\d+)/);
  console.log(longAfterDot);
  if (longAfterDot && longAfterDot[1].length >= 7) {
    console.log("b");
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
  console.log(req);
  if (!req.ok) {
    return {
      error: "ERR_REMOTE_API_RATE_LIMIT",
    };
  }
  const res = await req.json();
  console.log(res);
  return res;
}
