import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService } from '../wallet-management/wallet-managemnt.service';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../ApiService/api.service';
import { SharedService } from '../../../services/shared.service';
import { LoaderComponent } from '../../loader/loader.component';

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
  imports: [CommonModule, FormsModule, LoaderComponent],
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
  checkpin: any;
  enail: any;
  constructor(
    private walletService: WalletService,
    private datePipe: DatePipe,
    private apiService: ApiService,
    private sharedService: SharedService
  ) {}

  makerCheckerRestriction: any;
  ngOnInit() {
    this.makerCheckerRestriction = sessionStorage.getItem('Role');
    this.getWalletDetails();
    this.getBanks();
    this.getLinkedRecords();
    this.sharedService.loginDeatails$.subscribe((res: any) => {
      if (res) (this.enail = res?.email), console.log(res, 'userName');
    });
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

  getLinkedRecords() {
    this.walletService.getLinkedRecords().subscribe((res) => {
      console.log(res);
    });
  }

  link(wallet: walletDetails, formName: NgForm) {
    let baseUserId = sessionStorage.getItem('basrUserId');

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
    this.isLoading = true;
    this.walletService.addSystemWallet(baseUserId, req).subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.isLoading = false;
          alert('Account linking successfully initiated');
          formName.reset();
        } else {
          this.isLoading = false;
          alert(response?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Something Went Wrong');
      },
    });
  }
  authorizeAccount(userId: any, formName: NgForm) {
    let baseUserId = sessionStorage.getItem('basrUserId');
    this.isLoading = true;
    this.walletService
      .authorizeSystemWalletAccount(this.accountId, baseUserId, this.pin)
      .subscribe({
        next: (response) => {
          if (response.responseCode == 200) {
            this.isLoading = false;
            alert('Success');
            formName.reset();
          } else {
            this.isLoading = false;
            alert(response?.error);
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Something Went Wrong');
        },
      });
  }

  showLinkedAccounts(userId: any) {
    let baseUserId = sessionStorage.getItem('basrUserId');
    this.isLoading = true;
    this.walletService
      .getLinkedAccountsSystemWallet(baseUserId)
      .subscribe((response) => {
        if (response.responseCode == 200) {
          this.isLoading = false;
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
          this.isLoading = false;
          alert('Not able to fetch linked bank accounts now. Try again');
        }
      });
  }

  switchView(selected: any, wallet: walletDetails) {
    this.viewNew = '';
    let baseUserId = sessionStorage.getItem('basrUserId');
    this.selectedCase = selected;
    if (selected == 'link') {
      wallet.showLink = !wallet.showLink;
    } else if (selected == 'authorize') {
      wallet.showAuthorize = !wallet.showAuthorize;
      this.showLinkedAccounts(baseUserId);
    } else {
      wallet.showList = !wallet.showList;
      this.showLinkedAccounts(baseUserId);
    }
    // wallet.showForm = !wallet.showForm;
  }

  onClickView(arg: any) {}
  isLoading: boolean = false;
  viewNew: any;
  acccountNumber: any;
  accountBalance: any;
  select(arg: any, data: any) {
    console.log(arg);
    this.viewNew = arg;
    this.acccountNumber = data;
  }

  checkBalance() {
    let body = {
      bankAccId: this.acccountNumber?.accountNumber,
      bankPin: this.checkpin,
    };
    this.isLoading = true;
    this.walletService.checkBalance(body).subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.isLoading = false;
          this.accountBalance = response?.data;
        } else {
          this.isLoading = false;
          alert(response?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Something Went Wrong');
      },
    });
  }

  otpRequestFlag: boolean = true;
  otp: any;
  requestOtp() {
    let email = sessionStorage.getItem('email');
    let body = {
      email: email,
      userType: 'CORPORATE',
    };
    console.log(body);
    this.isLoading = true;
    this.apiService.generateOtp(body).subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.otpRequestFlag = false;
          this.isLoading = false;
          alert('Otp Requested');
        } else {
          if (response?.error) {
            this.isLoading = false;
            alert(response?.error);
          } else {
            this.isLoading = false;
            alert(response?.data);
          }
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Something Went Wrong');
      },
    });
  }

  delinkRequest() {
    let body = {
      bankAccId: this.acccountNumber?.accountNumber,
      otp: this.otp,
    };
    this.isLoading = true;
    this.walletService.delinkBankAccount(body).subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.isLoading = false;
          alert(response?.data);
          this.otpRequestFlag = true;
        } else {
          this.isLoading = false;
          alert(response?.error);
        }
      },
      error: () => {
        this.isLoading = false;

        alert('Something Went Wrong');
      },
    });
  }
}
