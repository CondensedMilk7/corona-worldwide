import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { NgxEchartsModule } from 'ngx-echarts';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GeneralComponent } from './general/general.component';
import { CountriesComponent } from './countries/countries.component';
import { StatCardComponent } from './general/stat-card/stat-card.component';
import { FormsModule } from '@angular/forms';
import { CountryComponent } from './countries/country/country.component';
import { FilterPipe } from './shared/pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GeneralComponent,
    CountriesComponent,
    StatCardComponent,
    CountryComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // imports all modules, TODO: specify only one maybe.
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
