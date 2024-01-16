import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Table, TableRow } from '../models/models';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TableDatasourceService } from '../services/table-datasource.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})

export class TableComponent implements OnInit {
  @Input() table: Table;
  @Input() monthYear : string;
  @Input() monthNumber : string;
  @Output() sumUpdated = new EventEmitter<number>();

  rowForm: FormGroup;

  constructor(private dateService : TableDatasourceService) {
    this.table = {
      tableName: '',
      columns: [],
      rows: [],
      isSaved: false,
    };

    this.rowForm = new FormGroup({});
    this.monthYear = '';
    this.monthNumber = '';
  }

  ngOnInit(): void {
    this.dateService.getTableRows(this.monthYear,this.monthNumber,this.table.tableName).subscribe({
      next: res => {
        this.table.rows = [];
        for(let row of res){
          this.addRowToArray(row.id,row.date,row.name,row.amount,true);
        }
      }
    })
     
    this.rowForm = new FormGroup({
      date: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        this.daysInMonthValidator(this.monthYear,this.monthNumber)
      ]),
      name: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z]*$')]),
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    });
  }

  updateSum(){
    let sum = 0;
    this.table.rows.forEach((row,index) => {
      sum += parseInt(row.amount);
    })
    this.sumUpdated.emit(sum);
  }

  daysInMonthValidator(monthYear: string, monthNumber: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const day = parseInt(control.value, 10); // Parse the control value to an integer
      const maxDay = this.getDaysInMonth(monthYear, monthNumber);

      console.log(maxDay);
      
      // Check if the day is valid for the given month and year
      if (day < 1 || day > maxDay) {
        return { daysInvalid: true }; // Return error if invalid day
      }
      return null; // Return null if the day is valid
    };
  }
  
  getDaysInMonth(monthYear: string, monthNumber: string) {
    return new Date(parseInt(monthYear, 10), parseInt(monthNumber, 10), 0).getDate();
  }

  addRowToArray(
    id : number,
    date : string,
    name : string,
    amount : string,
    isSaved : boolean){

      let row : TableRow = {
        id : id,
        date : date,
        name : name,
        amount : amount,
        isSaved : isSaved
      };

      this.table.rows.push(row);
      this.updateSum();
      this.clearForm();
  }

  addNewRowInBackend(){
    let date = this.dateControl.value;
    let name = this.nameControl.value;
    let amount = this.amountControl.value;

    let monthDataForBackend = {
      monthYear : this.monthYear,
      monthNumber : this.monthNumber,
      tableName: this.table.tableName,
      date: date,
      name : name,
      amount : amount
    };

   this.dateService.addTableRow(monthDataForBackend).subscribe({
    next : response => {
      this.addRowToArray(parseInt(response),date,name,amount,true);
    }
   })
  }

  clearForm(){
    this.dateControl.setValue('');
    this.nameControl.setValue('');
    this.amountControl.setValue('');
  }

  deleteTableRow(id : number| undefined){
    this.table.rows.forEach((row,index) => {
      if(id && row.id === id){
        this.dateService.deleteTableRow(id).subscribe({
          next:response => {
            //index varacha 1 element delete kara using splice
            this.table.rows.splice(index,1);
          }
        })
      }
    })
  }

  editTableRow(id: number | undefined){
      if(this.dateControl.value === '' && this.nameControl.value === '' && this.amountControl.value === '')
      {
        this.table.rows.forEach((row,index) => {
          if(id && row.id === id){
            this.dateControl.setValue(row.date);
            this.nameControl.setValue(row.name);
            this.amountControl.setValue(row.amount);
            this.deleteTableRow(row.id);
          }
        })
      }
      else{
        alert("add the data first and then edit");
      }
  }

  //getters to access the form elemenets and the form itself

  public get dateControl() : FormControl {
    return this.rowForm.controls['date'] as FormControl;
  } 

  public get nameControl() : FormControl {
    return this.rowForm.controls['name'] as FormControl;
  }

  public get amountControl() : FormControl {
    return this.rowForm.controls['amount'] as FormControl;
  }

  public get RowForm(){
    return this.rowForm as FormGroup;
  }


}
