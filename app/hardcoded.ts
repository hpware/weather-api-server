const apiKey = process.env.CWA_API;
const requestElement =
  "Weather,Now,AirTemperature,RelativeHumidity,DailyHigh,DailyLow"; // If empty, then it fetches everything.
const geoInfomation = "Coordinates,CountyName,TownName";

export default async function fetchAPI(stationName: string) {
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
      error: "ERR_REMOTE_API_RATE_LIMIT",
    };
  }
  const res = await req.json();

  if (!res?.records?.Station?.length) {
    return {
      error: "ERR_NO_STATION_DATA",
      message: `No data found for station: ${stationName}`,
    };
  }

  const station = res.records.Station[0];
  const weatherElement = station.WeatherElement;

  return {
    weather: weatherElement?.Weather ?? "N/A",
    temp: weatherElement?.AirTemperature ?? "N/A",
    humidity: weatherElement?.RelativeHumidity ?? "N/A",
    highestTemp:
      weatherElement?.DailyExtreme?.DailyHigh?.TemperatureInfo
        ?.AirTemperature ?? "N/A",
    lowestTemp:
      weatherElement?.DailyExtreme?.DailyLow?.TemperatureInfo?.AirTemperature ??
      "N/A",
    DateTime:
      weatherElement?.DailyExtreme?.DailyHigh?.TemperatureInfo?.Occurred_at
        ?.DateTime ?? "N/A",
  };
}

const webServerPort = 3000;

Bun.serve({
  port: webServerPort,
  routes: {
    "/weather": async (req) => {
      return Response.json(
        {
          message: "ERR_NO_LOCATION_DATA",
          how: "You can use api.json to check for the location data.",
        },
        {
          status: 404,
        },
      );
    },
    "/weather/:stationName": async (req) => {
      const stationName = req.params.stationName;
      return Response.json(await fetchAPI(stationName));
    },
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
