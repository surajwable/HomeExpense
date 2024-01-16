import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthToNumber'
})
export class MonthToNumberPipe implements PipeTransform {

  months : string[] = [
    'January',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
  ];

  transform(value: string): string {
    let monthNumber: string = '0';
    this.months.forEach((val, ind) => {
      if (val.toLowerCase() === value.toLowerCase()) { // Corrected the comparison here
        monthNumber = (ind + 1).toString();
      }
    });
    return monthNumber;
  }

}
