import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../ApiService/api.service';
import { LoaderComponent } from "../../loader/loader.component";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-account-statement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent,MatIconModule,MatMenuModule],
  templateUrl: './account-statement.component.html',
  styleUrl: './account-statement.component.scss'
})
export class AccountStatementComponent {
  dateForm!: FormGroup;
  showDate: boolean = false;
  isLoading: boolean = false;
  batchId: any;
  accountStatementDetails: any;
  totalCredit: number = 0;
totalDebit: number = 0;
totalCreditCount: number = 0;
totalDebitCount: number = 0;
closingBalance:number = 0
agentSummaryReport: any;
currentPageNo: number = 1; // Start with page 1
pageSize: number = 20; // Number of records per page
totalPages: number = 0; // Total number of pages
currentPage: number = 1;

@ViewChild("content") content!: ElementRef;

constructor(
  private fb: FormBuilder,
  private apiService:ApiService
){}
paginatedData: any;
calculatePagination(): void {
  this.totalPages = Math.ceil(this.agentSummaryReport.length / this.pageSize);
  this.updatePagination(); // Update the displayed data for the first page
}

updatePagination(): void {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedData = this.agentSummaryReport.slice(startIndex, endIndex);
  console.log(this.paginatedData);
  
}

goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.updatePagination(); // Update the table data for the new page
  }
}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    let profileWalletNo = sessionStorage.getItem('profileWalletNo')
    this.dateForm = this.fb.group({
      fromDate: [""],
      toDate: [""],
      accNo: [""],
    });

    this.dateForm.controls['accNo'].setValue(profileWalletNo)

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const lastMonth = oneMonthAgo;
    const formatDate = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };
    this.dateForm.patchValue({
      fromDate: formatDate(lastMonth),
      toDate: formatDate(today),
    });
    
    this.showDate = true;
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      this.isLoading = true;
      this.apiService
        .getAccStatement(
         profileWalletNo,
          fromDate,
          toDate
        )
        .subscribe({
          next: (res: any) => {
            if (res?.responseCode == 200) {
              this.isLoading = false;
              console.log(res);
              this.accountStatementDetails = res?.data;
              this.agentSummaryReport = res?.data?.
              accStatementPojo
              this.calculatePagination();
              this.totalCredit = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.credit || '0');
              }, 0);
        
              this.totalDebit = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.debit || '0');
              }, 0);
              this.totalCreditCount = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
                // Only count if debit is 0 and credit is non-zero
                return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
              }, 0);
        
              this.totalDebitCount = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
                // Only count if credit is 0 and debit is non-zero
                return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
              }, 0);
            }
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
  }

  search(){
    let profileWalletNo = sessionStorage.getItem('profileWalletNo')

    this.showDate = true;
    let fromDate = this.dateForm.controls["fromDate"].value;
    let toDate = this.dateForm.controls["toDate"].value;
    this.isLoading = true;
    this.apiService
      .getAccStatement(
        profileWalletNo,
        fromDate,
        toDate
      )
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.responseCode == 200) {
            console.log(res);
            this.accountStatementDetails = res?.data;
            this.agentSummaryReport = res?.data?.
            accStatementPojo
            this.calculatePagination();
            this.totalCredit = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit || '0');
            }, 0);
      
            this.totalDebit = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit || '0');
            }, 0);
    
            this.totalCreditCount = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
            }, 0);
      
            this.totalDebitCount = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
            }, 0);
          }
        },
        error: () => {
          this.isLoading = false;

          alert("Error Try Again");
        },
      });
  }

  makePdf() {
    const doc = new jsPDF("p", "pt", "a4");
    
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
        doc.text('Your Statement', 380, 30);
    
        const startX = 380;
        const startY = 40;
        const lineSpacing = 12;
    
        doc.setFontSize(8);
        doc.setTextColor(40);
        const userDetails = this.accountStatementDetails?.userDetailsPojo;
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        doc.text(`Name: ${userDetails?.name}`, startX, startY);
        doc.text(`Account Number: ${userDetails?.accNo}`, startX, startY + lineSpacing);
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Current Balance: ${userDetails?.closingBalance}`, startX, startY + 3 * lineSpacing);
      };
    
      // Call the header for the first page explicitly
      addHeader(null);
    
      // Define table columns and data
      const columns = [
        { header: 'Txn_Date', dataKey: 'txnDate' },
        { header: 'Service Name', dataKey: 'serviceName' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Txn_ID', dataKey: 'batchId' },
        { header: 'Credit', dataKey: 'credit' },
        { header: 'Debit', dataKey: 'debit' },
        { header: 'Contra Acc', dataKey: 'contraAcc' },
        { header: 'Closing Balance', dataKey: 'runningBal' }
      ];
    
      const data = this.accountStatementDetails?.accStatementPojo
    
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data:any) => {
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
  
    doc.text('Closing Balance:', 40, footerY + 80);
    doc.text(`${this.accountStatementDetails?.userDetailsPojo?.closingBalance.toFixed(2)}`, 150, footerY + 80);
  
      // Save the PDF
      doc.save('account-statement.pdf');
  }
  
  exportToExcel(): void {
     // Helper function to create styled cell objects
     const createStyledCell = (value: any, styles: any) => ({
      v: value,
      s: styles
    });
  
    // Define header rows with color styling
    const headerRows = [
      [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
      [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
      [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
      [],
      [createStyledCell('Your Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
      [`Name: ${this.accountStatementDetails?.userDetailsPojo?.name}`],
      [`Account Number: ${this.accountStatementDetails?.userDetailsPojo?.accNo}`],
      [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
      [`Current Balance: ${this.accountStatementDetails?.userDetailsPojo?.closingBalance}`],
      []
    ];
  
    // Define table headers with color styling
    const tableHeaders = [
      [
        createStyledCell('Txn_Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Txn_ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Credit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Debit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Contra Acc', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Closing Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } })
      ]
    ];
  
    // Convert transactions to a basic format (without specific styling)
    const transactionRows = this.accountStatementDetails?.accStatementPojo.map((tx: any) => [
      tx.txnDate,
      tx.serviceName,
      tx.description,
      tx.batchId,
      tx.credit,
      tx.debit,
      tx.contraAcc,
      tx.runningBal
    ]);
  
    // Define summary rows with color styling
    const summaryRows = [
      [],
      [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      [createStyledCell(`Total Credit Count: ${this.totalCreditCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
      [createStyledCell(`Total Debit Count: ${this.totalDebitCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
      [createStyledCell(`Closing Balance: ${this.accountStatementDetails?.userDetailsPojo?.closingBalance}`, { font: { bold: true }, fill: { fgColor: { rgb: 'AFE1AF' } } })]
    ];
  
    // Combine all rows
    const worksheetData = [
      ...headerRows,
      ...tableHeaders,
      ...(transactionRows || []),
      ...summaryRows
    ];
  
    // Create worksheet and workbook
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet['!cols'] = [
      { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
    ];
  
    const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
  
    // Write the workbook and trigger download
    XLSX.writeFile(workbook, `Account-Statement.xlsx`);
  }

  exportToCSV(): void {
      // Define header rows for the CSV file
      const headerRows = [
       ['Afghan Besim Mobile Money Company,'],
       ['Darulaman Road, Hajiari Najari,'],
       ['KABUL, AFGHANISTAN'],
       [],
       ['Your Statement'],
       [`Name: ${this.accountStatementDetails?.userDetailsPojo?.name}`],
       [`Account Number: ${this.accountStatementDetails?.userDetailsPojo?.accNo}`],
       [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
       [`Current Balance: ${this.accountStatementDetails?.userDetailsPojo?.closingBalance}`],
       []
     ];
   
     // Define column headers for the transaction table
     const tableHeaders = [['Txn_Date', 'Service Name', 'Description', 'Txn_ID', 'Credit', 'Debit', 'Contra Acc', 'Closing Balance']];
   
     // Convert transactions to an array format
     const transactionRows = this.accountStatementDetails?.accStatementPojo.map((tx: { txnDate: any; serviceName: any; description: any; batchId: any; credit: any; debit: any; contraAcc: any; runningBal: any; }) => [
       tx.txnDate,
       tx.serviceName,
       tx.description,
       tx.batchId ? tx.batchId.toString() : '',
       tx.credit,
       tx.debit,
       tx.contraAcc,
       tx.runningBal
     ]);
   
     // Define summary rows
     const summaryRows = [
       [],
       [`Total Credit: ${this.totalCredit}`],
       [`Total Debit: ${this.totalDebit}`],
       [`Total Credit Count: ${this.totalCreditCount}`],
       [`Total Debit Count: ${this.totalDebitCount}`],
       [`Closing Balance: ${this.accountStatementDetails?.userDetailsPojo?.closingBalance}`]
     ];
   
     // Combine all rows for the CSV file
     const csvData = [
       ...headerRows,
       ...tableHeaders,
       ...transactionRows,
       ...summaryRows
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
         { wch: 20 }
       ];
   
     // Write to CSV format
     const csv = XLSX.utils.sheet_to_csv(worksheet);
   
     // Create a Blob from the CSV data and trigger download
     const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
     saveAs(csvBlob, `account-statement.csv`);
  }
}


