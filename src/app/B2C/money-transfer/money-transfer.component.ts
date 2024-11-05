import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../ApiService/api.service';
import { SpinnerService } from '../spinner.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-money-transfer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
    LoaderComponent,
  ],
  templateUrl: './money-transfer.component.html',
  styleUrl: './money-transfer.component.css',
})
export class MoneyTransferComponent implements OnInit {
  totalAmount: any;
  profileId!: number;
  receiverId!: number;
  constructor(
    private apiService: ApiService,
    private spinner: SpinnerService
  ) {}
  ngOnInit(): void {
    let data = sessionStorage.getItem('WalletAmount');
    this.Walletform.controls['payFrom'].setValue(data);
    this.apiService.getUserProfile().subscribe((res) => {
      console.log(res);
      this.profileId = res?.data?.id;
      if (res) {
      }
    });
  }
  payToArray: any;
  serchBill() {
    this.isLoading = true;
    this.apiService
      .searchUserToPay(this.Walletform.controls['walletNo'].value)
      .subscribe({
        next: (res) => {
          if (res) {
            this.isLoading = false;
            this.payToArray = res?.data;
            this.receiverId = res?.data[0]?.id;
            console.log(this.payToArray, 'aaa');
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Something Went Wrong');
        },
      });
  }
  nextPage: any = 0;
  isLoading: boolean = false;
  Walletform = new FormGroup({
    walletNo: new FormControl('', Validators.required),
    payFrom: new FormControl('', Validators.required),
    payTo: new FormControl('', Validators.required),
    PIN: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    info: new FormControl('', Validators.required),
  });
  CheckAFC() {
    let walletNo = sessionStorage.getItem('profileWalletNo');
    this.isLoading = true;
    this.apiService
      .checkFeesAndCommission(
        walletNo,
        this.Walletform.controls['amount'].value
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.isLoading = false;
            console.log(res);
            this.spinner.hide();
            this.totalAmount = res?.data;
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Something Went Wrong');
        },
      });
  }

  sendMoney() {
    let body: any = {
      serviceReceiver: {
        id: this.receiverId,
      },
      initiator: {
        id: this.profileId,
      },
      serviceProvider: {
        id: this.profileId,
      },
      context: {
        TRANSACTION_DESCRIPTION: this.Walletform.controls['info'].value,
        PIN: this.Walletform.controls['PIN'].value,
        AMOUNT: String(this.totalAmount),
        MEDIUM: 'web',
        SERVICE_NAME: 'WALLET_TO_WALLET',
        CHANNEL: 'WALLET',
      },
    };
    this.isLoading = true;
    this.apiService.transferMoney(body).subscribe({
      next: (res) => {
        console.log(res);
        if (res) {
          this.isLoading = false;
          alert(res?.data);
          this.spinner.hide();
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Somethign went Wrong');
      },
    });
  }
  next() {
    this.nextPage++;
  }
}
