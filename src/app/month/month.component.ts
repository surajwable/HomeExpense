import { Component, Input, OnInit } from '@angular/core';
import { Month } from '../models/models';
import { TableDatasourceService } from '../services/table-datasource.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit {

  @Input() month : Month;

  constructor(private dataService : TableDatasourceService){
    this.month = {
      monthYear : '',
      monthNumber : '',
      tables : [],
      calculations : [],
      isSaved : false
    };
  }

  ngOnInit(): void {
    //subscrribe to get the previous savings of this month
    //whenever the value of current savings of previous month get updated it will also update the previous savings value of current month

    this.dataService.previousSavingsObservable.subscribe({
      next : response => {
        if(response.monthYear === this.month.monthYear && response.monthNumber === this.month.monthNumber){
          this.setCalculation('previous-savings',response.sum);
        }
      }
    })

    this.dataService.currentSavingsRequestObservable.subscribe({
      next : response => {
        if(response.monthYear === this.month.monthYear && response.monthNumber === this.month.monthNumber){
          this.currentSavingsUpdated();
        }
      }
    })

    //this month will send the request to get the current savings value of previous month.
    let pd = this.getPreviousDate(this.month.monthYear,this.month.monthNumber);
    this.dataService.currentSavingsRequestObservable.next({
      monthYear : pd.monthYear,
      monthNumber : pd.monthNumber
    });
  }

  sumUpdated(tableName : string, sum : number){   
    if(tableName === 'earnings'){
      this.setCalculation('current-earnings',sum.toString());  
    }
    else{
      this.setCalculation('current-expenditure',sum.toString());  
    }
   }

  setCalculation(name:string,sum:string){
    this.month.calculations.forEach((value,index)=> {
      if(value.name === name){
        value.value = sum;
      }
    });
    this.setCurrentSavings();
    console.log(this.month.calculations); // Add this line to log the calculations array
   }

   getCalculation(name: string): number {
    let sum = '0';
    this.month.calculations.forEach((value, index) => {
      if (value.name === name) {
        sum = value.value;
      }
    });
    console.log(parseInt(sum)); // Log the sum after parsing to integer
    return parseInt(sum);
  }

   setCurrentSavings() {
    let ps = this.getCalculation('previous-savings');
    let ce = this.getCalculation('current-earnings');
    let cx = this.getCalculation('current-expenditure');
  
    console.log("Previous Savings:", ps); // Debug log
    console.log("Current Earnings:", ce); // Debug log
    console.log("Current Expenditure:", cx); // Debug log
  
    // Ensure that all values are integers before performing arithmetic operations
    let cs = ps + ce - cx;
  
    this.month.calculations.forEach((value, index) => {
      if (value.name === 'current-savings') {
        value.value = cs.toString();
      }
    });
    this.currentSavingsUpdated(); 
  }

  //this will send the value of current savings into previous savings observable of next month
  //so that next month can take it as a previous savings.
  currentSavingsUpdated(){
    let nd = this.getNextDate(this.month.monthYear,this.month.monthNumber);
    this.dataService.previousSavingsObservable.next({
      monthYear : nd.monthYear,
      monthNumber : nd.monthNumber,
      sum : this.getCalculation('current-savings').toString()
    });
  }

  getPreviousDate(monthYear:string,monthNumber:string) : {monthYear:string;monthNumber:string;}
  {
    let temp = parseInt(this.month.monthNumber);
    let pm = temp === 1 ? '12' : (temp-1).toString();
    let py = monthNumber === '1' ? (parseInt(monthYear) - 1).toString() : monthYear;
    return {monthYear : py , monthNumber : pm};
  }

  getNextDate(monthYear:string,monthNumber:string) : {monthYear:string;monthNumber:string}{
    let temp = parseInt(monthNumber);
    let nm = temp === 12 ? '1' : (temp + 1).toString();
    let ny = temp === 12 ? (parseInt(monthYear) + 1).toString() : monthYear;
    return {monthYear : ny,monthNumber:nm};
  }
}
