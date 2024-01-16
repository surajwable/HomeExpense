import { Component, OnInit } from '@angular/core';
import { Month, MonthCalculation, MonthNavigation, Table, TableRow } from '../models/models';
import { MonthToNumberPipe } from '../pipes/month-to-number.pipe';
import { TableDatasourceService } from '../services/table-datasource.service';

@Component({
  selector: 'app-months',
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.css'],
})
export class MonthsComponent implements OnInit {
  months: Month[] = [];
  monthsToDisplay: Month[] = []; //to do filter operation need seperate array.
  monthNavigationList : MonthNavigation[] = [];
  
  constructor(private dataSourceService: TableDatasourceService) {}

  ngOnInit(): void {
    
    this.loadMonthData();
    this.dataSourceService.monthNavigationSelectedObservable.subscribe({
      next: (selectedMonth) => {      
        this.monthsToDisplay = this.filterMonths(selectedMonth.monthYear, selectedMonth.monthNumber);
        console.log(this.monthsToDisplay);
      }
    });
    
  }

  loadMonthData(){
    this.dataSourceService.getMonthData().subscribe({
      
      next: (response) => {
        
        for (let item of response) {
          
          this.addMonthByNumber(item.monthYear, item.monthNumber);
        }
        this.monthsToDisplay = this.months;
      },
    });
  }

  filterMonths(monthYear: string, monthNumber: string): Month[] {
    if (monthYear === 'all' && monthNumber === 'all') {
      return this.months;
    } else {
      return this.months.filter(month => 
        month.monthYear === monthYear && month.monthNumber === monthNumber
      );
    }
  }
  
  addMonthByName(monthYear: string, monthName: string) {
    let monthNumber = new MonthToNumberPipe().transform(monthName);
    return this.addMonthByNumber(monthYear, monthNumber);
  }

  addMonthByNumber(monthYear: string, monthNumber: string) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Adding 1 because months are zero-indexed
  
    const inputYear = parseInt(monthYear, 10); //10 specify that the parsing should be done in a base 10.
    const inputMonth = parseInt(monthNumber, 10);
  
    if (inputYear < currentYear || (inputYear === currentYear && inputMonth <= currentMonth)) {
      let earningsTable: Table = {
        tableName: 'earnings',
        columns: ['date', 'name', 'amount'],
        rows: [],
        isSaved: false,
      };
  
      let expTable: Table = {
        tableName: 'expenditure',
        columns: ['date', 'name', 'amount'],
        rows: [],
        isSaved: false,
      };
      
      let calcs: MonthCalculation[] = [
        {
          name: 'current-savings',
          value: '0',
          isSaved: false,
        },
        {
          name: 'current-expenditure',
          value: '0',
          isSaved: false,
        },
        {
          name: 'current-earnings',
          value: '0',
          isSaved: false,
        },
        {
          name: 'previous-savings',
          value: '0',
          isSaved: false,
        },
      ];
      
      let month: Month = {
        monthNumber: monthNumber,
        monthYear: monthYear,
        tables: [earningsTable, expTable],
        calculations: calcs,
        isSaved: false,
      };
  
      this.months.unshift(month);
      this.addMonthNavigation(monthYear, monthNumber);
      return true;
    } else {
      // Alert message when trying to add a future month
      alert("You can only add months up to the current month and year.");
      return false;
    }
  }
  
  

  addMonthNavigation(monthYear:string,monthNumber:string){

    if(this.monthNavigationList.length === 0){
      let firstMonthNavigation : MonthNavigation = {
        monthYear :'all',
        monthNumber : 'all'
      }
      this.monthNavigationList.unshift(firstMonthNavigation);
    }

    let monthNavigation = {
      monthNumber : monthNumber,
      monthYear : monthYear
    };

    this.monthNavigationList.splice(1, 0, monthNavigation);
    this.dataSourceService.monthNavigationObservable.next(this.monthNavigationList);
    console.log('Updated navigation list:', this.monthNavigationList); 
  }

  removeMonthNavigation(monthYear:string,monthNumber:string){
    this.monthNavigationList.forEach((res,index) => {
      if(res.monthYear === monthYear && res.monthNumber === monthNumber){
        this.monthNavigationList.splice(index,1);
      }
    })
    this.dataSourceService.monthNavigationObservable.next(this.monthNavigationList);
  }

  addNextMonth(): void {
    let nextMonth: string;
    let nextYear: string;

    if (this.months[0].monthNumber === '12') {
      nextMonth = '1'; // Reset to January if December is the current month
      nextYear = (parseInt(this.months[0].monthYear, 10) + 1).toString(); // Increment year
    } else {
      nextMonth = (parseInt(this.months[0].monthNumber, 10) + 1).toString(); // Increment month
      nextYear = this.months[0].monthYear; // Keep the year the same
    }

    this.addMonthByNumber(nextYear, nextMonth); // Add the next month
  }

  deleteMonth(monthYear: string, monthName: string) {
    let monthNumber = new MonthToNumberPipe().transform(monthName);
    let response = confirm('are you sure');
    if (response) {
      this.months.forEach((month, index) => {
        if (
          month.monthNumber === monthNumber &&
          month.monthYear === monthYear
        ) {
          this.months.splice(index, 1);
          this.removeMonthNavigation(monthYear,monthNumber);
        }
      });
    }
  }
}
