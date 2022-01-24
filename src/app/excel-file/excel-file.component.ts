import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSheet } from '../DataSheet';
import { ExcelService } from '../service/excel-service.service';
@Component({
  selector: 'app-excel-file',
  templateUrl: './excel-file.component.html',
  styleUrls: ['./excel-file.component.css']
})
export class ExcelFileComponent implements OnInit {

  companyList: DataSheet[] = [];
  sortedCompanyList: DataSheet[] = [];
  imported = false;
  companyForm: FormGroup;
  constructor(private excelService: ExcelService,
    private fb: FormBuilder) {

    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      nbOfEmployee: ['', Validators.required],
      revenues: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }
  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files[0].type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      target.files[0].type != 'application/vnd.ms-excel') {
      alert('seulement les fichiers EXCEL sont autorisés!');

    } else {

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {

        const bstr: string = e.target.result;
        const data = <any[]>this.excelService.importFromFile(bstr);

        const header: string[] = Object.getOwnPropertyNames(new DataSheet());
        const importedData = data.slice(1, -1);

        this.companyList = importedData.map(arr => {
          this.imported = true;
          const obj: any = {};
          for (let i = 0; i < header.length; i++) {
            const k = header[i];
            obj[k] = arr[i];
          }
          return <DataSheet>obj;
        })
        // eliminer les elements dupliqués
        this.companyList = this.companyList.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.companyName === value.companyName && t.nbOfEmployee === value.nbOfEmployee && t.revenues === value.revenues
          ))
        )
        // trier les elements par ordre de revenues décroissants
        this.sortedCompanyList = this.companyList.slice(0);
        this.sortedCompanyList.sort(function (a, b) {
          return b.revenues - a.revenues;
        });
      };

      reader.readAsBinaryString(target.files[0]);
    }
  }

  addCompany() {
    if(!this.sortedCompanyList.some(el => el.companyName === this.companyForm.get('companyName')?.value )) {
      this.sortedCompanyList.push(this.companyForm.value);
      this.companyForm.reset();
    }
  }

  deleteCompany(i: any) {
    if (confirm("are you sure to delete this company ?")) {
      this.sortedCompanyList.splice(i, 1);
    }
  }
}
