import { TimelineData } from './timeline-data.model';

// Type of data for a specific country
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
    calculated: {
      death_rate: number;
      recovery_rate: number;
      recovered_vs_death_ratio: null;
      cases_per_million_population: number;
    };
    deaths: number;
    confirmed: number;
    recovered: number;
    critical: number;
  };
  timeline: TimelineData[];
}
