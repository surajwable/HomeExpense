import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Month, MonthNavigation } from '../models/models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TableDatasourceService implements OnInit{

  monthNavigationObservable = new Subject<MonthNavigation[]>();   
  monthNavigationSelectedObservable = new Subject<MonthNavigation>();
  currentEarnings = new Subject<MonthNavigation>();
  currentExpenditure = new Subject<MonthNavigation>();

  previousSavingsObservable = new Subject<{
    monthYear : string;
    monthNumber : string;
    sum : string;
  }>();

  currentSavingsRequestObservable = new Subject<{
    monthYear : string;
    monthNumber : string;
  }>();

  constructor(private http:HttpClient) { }

  ngOnInit(): void {}

  getMonthData(){
    return this.http.get<Month[]>('https://localhost:7014/api/MonthsData/GetListofMonths');
  }

  addTableRow(monthDataForBackend : any){
    return this.http.post('https://localhost:7014/api/MonthsData/InsertTableRow',monthDataForBackend, {responseType:'text'});
  }

  getTableRows(monthYear:string,monthNumber:string,tableName:string){
    let parameters = new HttpParams();
    parameters = parameters.append('monthYear',monthYear);
    parameters = parameters.append('monthNumber',monthNumber);
    parameters = parameters.append('tableName',tableName);

    return this.http.get<any>('https://localhost:7014/api/MonthsData/GetTableData', {params : parameters});   
  }

  deleteTableRow(rowId:number){
    return this.http.delete('https://localhost:7014/api/MonthsData/DeleteTableRow/'+ rowId, {responseType : 'text'});
  }

}
