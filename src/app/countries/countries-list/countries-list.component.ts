import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatService } from 'src/app/shared/services/stat.service';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss'],
})
export class CountriesListComponent implements OnInit {
  countries: { name: string; code: string }[] = [];
  searchText = '';
  isLoading = true;

  constructor(private statService: StatService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.statService.getCountryCodes().subscribe((data) => {
      this.countries = data;
      this.isLoading = false;
    });
  }

  onCountryClicked(country: { name: string; code: string }) {
    this.router.navigate([`/countries/${country.code}/${country.name}`]);
  }
}
