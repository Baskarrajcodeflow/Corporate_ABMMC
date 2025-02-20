import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionDialogComponent } from './Dialog/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../services/login.service';
import { DatasharingService } from '../../services/datasharing.service';
import { SharedService } from '../../services/shared.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SignupComponent } from '../signup/signup.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ApiService } from '../ApiService/api.service';
import { MatMenuModule } from '@angular/material/menu';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx-js-style';
import saveAs from 'file-saver';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    SignupComponent,
    SpinnerComponent,
    MatMenuModule,
  ],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss',
})
export class TransactionHistoryComponent implements OnInit {
  totalCredit: any;
  totalDebit: any;
  totalCreditCount: any;
  totalDebitCount: any;
  constructor(
    private dialog: MatDialog,
    private loginService: ApiService,
    private dataSharing: DatasharingService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}
  //----------------------------------------------------------------------------//
  // transactionHitoryForm = new FormGroup({
  //   fromDate: new FormControl('',Validators.required),
  //   toDate: new FormControl('',Validators.required),
  //   type: new FormControl('',Validators.required),
  // })
  nextPage: any = 0;
  responseLength!: boolean;
  isLoadingResults!: boolean;
  transactionHitoryForm!: FormGroup;
  // previousPage: any = 0;
  tranactionHistory: any;
  array: any[] = [
    { value: 'ALL', type: 'ALL' },
    { value: 'CASH_IN', type: 'Cash In' },
    { value: 'CASH_OUT', type: 'Cash Out' },
    { value: 'AWCC_TOPUP', type: 'AWCC Topup' },
    { value: 'SALAAM_TOPUP', type: 'SALAM Topup' },
    { value: 'MTN_TOPUP', type: 'MTN Topup' },
    { value: 'ROSHAN_TOPUP', type: 'ROSHAN Topup' },
    { value: 'ETISALAT_TOPUP', type: 'ETISALAT Topup' },
    { value: 'WALLET_TO_WALLET', type: 'Wallet To Wallet' },
    { value: 'APS_TO_APS', type: 'APS to APS' },
    { value: 'SCAN_QR', type: 'QR Scan Payments' },
    { value: 'PULL_MONEY', type: 'Bank To Wallet' },
    { value: 'PUSH_MONEY', type: 'Wallet To Bank' },
    { value: 'AUB_PULL_MONEY', type: 'AUB Bank To Wallet' },
    { value: 'AUB_PUSH_MONEY', type: 'AUB Wallet To Bank' },
    { value: 'BRESHNA_SERVICE', type: 'Breshna Payments' },
    { value: 'STOCK_PURCHASE', type: 'Stock Purchase' },
    { value: 'STOCK_TRANSFER', type: 'Stock Transfer' },
  ];
  ngOnInit(): void {
    this.transactionHitoryForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      type: [''],
    });
    this.dataSharing.walletNo$.subscribe((res) => {
      if (res) {
        const today = new Date();
        // console.log('Current Date:', today.toISOString());
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        // console.log('One Month Ago:', oneMonthAgo);

        const lastMonth = oneMonthAgo;
        const formatDate = (date: Date): string => {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
          const year = date.getFullYear();
          return `${year}-${month}-${day}`;
        };
        this.transactionHitoryForm.patchValue({
          fromDate: formatDate(lastMonth),
          toDate: formatDate(today),
          type: 'ALL',
        });

        let walletNo = sessionStorage.getItem('profileWalletNo');
        let fromDate = this.transactionHitoryForm.controls['fromDate'].value;
        let toDate = this.transactionHitoryForm.controls['toDate'].value;
        let strToDate = toDate?.split('-').reverse().join('-');
        let strFromDate = fromDate?.split('-').reverse().join('-');

        this.dataSharing.show();
        this.loginService
          .getTranasctionHistory(
            walletNo,
            this.transactionHitoryForm.controls['type'].value,
            strFromDate,
            strToDate
          )
          .subscribe({
            next: (res) => {
              if (res?.responseCode == 200) {
                this.dataSharing.hide();
                this.tranactionHistory = res?.data;
                console.log(this.tranactionHistory);
                this.totalCredit = this.tranactionHistory?.reduce(
                  (acc: number, item: any) => {
                    return acc + parseFloat(item?.creditAmount || '0');
                  },
                  0
                );

                this.totalDebit = this.tranactionHistory?.reduce(
                  (acc: number, item: any) => {
                    return acc + parseFloat(item?.debitAmount || '0');
                  },
                  0
                );
                this.totalCreditCount = this.tranactionHistory?.reduce(
                  (acc: number, item: any) => {
                    // Only count if debit is 0 and credit is non-zero
                    return (
                      acc +
                      (parseFloat(item?.debitAmount) === 0 &&
                      parseFloat(item?.creditAmount) !== 0
                        ? 1
                        : 0)
                    );
                  },
                  0
                );

                this.totalDebitCount = this.tranactionHistory?.reduce(
                  (acc: number, item: any) => {
                    // Only count if credit is 0 and debit is non-zero
                    return (
                      acc +
                      (parseFloat(item?.creditAmount) === 0 &&
                      parseFloat(item?.debitAmount) !== 0
                        ? 1
                        : 0)
                    );
                  },
                  0
                );
              }
            },
            error: () => {
              this.dataSharing.hide();
              alert('Error While Loading Data');
            },
          });
      }
    });
  }

  search(): void {

    // this.loginService.downloadTransactionPdf().subscribe((res)=>{

    // })
    let walletNo = sessionStorage.getItem('profileWalletNo');
    let type = this.transactionHitoryForm.controls['type'].value || 'ALL';
    let fromDate = this.transactionHitoryForm.controls['fromDate'].value;
    let toDate = this.transactionHitoryForm.controls['toDate'].value;


    let strToDate = toDate?.split('-').reverse().join('-');
    let strFromDate = fromDate?.split('-').reverse().join('-');

    this.dataSharing.show();
    this.loginService
      .getTranasctionHistory(walletNo, type, strFromDate, strToDate)
      .subscribe({
        next: (res) => {
          if (res?.responseCode == 200) {
            this.dataSharing.hide();
            this.tranactionHistory = res?.data;
            console.log(this.tranactionHistory);
            this.totalCredit = this.tranactionHistory?.reduce(
              (acc: number, item: any) => {
                return acc + parseFloat(item?.creditAmount || '0');
              },
              0
            );

            this.totalDebit = this.tranactionHistory?.reduce(
              (acc: number, item: any) => {
                return acc + parseFloat(item?.debitAmount || '0');
              },
              0
            );
            this.totalCreditCount = this.tranactionHistory?.reduce(
              (acc: number, item: any) => {
                // Only count if debit is 0 and credit is non-zero
                return (
                  acc +
                  (parseFloat(item?.debitAmount) === 0 &&
                  parseFloat(item?.creditAmount) !== 0
                    ? 1
                    : 0)
                );
              },
              0
            );

            this.totalDebitCount = this.tranactionHistory?.reduce(
              (acc: number, item: any) => {
                // Only count if credit is 0 and debit is non-zero
                return (
                  acc +
                  (parseFloat(item?.creditAmount) === 0 &&
                  parseFloat(item?.debitAmount) !== 0
                    ? 1
                    : 0)
                );
              },
              0
            );
          }
        },
        error: () => {
          this.dataSharing.hide();
          alert('Error While Loading Data');
        },
      });
  }

  openDialog(responseData: any) {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      data: responseData,
      maxWidth: '500px',
      width: '450px',
      disableClose: true,
    });
  }

  //----------------------------------------------------------------------------//

  makePdf() {
    const doc = new jsPDF('p', 'pt', 'a4');

    // Function to add the header content
    const addHeader = (data: any) => {
      doc.addImage('../../../assets/images/logo.png', 'PNG', 40, 20, 50, 25);
      doc.setFontSize(8);
      doc.setTextColor(40);
      doc.text('Afghan Besim Mobile Money Company,', 40, 60);
      doc.text('Darulaman Road, Hajari Najari,', 40, 72);
      doc.text('KABUL, AFGHANISTAN', 40, 84);

      doc.setFontSize(10);
      doc.setTextColor('#f47a20');
      doc.text('Transaction History Statement', 380, 30);
      const startX = 380;
      const startY = 35;
      const lineSpacing = 5;

      doc.setFontSize(8);
      doc.setTextColor(40);
      const fromDate = this.transactionHitoryForm.controls['fromDate'].value;
      const toDate = this.transactionHitoryForm.controls['toDate'].value;
      doc.text(
        `Statement Period: ${fromDate} to ${toDate}`,
        startX,
        startY + 2 * lineSpacing
      );
    };

    // Call the header for the first page explicitly
    addHeader(null);

    // Define table columns and data
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'ServiceName', dataKey: 'serviceName' },
      { header: 'TransNo	', dataKey: 'transNo' },
      { header: 'OtherInfo', dataKey: 'otherInfo' },
      { header: 'TransType', dataKey: 'transType' },
      { header: 'Debit', dataKey: 'debitAmount' },
      { header: 'Credit', dataKey: 'creditAmount' },
    ];

    const data = this.tranactionHistory;

    // Generate the table with autoTable
    autoTable(doc, {
      columns: columns,
      body: data,
      startY: 100, // Adjust this to start the table below the header
      didDrawPage: (data: any) => {
        // Call addHeader for each new page
        addHeader(data);
      },
      headStyles: {
        fillColor: [244, 122, 32],
        textColor: 255,
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 8,
      },
      margin: { top: 100 }, // Ensure the table doesn't overlap with the header
    });

    // Add summary at the bottom of the page
    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom

    doc.setFontSize(10);
    doc.text('Total Credit:', 40, footerY);
    doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);

    doc.text('Total Debit:', 40, footerY + 20);
    doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);

    doc.text('Total Credit Count:', 40, footerY + 40);
    doc.text(`${this.totalCreditCount}`, 150, footerY + 40);

    doc.text('Total Debit Count:', 40, footerY + 60);
    doc.text(`${this.totalDebitCount}`, 150, footerY + 60);
    // Save the PDF
    doc.save('Transaction-History-report.pdf');
  }

  exportToExcel() {
    // Helper function to create styled cell objects
    const createStyledCell = (value: any, styles: any) => ({
      v: value,
      s: styles,
    });

    // Define header rows with color styling
    const headerRows = [
      [
        createStyledCell('Afghan Besim Mobile Money Company,', {
          fill: { fgColor: { rgb: 'FFAE19' } },
          font: { color: { rgb: '000000' } },
        }),
      ],
      [
        createStyledCell('Darulaman Road, Hajiari Najari,', {
          fill: { fgColor: { rgb: 'FFAE19' } },
          font: { color: { rgb: '000000' } },
        }),
      ],
      [
        createStyledCell('KABUL, AFGHANISTAN', {
          fill: { fgColor: { rgb: 'FFAE19' } },
          font: { color: { rgb: '000000' } },
        }),
      ],
      [],
      [
        createStyledCell('Transaction History Report', {
          font: { bold: true },
          fill: { fgColor: { rgb: 'BDD7EE' } },
        }),
      ],
      [
        `Statement Period: ${this.transactionHitoryForm.controls['fromDate'].value} to ${this.transactionHitoryForm.controls['toDate'].value}`,
      ],
      [],
    ];

    // Define table headers with color styling
    const tableHeaders = [
      [
        createStyledCell('Date', {
          font: { bold: true },
          fill: { fgColor: { rgb: 'A9D08E' } },
        }),
        createStyledCell('ServiceName', {
          font: { bold: true },
          fill: { fgColor: { rgb: 'A9D08E' } },
        }),
        createStyledCell('TransNo', {
          font: { bold: true },
          fill: { fgColor: { rgb: 'A9D08E' } },
        }),
        createStyledCell('OtherInfo', {
          font: { bold: true },
          fill: { fgColor: { rgb: 'A9D08E' } },
        }),
        createStyledCell('TransType', {
          font: { bold: true },
          fill: { fgColor: { rgb: 'A9D08E' } },
        }),
        createStyledCell('Debit', {
          font: { bold: true },
          fill: { fgColor: { rgb: 'A9D08E' } },
        }),
        createStyledCell('Credit', {
          font: { bold: true },
          fill: { fgColor: { rgb: 'A9D08E' } },
        }),
      ],
    ];

    // Convert transactions to a basic format (without specific styling)
    const transactionRows = this.tranactionHistory.map((tx: any) => [
      tx.date,
      tx.serviceName,
      tx.transNo,
      tx.otherInfo,
      tx.transType,
      tx.debitAmount,
      tx.creditAmount,
    ]);

    // Define summary rows with color styling
    const summaryRows = [
      [],
      [
        createStyledCell(`Total Credit: ${this.totalCredit}`, {
          font: { bold: true },
          fill: { fgColor: { rgb: 'F8CBAD' } },
        }),
      ],
      [
        createStyledCell(`Total Debit: ${this.totalDebit}`, {
          font: { bold: true },
          fill: { fgColor: { rgb: 'F8CBAD' } },
        }),
      ],
      [
        createStyledCell(`Total Credit Count: ${this.totalCreditCount}`, {
          fill: { fgColor: { rgb: 'FCE4D6' } },
        }),
      ],
      [
        createStyledCell(`Total Debit Count: ${this.totalDebitCount}`, {
          fill: { fgColor: { rgb: 'FCE4D6' } },
        }),
      ],
    ];

    // Combine all rows
    const worksheetData = [
      ...headerRows,
      ...tableHeaders,
      ...(transactionRows || []),
      ...summaryRows,
    ];

    // Create worksheet and workbook
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet['!cols'] = [
      { wch: 35 },
      { wch: 30 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { Statement: worksheet },
      SheetNames: ['Statement'],
    };

    // Write the workbook and trigger download
    XLSX.writeFile(workbook, `Transaction-History-Report.xlsx`);
  }

  exportToCSV() {
    // Define header rows for the CSV file
    const headerRows = [
      ['Afghan Besim Mobile Money Company,'],
      ['Darulaman Road, Hajiari Najari,'],
      ['KABUL, AFGHANISTAN'],
      [],
      ['Airtime Time-Topup Report'],
      [
        `Statement Period: ${this.transactionHitoryForm.controls['fromDate'].value} to ${this.transactionHitoryForm.controls['toDate'].value}`,
      ],
      [],
    ];

    // Define column headers for the transaction table
    const tableHeaders = [
      [
        'Date',
        'Service Name',
        'TransNo',
        'OtherInfo',
        'TransType',
        'Debit',
        'Credit',
      ],
    ];

    const transactionRows = this.tranactionHistory.map((tx: any) => [
      tx.date,
      tx.serviceName,
      tx.transNo,
      tx.otherInfo,
      tx.transType,
      tx.debitAmount,
      tx.creditAmount,
    ]);

    // Define summary rows
    const summaryRows = [
      [],
      [`Total Credit: ${this.totalCredit}`],
      [`Total Debit: ${this.totalDebit}`],
      [`Total Credit Count: ${this.totalCreditCount}`],
      [`Total Debit Count: ${this.totalDebitCount}`],
    ];

    // Combine all rows for the CSV file
    const csvData = [
      ...headerRows,
      ...tableHeaders,
      ...transactionRows,
      ...summaryRows,
    ];

    // Create a worksheet for CSV
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

    // Apply the column width to create spacing if needed
    worksheet['!cols'] = [
      { wch: 30 }, // Adjust width as needed for alignment
      { wch: 30 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    // Write to CSV format
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    // Create a Blob from the CSV data and trigger download
    const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(csvBlob, `Transaction-History-Report.csv`);
  }
}
