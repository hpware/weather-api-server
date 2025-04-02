interface Coordinate {
  CoordinateName: string;
  CoordinateFormat: string;
  StationLatitude: number;
  StationLongitude: number;
}

interface WeatherStation {
  StationName: string;
  StationId: string;
  GeoInfo: {
    Coordinates: Coordinate[];
    CountyName: string;
    TownName: string;
  };
  WeatherElement: {
    Weather: string;
    Now: { Precipitation: number };
    AirTemperature: number;
    RelativeHumidity: number;
    DailyExtreme: {
      DailyHigh: { TemperatureInfo: { AirTemperature: number } };
      DailyLow: { TemperatureInfo: { AirTemperature: number } };
    };
  };
}