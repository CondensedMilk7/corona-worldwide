import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CountryNameCode } from 'src/app/shared/models/country-name-code';
import { CountriesListPageActions } from 'src/app/store/actions';
import { AppSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss'],
})
export class CountriesListComponent implements OnInit {
  countries$: Observable<CountryNameCode[]> = this.store.select(
    AppSelectors.getCountriesList,
  );
  isLoading$: Observable<boolean> = this.store.select(
    AppSelectors.getIsLoading,
  );
  searchText = '';

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(CountriesListPageActions.loadPage());
  }

  onCountryClicked(country: CountryNameCode) {
    this.router.navigate([
      `/countries/${country.countryCode}/${country.countryName}`,
    ]);
  }
}
