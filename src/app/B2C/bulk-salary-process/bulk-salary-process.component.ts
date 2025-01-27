import { Component, OnInit } from '@angular/core';
import { ApiService } from '../ApiService/api.service';
import { CommonModule } from '@angular/common';
import { BulkSalaryUploadViewComponent } from './bulk-salary-upload-view/bulk-salary-upload-view.component';
import { MatDialog } from '@angular/material/dialog';
import { DatasharingService } from '../../services/datasharing.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-bulk-salary-process',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './bulk-salary-process.component.html',
  styleUrl: './bulk-salary-process.component.scss',
})
export class BulkSalaryProcessComponent implements OnInit {
  selectedFile!: File | any;
  bulkSalaryData: any;
  serviceName: any;
  uploadedBy: any;
  constructor(
    private apiservice: ApiService,
    private dialog: MatDialog,
    private spinner: DatasharingService
  ) {}

  ngOnInit(): void {
    if (sessionStorage) {
      this.serviceName = 'CUSTOMER_UPLOAD';
      this.uploadedBy = sessionStorage.getItem('SenderUserId');
      let walletId: any = sessionStorage.getItem('walletId');
      this.getDataValues(this.uploadedBy, this.serviceName);
    }
  }

  getDataValues(uploadedBy: any, serviceName: any) {
    this.apiservice.getUploadBulkSalaryFile(uploadedBy, serviceName).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode) {
          this.bulkSalaryData = res?.data;
        }
      },
    });
  }

  viewData(row: any) {
    let dialogRef = this.dialog
      .open(BulkSalaryUploadViewComponent, {
        width: '1000px',
        height: '600px',
        panelClass: 'custom-dialog-container',
        data: row,
      })
      .afterClosed()
      .subscribe((res) => {
        this.getDataValues(this.uploadedBy, this.serviceName);
      });
  }

  onFileChange(event: any) {
    let serviceName = 'CUSTOMER_UPLOAD';
    let uploadedBy: any = sessionStorage.getItem('SenderUserId');
    let walletId: any = sessionStorage.getItem('walletId');
    this.selectedFile = event.target.files[0];

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    console.log(file);
    this.spinner.show();
    this.apiservice
      .uploadBulkSalaryFile(
        serviceName,
        uploadedBy,
        walletId,
        this.selectedFile
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res?.responseCode == 200) {
            this.spinner.hide();
            alert('File Upload Success');
            this.getDataValues(this.uploadedBy, this.serviceName);
          } else {
            this.spinner.hide();
            alert(res?.error);
          }
        },
        error: () => {
          this.spinner.hide();

          alert('Error Try Again');
        },
      });
  }
}
