import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CountryData } from 'src/app/shared/models/country-data.model';
import { StatService } from 'src/app/shared/stat.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  countryData: CountryData;

  constructor(
    private route: ActivatedRoute,
    private statService: StatService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const code = params.code;
          return this.statService.getCountryData(code);
        })
      )
      .subscribe((countryData) => {
        this.countryData = countryData;
        console.log(this.countryData);
      });
  }
}
