import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../ApiService/api.service';
import { LoaderComponent } from "../../loader/loader.component";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: 'app-account-statement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
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
@ViewChild("content") content!: ElementRef;

constructor(
  private fb: FormBuilder,
  private apiService:ApiService
){}
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
    const element = this.content.nativeElement;
  
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 550;
      const pageHeight = 842;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
  
      let position = 0;
  
      doc.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + pageHeight; // Adjust this calculation
        doc.addPage();
        doc.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      doc.save(`account-statement.pdf`);
    });
  }
  

}
