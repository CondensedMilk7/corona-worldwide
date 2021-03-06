import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountriesListComponent } from './countries/countries-list/countries-list.component';
import { CountriesComponent } from './countries/countries.component';
import { CountryComponent } from './countries/country/country.component';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
  { path: 'general', component: GeneralComponent },
  { path: '', redirectTo: 'general', pathMatch: 'full' },
  {
    path: 'countries',
    component: CountriesComponent,
    children: [
      { path: 'list', component: CountriesListComponent },
      { path: ':code/:country', component: CountryComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
