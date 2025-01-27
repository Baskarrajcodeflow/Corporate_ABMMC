import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../ApiService/api.service';
import { DatasharingService } from '../../../services/datasharing.service';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';

@Component({
  selector: 'app-bulk-salary-upload-view',
  standalone: true,
  imports: [CommonModule,SpinnerComponent],
  templateUrl: './bulk-salary-upload-view.component.html',
  styleUrl: './bulk-salary-upload-view.component.scss',
})
export class BulkSalaryUploadViewComponent {
  bulkSalaryData: any;
  bulkSalaryDataid: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private spinner: DatasharingService,

    private dialogRef:MatDialogRef<BulkSalaryUploadViewComponent>
  ) {
    console.log(data);
    this.bulkSalaryDataid = data;
    let serviceName = 'CUSTOMER_UPLOAD';
    let uploadedBy: any = sessionStorage.getItem('SenderUserId');
    this.spinner.show()
    this.apiService
      .getUploadBulkSalaryViewData(uploadedBy, serviceName, data?.id)
      .subscribe({
        next: (res) => {
          if(res?.responseCode == 200){
            this.spinner.hide()        
            this.bulkSalaryData = res?.data;
          }else{
            this.spinner.hide()        
            alert(res?.error);
          }
        },error:()=>{
          this.spinner.hide() 
          alert('Error Try Again!!!')       
        }
      });
  }

  authorizeCustomeronboarding(value: any) {
    let serviceName = 'CUSTOMER_UPLOAD';
    let uploadedBy: any = sessionStorage.getItem('SenderUserId');
    this.spinner.show()
    this.apiService
      .authorizeCustomeronboarding(
        uploadedBy,
        serviceName,
        this.bulkSalaryDataid?.id,
        value
      )
      .subscribe({
        next: (res) => {
          if (res?.responseCode == 200) {
          this.spinner.hide() 
            alert('Data Updated Successfully');
            this.dialogRef.close()
          } else {
            alert(res?.error);
            this.spinner.hide() 

          }
        },
        error: () => {
          this.spinner.hide() 
          alert('Error Try Again');
        },
      });
  }
}
