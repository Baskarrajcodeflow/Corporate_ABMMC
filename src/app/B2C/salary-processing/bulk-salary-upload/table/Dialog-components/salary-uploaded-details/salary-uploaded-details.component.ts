import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RejectReasonDialogComponent } from '../reject-reason-dialog/reject-reason-dialog.component';
import { LoaderComponent } from '../../../../../loader/loader.component';
import { ApiService } from '../../../../../ApiService/api.service';

@Component({
  selector: 'app-salary-uploaded-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, LoaderComponent],
  templateUrl: './salary-uploaded-details.component.html',
  styleUrl: './salary-uploaded-details.component.css',
})
export class SalaryUploadedDetailsComponent {
  csvData!: string;
  completedStatus: any;
  makerCheckerRestriction: any;
  totalAmount: any;
  totalAmountProcessed: any;
  totalAmountUploaded: any;
  displayedData: any[] = [];
  itemsPerPage: number = 10;
  itemsPerPageNew: number = 7;
  itemsPerPage2: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  displayedData2: any[] = [];
  displayedDataNew: any[] = [];
  totalAmountUnProcessed: any;
  processedCount: any;
  unprocessedCount: any;
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

    if (this.data?.id != 4) {
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
              this.currentPage = 1; // Reset to first page
              this.updatePagination(); //
            } else {
              this.isLoading = false;
              console.log(res?.error);
            }
          },
          error: () => {
            this.isLoading = false;
            alert('Something Went Wrong.Try Again Later!!!');
          },
        });
    }
    if (this.data?.id == 4) {
      this.isLoading = true;
      this.apiService
        .completedSalaryTransactionReport(this.data?.item?.id)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            if (res?.responseCode == 200) {
              this.isLoading = false;
              this.completedStatus = res?.data;
              this.currentPage = 1; // Reset to first page
              this.updatePaginationNew(); //
              this.totalAmount = this.completedStatus.reduce(
                (sum: any, item: any) => sum + (item.amount || 0),
                0
              );
              this.totalAmountProcessed = this.completedStatus.reduce(
                (sum: any, item: any) => {
                  return item?.processed ? sum + (item.amount || 0) : sum;
                },
                0
              );
              this.totalAmountUnProcessed = this.completedStatus.reduce(
                (sum: any, item: any) => {
                  return item?.processed ? sum : sum + (item.amount || 0);
                },
                0
              );
              this.processedCount = this.completedStatus.filter((item: any) => item.processed).length;
              this.unprocessedCount = this.completedStatus.filter((item: any) => !item.processed).length;
           
            } else {
              this.isLoading = false;
              alert(res?.error);
            }
          },
          error: () => {
            this.isLoading = false;
            alert('Something Went Wrong');
          },
        });
    }
    this.currentPage = 1; // Ensure first page is set
    this.updatePagination();
    this.updatePaginationNew();
  }
  updatePagination() {
    this.totalPages = Math.ceil(this.uploadedAmount.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedData = this.uploadedAmount.slice(startIndex, endIndex);
  }
  changePage(direction: string) {
    if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    } else if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    }
    this.updatePagination();
  }
  updatePaginationNew() {
    // Calculate total pages
    this.totalPages = Math.ceil(
      this.completedStatus.length / this.itemsPerPageNew
    );

    // Calculate the start and end index for slicing the data
    const startIndex = (this.currentPage - 1) * this.itemsPerPageNew;
    const endIndex = startIndex + this.itemsPerPageNew;

    // Slice the completedStatus array to get data for the current page
    this.displayedDataNew = this.completedStatus.slice(startIndex, endIndex);
  }

  changePageNew(direction: string) {
    if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++; // Move to the next page
    } else if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--; // Move to the previous page
    }
    this.updatePaginationNew(); // Update the paginated data
  }
  updatePagination2() {
    // Calculate total pages
    this.totalPages = Math.ceil(
      this.comparisonResults.length / this.itemsPerPage2
    );

    // Calculate the start and end index for slicing the data
    const startIndex = (this.currentPage - 1) * this.itemsPerPage2;
    const endIndex = startIndex + this.itemsPerPage2;

    // Slice the comparisonResults array to get data for the current page
    this.displayedData2 = this.comparisonResults.slice(startIndex, endIndex);
  }

  changePage2(direction: string) {
    if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++; // Move to the next page
    } else if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--; // Move to the previous page
    }
    this.updatePagination2(); // Update the paginated data
  }
  parsedData: any[] = [];
  uploadedAmount: any[] = [];

  parseCSV(csv: string): any[] {
    const lines = csv.split('\n');
    const headers = lines[0].trim().split(',');
    const rows = lines.slice(1);

    return rows.map((row) => {
      const values = row.trim().split(',');
      let obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      console.log(obj);
      this.uploadedAmount.push(obj);
      this.totalAmountUploaded = this.uploadedAmount.reduce(
        (sum: any, item: any) => sum + parseFloat(item.amount || 0),
        0
      );
      this.currentPage = 1; // Reset to first page
      this.updatePagination(); //
      return obj;
    });
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  confirmDialog() {
    let dialogRef = this.dialog
      .open(RejectReasonDialogComponent, {
        width: '500px',
        height: '190px',
        panelClass: 'custom-dialog-container',
        data: this.data?.item?.id,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res == undefined) {
          this.dialogRef.close();
        }
      });
  }

  authorize() {
    this.isLoading = true;
    this.apiService
      .approveOrRejectUploadedFiles(this.data?.item?.id, true, 'APPROVE')
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res?.responseCode == 200) {
            this.isLoading = false;
            alert('Approved Successfully');
            this.dialogRef.close();
          } else {
            this.isLoading = false;
            alert(res?.error);
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Something Went Wrong');
        },
      });
  }

  comparisonResults: any[] = [];
  rawData: any;

  compareData(csvData: string) {
    const rows = csvData.split(/\r?\n/).filter((row) => row.trim() !== ''); // Split rows by either \n or \r\n and filter out empty rows
    const headers = rows[0].split(','); // Extract headers

    const kycColumns = ['KYC_NAME', 'KYC_PHONE', 'KYC_EMAIL', 'WALLET_STATUS'];
    const actualColumns = ['name', 'account', 'amount', 'email', 'phone#'];

    // Iterate over the rows starting from the second row
    rows.slice(1).forEach((row) => {
      const columns = row.split(',');

      // Check if the row has the expected number of columns
      if (columns.length < headers.length) return; // Skip if incomplete

      // Extract the left side (KYC data)
      const kycData = kycColumns.map(
        (col) => columns[headers.indexOf(col)] || ''
      ); // Default to empty string if missing
      // Extract the right side (actual data)
      const actualData = actualColumns.map(
        (col) => columns[headers.indexOf(col)] || ''
      );

      const [kycName, kycPhone, kycEmail, walletStatus] = kycData;
      const [
        actualName,
        actualAccount,
        actualAmount,
        actualEmail,
        actualPhone,
      ] = actualData;

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
        phoneMismatch,
      });
    });
    this.currentPage = 1; // Reset to first page
    this.updatePagination2(); //
  }
}
