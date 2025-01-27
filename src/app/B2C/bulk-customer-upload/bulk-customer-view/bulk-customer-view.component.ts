import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../ApiService/api.service';
import { CommonModule } from '@angular/common';
import { DatasharingService } from '../../../services/datasharing.service';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';

@Component({
  selector: 'app-bulk-customer-view',
  standalone: true,
  imports: [CommonModule,SpinnerComponent],
  templateUrl: './bulk-customer-view.component.html',
  styleUrl: './bulk-customer-view.component.scss',
})
export class BulkCustomerViewComponent {
  bulkSalaryData: any;
  bulkSalaryDataid: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private spinner: DatasharingService,
    private dialogRef: MatDialogRef<BulkCustomerViewComponent>
  ) {
    console.log(data);
    this.bulkSalaryDataid = data;
    let serviceName = 'SALARY_PROCES';
    let uploadedBy: any = sessionStorage.getItem('SenderUserId');
    this.spinner.show();
    this.apiService
      .getUploadBulkSalaryViewData(uploadedBy, serviceName, data?.id)
      .subscribe({
        next: (res) => {
          if (res?.responseCode == 200) {
            this.spinner.hide();
            this.bulkSalaryData = res?.data;
          } else {
            this.spinner.hide();
            alert(res?.error);
          }
        },
        error: () => {
          this.spinner.hide();
          alert('Error Try Again!!!');
        },
      });
  }

  authorizeCustomeronboarding(value: any) {
    let serviceName = 'SALARY_PROCES';
    let uploadedBy: any = sessionStorage.getItem('SenderUserId');
    this.spinner.show();
    this.apiService
      .authorizeSalaryUpload(
        uploadedBy,
        serviceName,
        this.bulkSalaryDataid?.id,
        value
      )
      .subscribe({
        next: (res) => {
          if (res?.responseCode == 200) {
            this.spinner.hide();
            alert('Data Updated Successfully');
            this.dialogRef.close();
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
