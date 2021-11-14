import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatService } from '../shared/stat.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit {
  countryNames: string[] = [];
  searchText = '';

  constructor(private statService: StatService, private router: Router) {}

  ngOnInit(): void {
    this.statService.getCountryNames().subscribe((names) => {
      this.countryNames = names;
    });
  }

  onCountryClicked(country: string) {
    this.router.navigate(['/' + country.toLocaleLowerCase()]);
  }
}
