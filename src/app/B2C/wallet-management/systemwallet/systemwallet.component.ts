import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService } from '../wallet-management/wallet-managemnt.service';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../ApiService/api.service';

interface accountLinked {
  bankName: string;
  bankLogo?: string;
  accountNo: string;
  status?: string;
}

interface walletDetails {
  id: any;
  fullName: string;
  walletNo: string;
  createdDate: string;
  tagStatus?: string;
  email: string;
  phone: string;
  accountLinkedList: accountLinked[];
  showLink: boolean;
  showList: boolean;
  showAuthorize: boolean;
}

@Component({
  selector: 'app-systemwallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './systemwallet.component.html',
  styleUrl: './systemwallet.component.css',
})
export class SystemwalletComponent {
  wallets: walletDetails[] = [];
  banksList: any;
  accountNumber: any;
  bankId: any;
  accountId: any;
  pin: any;
  selectedCase: any;
  accountList: any = [];
  constructor(
    private walletService: WalletService,
    private datePipe: DatePipe,
    private apiService: ApiService
  ) {}

  makerCheckerRestriction: any;
  ngOnInit() {
    this.makerCheckerRestriction = sessionStorage.getItem('Role');
    this.getWalletDetails();
    this.getBanks();
  }

  getWalletDetails() {
    this.apiService.getUserProfile().subscribe((resp: any) => {
      console.log('System Wallet -', resp);
      if (resp.responseCode == 200) {
        let wallet: walletDetails;
        let data = resp?.data;
        const formattedDate = this.datePipe.transform(
          data.walletAccount.acOpenDate,
          'dd-MMM-yyyy'
        );
        const formattedTime = this.datePipe.transform(
          data.walletAccount.acOpenDate,
          'hh:mm a'
        );
        wallet = {
          id: data.id++,
          fullName: data.firstName + ' ' + data.lastName,
          walletNo: data.walletAccount.walletNo,
          createdDate: formattedDate + ' ' + formattedTime,
          email: data.email,
          phone: data.phone,
          accountLinkedList: [],
          showLink: false,
          showAuthorize: false,
          showList: false,
          //tagstatus? accList
        };
        this.wallets.push(wallet);
      } else {
        alert('Something went wrong');
      }
    });
  }
  getBanks() {
    this.walletService.getBanks().subscribe((resp) => {
      if (resp.responseCode == 200) {
        console.log('Banks', resp.data);
        this.banksList = resp.data;
      } else {

      /*       console.log("System Wallet -",this.wallets);
       */
        alert('Something went wrong');
      }
    });
  }

  link(wallet: walletDetails, formName: NgForm) {
    let userId = wallet.id;
    let req = {
      bankId: this.bankId,
      bankAccNo: this.accountNumber,
      bankPin: '',
    };
    /* let req ={
      ... account,
      baseUserId : userId
    } */

    this.walletService.addSystemWallet(userId, req).subscribe((response) => {
      if (response.responseCode == 200) {
        alert('Account Linked Successfully');
        formName.reset();
      } else {
        alert(response?.error);
      }
    });
  }
  authorizeAccount(userId: any, formName: NgForm) {
    this.walletService
      .authorizeSystemWalletAccount(this.accountId, userId, this.pin)
      .subscribe((response) => {
        if (response.responseCode == 200) {
          alert('Account Authorized successfully');
          formName.reset();
        } else {
          alert('Not able to fetch linked bank accounts now. Try again');
        }
      });
  }

  showLinkedAccounts(userId: any) {
    this.walletService
      .getLinkedAccountsSystemWallet(userId)
      .subscribe((response) => {
        if (response.responseCode == 200) {
          this.accountList = response.data;
          for (let item of this.accountList) {
            const formattedDate = this.datePipe.transform(
              item.createdOn,
              'dd-MMM-yyyy'
            );
            const formattedTime = this.datePipe.transform(
              item.createdOn,
              'hh:mm a'
            );
            item.createdOn = formattedDate + ' ' + formattedTime;
          }
        } else {
          alert('Not able to fetch linked bank accounts now. Try again');
        }
      });
  }

  switchView(selected: any, wallet: walletDetails) {
    this.selectedCase = selected;
    if (selected == 'link') {
      wallet.showLink = !wallet.showLink;
    } else if (selected == 'authorize') {
      wallet.showAuthorize = !wallet.showAuthorize;
      this.showLinkedAccounts(wallet.id);
    } else {
      wallet.showList = !wallet.showList;
      this.showLinkedAccounts(wallet.id);
    }
    // wallet.showForm = !wallet.showForm;
  }

  onClickView(arg: any) {}
}
