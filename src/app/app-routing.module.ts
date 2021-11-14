import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountriesComponent } from './countries/countries.component';
import { CountryComponent } from './countries/country/country.component';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
  { path: 'general', component: GeneralComponent },
  {
    path: 'countries',
    component: CountriesComponent,
    children: [{ path: ':country', component: CountryComponent }],
  },
  { path: '', redirectTo: 'general', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
