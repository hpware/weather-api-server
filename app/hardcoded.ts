
const apiKey = process.env.CWA_API;
const requestElement =
  "Weather,Now,AirTemperature,RelativeHumidity,DailyHigh,DailyLow"; // If empty, then it fetches everything.
const geoInfomation = "Coordinates,CountyName,TownName";
const stationName = "" // Please use api.json to check the stationName


export default async function fetchAPI() {
  const req = await fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${apiKey}&StationName=${stationName}&format=JSON&WeatherElement=${requestElement}&GeoInfo=${geoInfomation}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!req.ok) {
    return {
        error: "ERR_REMOTE_API_RATE_LIMIT"
    }
  }
  const res = await req.json();
  return res;
}

const webServerPort = 3000;



Bun.serve({
  port: webServerPort,
  routes: {
    "/weather/:lat/:long": async (req) => {
      return Response.json(await fetchAPI());
    },
    "/weather/": Response.json(
      {
        message: "Please add the location at the end.",
      },
      {
        status: 403,
      },
    ),
    "/*": Response.json(
      {
        message: "Not found",
      },
      {
        status: 404,
      },
    ),
  },
});

console.log(`Running the webserver at port ${webServerPort}`);
