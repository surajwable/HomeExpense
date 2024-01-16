import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MonthsComponent } from './months/months.component';
import { MonthComponent } from './month/month.component';
import { TableComponent } from './table/table.component';
import { NumberToMonthPipe } from './pipes/number-to-month.pipe';
import { MonthToNumberPipe } from './pipes/month-to-number.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    MonthsComponent,
    MonthComponent,
    TableComponent,
    NumberToMonthPipe,
    MonthToNumberPipe,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
