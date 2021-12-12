import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { TimelineData } from '../models/timeline-data.model';
import { CountryData } from '../models/country-data.model';
import { CountryNameCode } from '../models/country-name-code';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Get entire global timeline and only return latest
  getGlobal() {
    return this.http
      .get<{ data: TimelineData[]; _cacheHit: boolean }>(
        `${this.baseUrl}timeline`
      )
      .pipe(
        map((resData) => resData.data)
      );
  }

  // Returns an array of objects with the name of the country and its code
  getCountryCodes(): Observable<CountryNameCode[]> {
    return this.http
      .get<{ data: CountryData[]; _cacheHit: boolean }>(
        `${this.baseUrl}countries`
      )
      .pipe(
        map((resData) => {
          const countryCodes: CountryNameCode[] = [];
          for (const country of resData.data) {
            countryCodes.push({ countryName: country.name, countryCode: country.code });
          }
          return countryCodes;
        })
      );
  }

  // get data for specific country
  getCountryData(countryCode: string) {
    return this.http
      .get<{ data: CountryData; _cacheHit: boolean }>(
        `${this.baseUrl}countries/${countryCode}`
      )
      .pipe(
        map((resData) => resData.data)
      );
  }
}
