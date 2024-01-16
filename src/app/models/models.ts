export class TableRow {
    id? : number;
    date : string = '';
    name : string = '';
    amount : string = '';
    isSaved : boolean = false;  //to know did we saved the data in the database. 
}

export class Table {
    tableName : string = '';
    columns : string[] = [];
    rows : TableRow[] = [];
    isSaved : boolean = false;
}

export class MonthCalculation {
    name : string = '';
    value : string = '';
    isSaved : boolean = false;
}

export class Month {
    monthYear : string = '';
    monthNumber : string = '';
    tables : Table[] = [];
    calculations : MonthCalculation[] = [];
    isSaved : boolean = false; 
}

export class MonthNavigation {
    monthYear : string = '';
    monthNumber : string = '';
}