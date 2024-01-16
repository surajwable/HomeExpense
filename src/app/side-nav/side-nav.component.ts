import { Component, OnInit } from '@angular/core';
import { Month, MonthNavigation } from '../models/models';
import { TableDatasourceService } from '../services/table-datasource.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
  navigationList: MonthNavigation[];

  constructor(private dataService: TableDatasourceService) {
    this.navigationList = [];
  }

  ngOnInit(): void {
    this.dataService.monthNavigationObservable.subscribe((res) => {
      this.navigationList = res;
    });
  }

  monthNavigationClicked(event: MonthNavigation) {
    this.dataService.monthNavigationSelectedObservable.next(event);
  }

}
