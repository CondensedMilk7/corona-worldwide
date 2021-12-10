import { CountryData } from '../../shared/models/country-data.model';
import { CountryNameCode } from '../../shared/models/country-name-code';
import { TimelineData } from '../../shared/models/timeline-data.model';

export interface AppState {
  isLoading: boolean;
  timeline: TimelineData[];
  countryList: CountryNameCode[];
  currentCountry: CountryData;
  selectedDate: string;
  errorMessage: string;
}
