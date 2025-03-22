import fetchAPI from "./fetchApi";
import fs from "node:fs";

const webServerPort = 3000;



Bun.serve({
  port: webServerPort,
  routes: {
    "/weather/:lat/:long": async (req) => {
      const lat = req.params.lat;
      const long =  req.params.long;
      console.log(`lat: ${lat}, long: ${long}`)
      return Response.json(await fetchAPI(lat, long));
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
