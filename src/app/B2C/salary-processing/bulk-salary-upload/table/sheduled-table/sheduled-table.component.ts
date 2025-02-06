import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { LoaderComponent } from '../../../../loader/loader.component';
import { SalaryUploadedDetailsComponent } from '../Dialog-components/salary-uploaded-details/salary-uploaded-details.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../ApiService/api.service';
import { DataSharingService } from '../../../../dataSharing/data-sharing.service';
import { MatMenuModule } from '@angular/material/menu';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';

@Component({
  selector: 'app-sheduled-table',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatTooltip,MatButtonModule,LoaderComponent,MatMenuModule],
  templateUrl: './sheduled-table.component.html',
  styleUrl: './sheduled-table.component.css'
})
export class SheduledTableComponent {
  bulkSalaryData:any
  isLoading: boolean = false;
  basrUserId: any;
  completedStatus: any;

  constructor(private apiService:ApiService,private data:DataSharingService,private dialog:MatDialog){
    this.data.reuploadFileData(false)
  }
  ngOnInit(): void {
    this.basrUserId = sessionStorage.getItem('basrUserId')


    this.isLoading = true
   this.apiService.getAllUploadedFiles(this.basrUserId).subscribe({
    next:(res:any)=>{
    if(res?.responseCode == 200){
      const sortedData = res?.data.sort((a:any, b:any) => {
        return new Date(b.uploadedTime).getTime() - new Date(a.uploadedTime).getTime();
      });
      this.bulkSalaryData = sortedData
    this.isLoading = false
    }else{
      alert(res?.error)
    this.isLoading = false
    }
    },error:()=>{
    this.isLoading = false
      alert('Error While Fetching Data')
    }
   })
    
  }

  nextpage(item:any,id:any){
    let dialogRef = this.dialog
    .open(SalaryUploadedDetailsComponent, {
      width: '950px',
      height: '590px',
      data:{item,id},
      panelClass: 'custom-dialog-container',
      disableClose:true
    })
    .afterClosed()
    .subscribe((res:any) => {
      console.log(res);
    if(res == undefined){
    }  
    
    });
  }

  getReports(item:any){

    this.isLoading = true;
    this.apiService.completedSalaryTransactionReport(item?.id).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res?.responseCode == 200){
          this.isLoading = false;
          this.completedStatus = res?.data
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
    };
  
    // Call the header for the first page explicitly
    addHeader(null);
  
    // Define table columns
    const columns = [
      { header: 'Name', dataKey: 'name' },
      { header: 'Account No', dataKey: 'accountNumber' },
      { header: 'Amount', dataKey: 'amount' },
      { header: 'Email', dataKey: 'email' },
      { header: 'Phone', dataKey: 'phone' },
      { header: 'Status', dataKey: 'status' },
    ];
  
    // Preprocess the data to include "Success" or "Failure" for the 'status' column
    const processedData = this.completedStatus.map((item: any) => ({
      ...item,
      status: item.processed ? 'Success' : 'Failure',
    }));
  
    // Calculate the total amount
    const totalAmount = processedData.reduce((sum:any, item:any) => sum + (item.amount || 0), 0);
    const totalAmountProcessed = processedData.reduce((sum: any, item: any) => {
      return item?.processed ? sum + (item.amount || 0) : sum;
    }, 0);
    const totalAmountUnProcessed = processedData.reduce((sum: any, item: any) => {
      return item?.processed ? sum : sum + (item.amount || 0);
    }, 0);
    const count = processedData.filter((item: any) => item).length;
    const processedCount = processedData.filter((item: any) => item.processed).length;
    const UnprocessedCount = processedData.filter((item: any) => !item.processed).length;

    // Generate the table with autoTable
    autoTable(doc, {
      columns: columns,
      body: processedData,
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
      margin: { top: 110 }, // Ensure the table doesn't overlap with the header
    });
      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 50; // Adjust Y position to be close to the bottom
    
      doc.setFontSize(10);
      doc.text('Total Amount:', 40, footerY);
      doc.text(`${totalAmount.toFixed(2)}`, 110, footerY);

      doc.text('Total Amount Processed:', 40, footerY + 20);
      doc.text(`${totalAmountProcessed.toFixed(2)}`, 160, footerY + 20);

      doc.text('Total Amount UnProcessed:', 40, footerY + 40);
      doc.text(`${totalAmountUnProcessed.toFixed(2)}`, 170, footerY + 40);

      doc.text('Total Count:', 400, footerY);
      doc.text(`${count}`, 460, footerY);

      doc.text('Total Processed Count:', 400, footerY + 20);
      doc.text(`${processedCount}`, 510, footerY + 20);

      doc.text('Total UnProcessed Count:', 400, footerY + 40);
      doc.text(`${UnprocessedCount}`, 520, footerY + 40);
    // Save the PDF
    doc.save('Proccessed-Salary-Statement.pdf');
  }
  
  
  exportToExcel(): void {
    // Helper function to create styled cell objects
    const createStyledCell = (value: any, styles: any) => ({
      v: value,
      s: styles,
    });
  
    // Define header rows with color styling
    const headerRows = [
      [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
      [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
      [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
      [],
      [createStyledCell('Processed Salary Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
    ];
  
    // Define table headers with color styling
    const tableHeaders = [
      [
        createStyledCell('Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Account No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Email', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Phone', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
      ],
    ];
  
    // Preprocess the data to include "Success" or "Failure" for the 'status' column
    const processedData = this.completedStatus.map((item: any) => ({
      ...item,
      status: item.processed ? 'Success' : 'Failure',
    }));
  
    // Calculate the total amount
    const totalAmount = processedData.reduce((sum: any, item: any) => sum + (item.amount || 0), 0);
    const totalAmountProcessed = processedData.reduce((sum: any, item: any) => {
      return item?.processed ? sum + (item.amount || 0) : sum;
    }, 0);
    const totalAmountUnProcessed = processedData.reduce((sum: any, item: any) => {
      return item?.processed ? sum : sum + (item.amount || 0);
    }, 0);
    const count = processedData.filter((item: any) => item).length;
    const processedCount = processedData.filter((item: any) => item.processed).length;
    const unProcessedCount = processedData.filter((item: any) => !item.processed).length;
    // Convert transactions to rows for the table
    const transactionRows = processedData.map((tx: any) => [
      createStyledCell(tx.name, {}),
      createStyledCell(tx.accountNumber, {}),
      createStyledCell(tx.amount, {}),
      createStyledCell(tx.email, {}),
      createStyledCell(tx.phone, {}),
      createStyledCell(tx.status, {}), // Adding status here
    ]);
  
    // Define summary rows with color styling
    const summaryRows = [
      [],
      [createStyledCell(`Total Amount: ${totalAmount}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      [createStyledCell(`Total Amount Processed: ${totalAmountProcessed}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      [createStyledCell(`Total Amount UnProcessed: ${totalAmountUnProcessed}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      [createStyledCell(`Total Count: ${count}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      [createStyledCell(`Total Processed Count: ${processedCount}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      [createStyledCell(`Total UnProcessed Count: ${unProcessedCount}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
    ];
  
    // Combine all rows
    const worksheetData = [
      ...headerRows,
      ...tableHeaders,
      ...transactionRows,
      ...summaryRows,
    ];
  
    // Create worksheet and workbook
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet['!cols'] = [
      { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
    ];
  
    const workbook: XLSX.WorkBook = { Sheets: { Statement: worksheet }, SheetNames: ['Statement'] };
  
    // Write the workbook and trigger download
    XLSX.writeFile(workbook, `Proccessed-Salary-Statement.xlsx`);
  }


  exportToCSV(): void {
      // Define header rows for the CSV file
      const headerRows = [
       ['Afghan Besim Mobile Money Company,'],
       ['Darulaman Road, Hajiari Najari,'],
       ['KABUL, AFGHANISTAN'],
       [],
       ['Proccessed Salary Statement'],
     ];
   
     // Define column headers for the transaction table
     const tableHeaders = [['Name', 'Account No', 'Amount', 'Email', 'Phone', 'Status',]];
       // Preprocess the data to include "Success" or "Failure" for the 'status' column
       const processedData = this.completedStatus.map((item: any) => ({
        ...item,
        status: item.processed ? 'Success' : 'Failure',
      }));
    
      // Calculate the total amount
      const totalAmount = processedData.reduce((sum: any, item: any) => sum + (item.amount || 0), 0);
      const totalAmountProcessed = processedData.reduce((sum: any, item: any) => {
        return item?.processed ? sum + (item.amount || 0) : sum;
      }, 0);
      const totalAmountUnProcessed = processedData.reduce((sum: any, item: any) => {
        return item?.processed ? sum : sum + (item.amount || 0) ;
      }, 0);
      const count = processedData.filter((item: any) => item).length;
    const processedCount = processedData.filter((item: any) => item.processed).length;
    const unProcessedCount = processedData.filter((item: any) => !item.processed).length;
     // Convert transactions to an array format
     const transactionRows = processedData.map((tx: { name: any; accountNumber: any; amount: any; email: any; phone: any; status: any;}) => [
       tx.name,
       tx.accountNumber,
       tx.amount,
       tx.email,
       tx.phone,
       tx.status,
     ]);
   
     // Define summary rows
     const summaryRows = [
       [],
       [`Total Amount: ${totalAmount}`],
       [`Total Amount Processed: ${totalAmountProcessed}`],
       [`Total Amount UnProcessed: ${totalAmountUnProcessed}`],
       [`Total Count: ${count}`],
       [`Total Processed Count: ${processedCount}`],
       [`Total UnProcessed Count: ${unProcessedCount}`],
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
     saveAs(csvBlob, `Proccessed Salary-statement.csv`);
  }
  
}
