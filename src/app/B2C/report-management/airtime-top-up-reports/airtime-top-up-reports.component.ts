import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../ApiService/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LoaderComponent } from '../../loader/loader.component';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-airtime-top-up-reports',
  standalone: true,
  imports: [ReactiveFormsModule,LoaderComponent,MatIconModule,MatMenuModule,CommonModule],
  templateUrl: './airtime-top-up-reports.component.html',
  styleUrl: './airtime-top-up-reports.component.scss'
})
export class AirtimeTopUpReportsComponent {
  dateForm!: FormGroup;
  agentSummaryReport: any;
currentPageNo: number = 1; // Start with page 1
pageSize: number = 20; // Number of records per page
totalPages: number = 0; // Total number of pages
currentPage: number = 1;
isLoading:boolean = false
  airtimeReconciliationReport: any;
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
    type: [""],
    status: [""],
    service: [""],
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
  let fromDate = this.dateForm.controls["fromDate"].value;
  let toDate = this.dateForm.controls["toDate"].value;
  let data = {
    FromDate: `${fromDate} 00:00:00`,
    ToDate: `${toDate} 23:59:59`,
    wallet:sessionStorage.getItem('profileWalletNo')
  };
this.isLoading = true;
this.apiService.transactionReport("AirtimeReconciliationReportByWallet", data).subscribe({
next: (res: any) => {
this.isLoading = false;
this.airtimeReconciliationReport = res
this.agentSummaryReport = res
this.calculatePagination();
},
error: () => {
this.isLoading = false;
alert("Error Try Again");
},
});
}

search(){
  let fromDate = this.dateForm.controls["fromDate"].value;
  let toDate = this.dateForm.controls["toDate"].value;
  let status = this.dateForm.controls["status"].value;
  let type = this.dateForm.controls["type"].value;
  let wallet = this.dateForm.controls["accNo"].value;

console.log(type);

    let data = {
      FromDate: `${fromDate} 00:00:00`,
      ToDate: `${toDate} 23:59:59`,
      wallet:sessionStorage.getItem('profileWalletNo')
    };
this.isLoading = true;
this.apiService.transactionReport("AirtimeReconciliationReportByWallet", data).subscribe({
next: (res: any) => {
  this.isLoading = false;
  this.airtimeReconciliationReport = res
  this.agentSummaryReport = res
  this.calculatePagination();
},
error: () => {
  this.isLoading = false;
  alert("Error Try Again");
},
});

}

makePdf(){
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
          doc.text('AirTime Topup Statement', 380, 30);
        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;
    
        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
      };
    
      // Call the header for the first page explicitly
      addHeader(null);
    
      // Define table columns and data
      const columns = [
        { header: 'Created On', dataKey: 'created_date' },
        { header: 'Service Name', dataKey: 'service_name' },
        { header: 'Customer Phone No	', dataKey: 'customer_mobile' },
        { header: 'Txn_Ref_Id', dataKey: 'transaction_id' },
        { header: 'Txn_ID', dataKey: 'batch_id' },
        { header: 'Sender Wallet No', dataKey: 'sender_wallet_no' },
        { header: 'Receiver Wallet No', dataKey: 'receiver_wallet_no' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Amount', dataKey: 'amount' },
      ];
    
      const data = this.agentSummaryReport
    
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
    
       
      // Save the PDF
        doc.save('Airtime-topup-report.pdf');
}

exportToExcel(){
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
    [createStyledCell('Airtime Time-Topup Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
    [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
    []
  ];

  // Define table headers with color styling
  const tableHeaders = [
    [
      createStyledCell('Created On', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
      createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
      createStyledCell('Customer Phone No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
      createStyledCell('Txn_Ref_Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
      createStyledCell('Txn_ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
      createStyledCell('Sender Wallet No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
      createStyledCell('Receiver Wallet No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
      createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
      createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
    ]
  ];

  // Convert transactions to a basic format (without specific styling)
  const transactionRows = this.agentSummaryReport.map((tx: any) => [
    tx.created_date,
    tx.service_name,
    tx.customer_mobile,
    tx.transaction_id,
    tx.batch_id,
    tx.sender_wallet_no,
    tx.receiver_wallet_no,
    tx.status,
    tx.amount,
  ]);



  // Combine all rows
  const worksheetData = [
    ...headerRows,
    ...tableHeaders,
    ...(transactionRows || []),      ];

  // Create worksheet and workbook
  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
  worksheet['!cols'] = [
    { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
    { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
  ];

  const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

  // Write the workbook and trigger download
    XLSX.writeFile(workbook, `AirtimeTopUpReport.xlsx`);
}

exportToCSV(){
   // Define header rows for the CSV file
   const headerRows = [
    ['Afghan Besim Mobile Money Company,'],
    ['Darulaman Road, Hajiari Najari,'],
    ['KABUL, AFGHANISTAN'],
    [],
    ['Airtime Time-Topup Report'],
    [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
    []
  ];

  // Define column headers for the transaction table
  const tableHeaders = [['Created On', 'Service Name', 'Customer Phone No', 'Txn_Ref_Id', 'Txn_ID', 'Sender Wallet No', 'Receiver Wallet No','Status','Amount']];


  const transactionRows = this.agentSummaryReport.map((tx: any) => [
   tx.created_date,
   tx.service_name,
   tx.customer_mobile,
   tx.transaction_id,
   tx.batch_id,
   tx.sender_wallet_no,
   tx.receiver_wallet_no,
   tx.status,
   tx.amount,
  ]);

  // Combine all rows for the CSV file
  const csvData = [
    ...headerRows,
    ...tableHeaders,
    ...transactionRows,
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
       saveAs(csvBlob, `AirtimeTopUpReport.csv`);
}
}
