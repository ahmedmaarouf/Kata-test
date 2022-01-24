import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public importFromFile(bstr: string) {

    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    const data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

    return data;
  }
}
