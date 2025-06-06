import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WalletService } from '../wallet-management/wallet-managemnt.service';
import { ApiService } from '../../ApiService/api.service';
import { SystemwalletComponent } from '../systemwallet/systemwallet.component';
import { AuthorizePushPullDialogComponent } from './Dialog/authorize-push-pull-dialog/authorize-push-pull-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: 'app-push-pull-money',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SystemwalletComponent,
    LoaderComponent
],
  templateUrl: './push-pull-money.component.html',
  styleUrl: './push-pull-money.component.css',
})
export class PushPullMoneyComponent {
  amount: any;
  pin: any;
  tab = 'push';
  tab1 = 'wallet';
  currentBalance: any;
  accountList: any = [];
  walletList: any = [];
  walletData: any;
  accountId: any;
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
  walletNo: any;
  UserId: any;
description: any;

  constructor(
    private walletService: WalletService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}
  makerCheckerRestriction: any;

  ngOnInit() {
    this.walletNo = sessionStorage.getItem('profileWalletNo');
    this.UserId = sessionStorage.getItem('SenderUserId');
    this.makerCheckerRestriction = sessionStorage.getItem('Role');
    console.log(this.walletNo);
    let baseUserId = sessionStorage.getItem('basrUserId');

    this.walletService.getWalletBalance(this.walletNo).subscribe((response) => {
      if (response.responseCode == 200) {
        this.currentBalance = response?.data;
      } else {
        alert('Not able to fetch balance');
      }
    });

    this.getWalletDetails();
    this.getPullPush();
    this.getAuthorizedBankAccounts();
  }
  preventInvalidCharacters(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
    }
  }
  getPullPush() {
    let baseUserId = sessionStorage.getItem('basrUserId');

    this.walletService.getPullPush(baseUserId).subscribe({
      next: (res) => {
        this.tranactionHistory = res?.data.sort((a: any, b: any) => 
          new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
        );
        console.log(this.tranactionHistory); // Verify the sorted data
      },
    });
    
  }

  getAuthorizedBankAccounts() {
    this.walletService.getLinkedRecords().subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.accountList = response.data;
        } else {
          alert('Not able to fetch linked bank accounts now. Try again');
        }
      },
      error: () => {
        alert('Something Went Wrong');
      },
    });
  }

  getWalletDetails() {
    this.walletService.getSystemWallets().subscribe((resp: any) => {
      console.log('System Wallet -', resp);
      if (resp.responseCode == 200) {
        this.walletList = resp.data;
      } else {
        alert(resp?.error);
      }
    });
  }

  showLinkedAccounts($event: any) {
    if (
      (this.walletData != null || this.walletData != '',
      this.walletData != 'undefined')
    ) {
      //this.showLinkedAccounts(this.wallet);
      console.log('Wallet', $event.target.value);
      let walletNo;

      for (let item of this.walletList) {
        if (item.id == $event.target.value) {
          walletNo = item.walletAccount.walletNo;
        }
      }
    }
  }

  onSubmit() {
    let serviceName = '';

    if (this.tab == 'push') {
      serviceName = 'GB_PUSH';
    } else {
      serviceName = 'GB_PULL';
    }

    let pullPushReq = {
      initiator: {
        id: sessionStorage.getItem('basrUserId'),
      },
      serviceProvider: {
        id: sessionStorage.getItem('basrUserId'),
      },
      serviceReceiver: {
        id: sessionStorage.getItem('basrUserId'),
      },
      context: {
        SERVICE_NAME: serviceName,
        MEDIUM: 'Web',
        CHANNEL: 'Backoffice',
        DESCRIPTION:this.description,
        AMOUNT: this.amount.toString(),
        bankPin: '',
        bankAccId: this.accountId,
      },
    };
    console.log(pullPushReq);
    
    this.walletService.addPushPull(pullPushReq).subscribe({
      next:(response)=>{
          if (response.responseCode == 200) {
            alert('Success');
            this.accountId = '';
            this.description = '';
            this.amount = '';
          } else {
            alert(response?.error);
          }
      },error:()=>{
        alert('Something Went Wrong, Try Again');
      }
    })
  }

  selectTab(selected: any) {
    this.tab = selected;
    this.accountId = '';
    this.amount = '';
    this.description = '';

  }
  selectTab1(selected: any) {
    this.tab1 = selected;
    this.getPullPush();
    this.getAuthorizedBankAccounts();
    this.accountId = '';
    this.amount = '';
    this.description = '';

  }
  authorize(event: any,bool:any) {
    let dialogRef = this.dialog
      .open(AuthorizePushPullDialogComponent, {
        width: '500px',
        height: '220px',
        panelClass: 'custom-dialog-container',
        data: {data:event,bool:bool},
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: any) => {
        console.log(res);
        //  this.dialogRef.close()
        this.getPullPush();
      });
  }
  isLoading: boolean = false;

  reject(event:any,bool:any){
    let data = {
      reqId: event?.id,
      value:bool
    };
    this.isLoading = true;
    this.walletService.authorizePushPull(data).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          alert('Success');
        this.getPullPush();
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong!!!");
      },
    });
  }
}
