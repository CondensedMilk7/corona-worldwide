import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatService } from 'src/app/shared/stat.service';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss'],
})
export class CountriesListComponent implements OnInit {
  countryNames: string[] = [];
  searchText = '';
  isLoading = true;

  constructor(private statService: StatService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.statService.getCountryNames().subscribe((names) => {
      this.countryNames = names;
      this.isLoading = false;
    });
  }

  onCountryClicked(country: string) {
    this.router.navigate(['/countries/' + country.toLocaleLowerCase()]);
  }
}
