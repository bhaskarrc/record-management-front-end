import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Record } from '../record.model';
import { RecordService } from '../record.service';

@Component({
  selector: 'app-view-records',
  templateUrl: './view-records.component.html',
  styleUrls: ['./view-records.component.css']
})
export class ViewRecordsComponent implements OnInit {

  displayedColumns: string[] = ['select', 'position', 'firstName', 'lastName', 'aadharNumber', 'mobileNumber'];

  dataSource: Record[] = [];

  constructor(public recordService: RecordService) { }

  ngOnInit(): void {
    this.recordService.fetchRecords();
    this.recordService
      .getRecordsUpdateListener()
      .subscribe((records: Record[]) => {
        this.dataSource = records;
      });
  }

  onRadioButtonChanged(value: number) {
    this.recordService.executeDeleteSubject();
    this.recordService.setDeleteValue(value);
  }
}
