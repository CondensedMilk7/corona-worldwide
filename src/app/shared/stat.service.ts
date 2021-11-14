import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { LatestGlobalData, TimelineData } from './models/timeline-data.model';
import { CountryData } from './models/country-data.model';

@Injectable({ providedIn: 'root' })
export class StatService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Get entire global timeline and only return latest
  getLatestGlobal() {
    return this.http.get<TimelineData>(`${this.baseUrl}/timeline`).pipe(
      map((resData) => {
        return resData.data as LatestGlobalData[];
      })
    );
  }

  getCountryNames() {
    return this.http
      .get<{ data: CountryData[]; _cacheHit: boolean }>(
        `${this.baseUrl}/countries`
      )
      .pipe(
        map((resData) => {
          const countryNames = [];
          for (let country of resData.data) {
            countryNames.push(country.name);
          }
          return countryNames;
        })
      );
  }
}
