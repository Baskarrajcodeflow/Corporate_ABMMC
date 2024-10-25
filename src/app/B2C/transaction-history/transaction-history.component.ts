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
import { SignupComponent } from "../signup/signup.component";
import { SpinnerComponent } from "../spinner/spinner.component";
import { ApiService } from '../ApiService/api.service';
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
    SpinnerComponent
],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss',
})
export class TransactionHistoryComponent implements OnInit {
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
          }
        },
        error: () => {
          this.dataSharing.hide();
          alert('Error While Loading Data');
        },
      });
  }

  search(): void {
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
      disableClose:true
    });
  }

  //----------------------------------------------------------------------------//
  getTranasctionHistory(Page: any) {
    let operator: any;

    this.dataSharing.operator$.subscribe((res) => {
      operator = res;
    });
    let req = {
      accountNo: this.sharedService.walletNo,
      serviceName: operator,
      fromDate: '2024-06-01 00:00:00',
      toDate: '2024-06-26 23:59:59',
    };

    if (Page === 'nextPage') {
      this.isLoadingResults = true;
    }

    // else if (Page === 'previousPage') {
    //   this.isLoadingResults = true;
    //   this.loginService
    //     .getTranasctionHistory(req, --this.nextPage)
    //     .subscribe((res) => {
    //       if (res?.code == 100) {
    //         this.isLoadingResults = false;
    //         console.log(res?.response);
    //         this.tranactionHistory = res?.response;
    //       }
    //     });
    // } else {
    //   this.loginService
    //     .getTranasctionHistory(req, this.nextPage)
    //     .subscribe((res) => {
    //       if (res?.code == 100) {
    //         console.log(res?.response);
    //         this.tranactionHistory = res?.response;
    //       }
    //     });
    // }
  }
}
