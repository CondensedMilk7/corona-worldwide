import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { TimelineData } from './models/timeline-data.model';
import { CountryData } from './models/country-data.model';

@Injectable({ providedIn: 'root' })
export class StatService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Get entire global timeline and only return latest
  getLatestGlobal() {
    return this.http
      .get<{ data: TimelineData[]; _cacheHit: boolean }>(
        `${this.baseUrl}/timeline`
      )
      .pipe(
        map((resData) => {
          return resData.data as TimelineData[];
        })
      );
  }

  // Returns an array of objects with the name of the country and its code
  getCountryCodes() {
    return this.http
      .get<{ data: CountryData[]; _cacheHit: boolean }>(
        `${this.baseUrl}/countries`
      )
      .pipe(
        map((resData) => {
          const countryCodes = [];
          for (let country of resData.data) {
            countryCodes.push({ name: country.name, code: country.code });
          }
          return countryCodes;
        })
      );
  }

  // get data
  getCountryData(countryCode: string) {
    return this.http
      .get<{ data: CountryData; _cacheHit: boolean }>(
        `${this.baseUrl}/countries/${countryCode}`
      )
      .pipe(
        map((resData) => {
          return resData.data;
        })
      );
  }
}
