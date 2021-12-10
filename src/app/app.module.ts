import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FilterPipe } from './shared/pipes/filter.pipe';
import { DatePipe } from '@angular/common';

import { GeneralComponent } from './general/general.component';
import { CountriesComponent } from './countries/countries.component';
import { StatCardComponent } from './stat-cards/stat-card/stat-card.component';
import { CountryComponent } from './countries/country/country.component';
import { CountriesListComponent } from './countries/countries-list/countries-list.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './store/reducers/';
import { AppEffects } from './store/effects/app.effects';
import { ChartComponent } from './chart/chart.component';
import { StatCardsComponent } from './stat-cards/stat-cards.component';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
  declarations: [
    AppComponent,
    GeneralComponent,
    CountriesComponent,
    StatCardComponent,
    CountryComponent,
    CountriesListComponent,

    FilterPipe,
     ChartComponent,
     StatCardsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSlideToggleModule,

    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // imports all modules, TODO: specify only one maybe.
    }),

    StoreModule.forRoot({ app: appReducer }),
    EffectsModule.forRoot([AppEffects]),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
