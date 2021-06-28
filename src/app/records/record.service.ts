import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, Subscriber } from "rxjs";
import { Record } from "./record.model";

@Injectable()
export class RecordService {
  private records: Record[] = [];
  private recordsUpdated = new Subject<Record[]>();
  private isDeleteDisabled = new Subject<boolean>();
  progressBar = new Subject<boolean>();
  private deleteValue: number = 0;

  constructor(private http: HttpClient) {
  }

  fetchRecords() {
    this.http.get<Record[]>('http://localhost:8080/records/')
      .subscribe(recordData => {
        this.records = recordData;
        this.recordsUpdated.next([...this.records]);
      });
  }

  addRecord(record: Record) {
    this.http.post<Record>('http://localhost:8080/records/', record)
      .subscribe(fetchedData => {
        this.records.push(fetchedData);
        this.recordsUpdated.next([...this.records]);
        this.progressBar.next(false);
      });
  }

  deleteRecord() {
    this.http.delete(`http://localhost:8080/records/${this.deleteValue}`, { responseType: 'text' })
      .subscribe({
        next: () => {
          let val: Record = this.records.filter(rec => rec.id == this.deleteValue)[0];
          this.records.splice(this.records.findIndex(rec => rec.id == val.id), 1);
          this.recordsUpdated.next([...this.records]);
          this.progressBar.next(false);
        }
      })
  }

  getRecordsUpdateListener() {
    return this.recordsUpdated.asObservable();
  }

  executeDeleteSubject() {
    this.isDeleteDisabled.next(false);
  }

  getDeleteObservable() {
    return this.isDeleteDisabled.asObservable();
  }

  setDeleteValue(value: number) {
    this.deleteValue = value;
  }
}
