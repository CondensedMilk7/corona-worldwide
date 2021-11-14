export interface CountryData {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  name: string;
  code: string;
  population: number;
  updated_at: string;
  today: {
    deaths: number;
    confirmed: number;
  };
  latest_data: {
    deaths: number;
    confirmed: number;
    recovered: number;
    critical: number;
  };
  calculated: {
    death_rate: number;
    recovery_rate: number;
    recovered_vs_death_ratio: null;
    cases_per_million_population: number;
  };
}
