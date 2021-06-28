import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { Record } from '../record.model';
import { RecordService } from '../record.service';

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.component.html',
  styleUrls: ['./add-record.component.css']
})
export class AddRecordComponent implements OnInit {

  constructor(public recordService: RecordService) {
    this.recordService = recordService;
  }

  enableProgressBar: boolean = false;
  dataSource: Record[] = [];
  isDuplicate: boolean = false;
  isDeleteDisabled: boolean = true;

  ngOnInit(): void {
    this.recordService
      .getRecordsUpdateListener()
      .subscribe((records: Record[]) => {
        this.dataSource = records;
      })

    this.recordService.getDeleteObservable().subscribe((val) => {
      this.isDeleteDisabled = val;
    })

    this.recordService.progressBar.subscribe((val) => {
      this.enableProgressBar = val;
    })
  }

  toggleDuplicate(flag: boolean): void {
    this.isDuplicate = flag;
  }

  onAddRecord(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.enableProgressBar = true;

    const record: Record = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      aadharNumber: form.value.aadharNumber,
      mobileNumber: form.value.mobileNumber
    }

    if (this.dataSource
      .findIndex(rec => rec.aadharNumber == record.aadharNumber
        || rec.mobileNumber == record.mobileNumber) == -1) {
      this.recordService.addRecord(record);
      form.resetForm();
      this.toggleDuplicate(false);
    } else {
      console.log(form);
      this.toggleDuplicate(true);
      this.enableProgressBar = false;
    }
  }

  onDeleteRecord() {
    this.enableProgressBar = true;
    this.recordService.deleteRecord();
  }
}
