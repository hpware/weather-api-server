import fs from "node:fs";

const apiKey = process.env.CWA_API;
const requestElement = "Weather,Now,AirTemperature,RelativeHumidity,DailyHigh,DailyLow";
const geoInfomation = "Coordinates,CountyName,TownName";
const webServerPort = 3000;

async function fetchAPI(location: string) {
    const stopLocation = location;
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
  console.log(location);
  return res;
} 

Bun.serve({
  port: webServerPort,
    routes: {
    "/weather/:loc": async (req) => {
    const location = req.params.loc;
      const data = await fetchAPI(location);
      return Response.json(data);
    },
    "/*": Response.json({ message: "Not found" }, { status: 404 }),
  },
});

console.log(`Running the webserver at port ${webServerPort}`);