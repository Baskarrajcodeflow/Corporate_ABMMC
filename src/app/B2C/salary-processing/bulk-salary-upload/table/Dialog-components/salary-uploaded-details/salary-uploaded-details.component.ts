import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { RejectReasonDialogComponent } from "../reject-reason-dialog/reject-reason-dialog.component";
import { LoaderComponent } from "../../../../../loader/loader.component";
import { ApiService } from "../../../../../ApiService/api.service";

@Component({
  selector: "app-salary-uploaded-details",
  standalone: true,
  imports: [CommonModule, MatIconModule, LoaderComponent],
  templateUrl: "./salary-uploaded-details.component.html",
  styleUrl: "./salary-uploaded-details.component.css",
})
export class SalaryUploadedDetailsComponent {
  csvData!: string;
  completedStatus: any;
  makerCheckerRestriction: any;
  totalAmount: any;

  constructor(
    private dialogRef: MatDialogRef<SalaryUploadedDetailsComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    console.log(data);
  }
  isLoading: boolean = false;
    userPrivileges: any;
  SalaryPrivelege: any;
  ngOnInit(): void { 
    this.makerCheckerRestriction = sessionStorage.getItem('Role');

if(this.data?.id != 4){
  this.isLoading = true;
  this.apiService
    .uploadedFileReport(this.data?.item?.id, this.data?.id)
    .subscribe({
      next: (res: any) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.csvData = res?.data;
          this.rawData = res?.data;
          this.parsedData = this.parseCSV(this.csvData);
          this.compareData(this.rawData);
        } else {
          this.isLoading = false;
          console.log(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong.Try Again Later!!!");
      },
    });

}
if(this.data?.id == 4){
  this.isLoading = true;
  this.apiService.completedSalaryTransactionReport(this.data?.item?.id).subscribe({
    next:(res:any)=>{
      console.log(res);
      if(res?.responseCode == 200){
        this.isLoading = false;
        this.completedStatus = res?.data
    this.totalAmount = this.completedStatus.reduce((sum:any, item:any) => sum + (item.amount || 0), 0);

      }else{
        this.isLoading = false;
        alert(res?.error)
      }
    },error:()=>{
      this.isLoading = false;
      alert('Something Went Wrong')
    }
  })

}
  }

  parsedData: any[] = [];

  parseCSV(csv: string): any[] {
    const lines = csv.split("\n");
    const headers = lines[0].trim().split(",");
    const rows = lines.slice(1);

    return rows.map((row) => {
      const values = row.trim().split(",");
      let obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  confirmDialog() {
    let dialogRef = this.dialog
      .open(RejectReasonDialogComponent, {
        width: "500px",
        height: "190px",
        panelClass: "custom-dialog-container",
        data: this.data?.item?.id,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res) => {
        if(res == undefined){
          this.dialogRef.close()
        }
      });
  }

  authorize() {
    this.isLoading = true;
    this.apiService.approveOrRejectUploadedFiles(this.data?.item?.id,true,'APPROVE').subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.isLoading = false;
          alert("Approved Successfully");
          this.dialogRef.close()
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong");
      },
    });
  }



  comparisonResults: any[] = [];
  rawData:any

  compareData(csvData: string) {
    const rows = csvData.split(/\r?\n/).filter(row => row.trim() !== ''); // Split rows by either \n or \r\n and filter out empty rows
    const headers = rows[0].split(','); // Extract headers
    
    const kycColumns = ['KYC_NAME', 'KYC_PHONE', 'KYC_EMAIL', 'WALLET_STATUS'];
    const actualColumns = ['name', 'account', 'amount', 'email', 'phone#'];
  
    // Iterate over the rows starting from the second row
    rows.slice(1).forEach(row => {
      const columns = row.split(',');
  
      // Check if the row has the expected number of columns
      if (columns.length < headers.length) return; // Skip if incomplete
      
      // Extract the left side (KYC data)
      const kycData = kycColumns.map(col => columns[headers.indexOf(col)] || ''); // Default to empty string if missing
      // Extract the right side (actual data)
      const actualData = actualColumns.map(col => columns[headers.indexOf(col)] || '');
  
      const [kycName, kycPhone, kycEmail, walletStatus] = kycData;
      const [actualName, actualAccount, actualAmount, actualEmail, actualPhone] = actualData;
  
      // Compare fields
      const nameMismatch = kycName !== actualName;
      const emailMismatch = kycEmail !== actualEmail;
      const phoneMismatch = kycPhone !== actualPhone;
  
      // Handle wallet status: display if not empty, otherwise show as empty
      const walletStatusDisplay = walletStatus ? walletStatus : ''; 
  
      // Push results to the comparison array
      this.comparisonResults.push({
        kycName,
        kycPhone,
        kycEmail,
        walletStatus: walletStatusDisplay, // Show the wallet status only if present
        actualName,
        actualAccount,
        actualAmount,
        actualEmail,
        actualPhone,
        nameMismatch,
        emailMismatch,
        phoneMismatch
      });
    });
  }
  


}

