import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../ApiService/api.service';
import { SpinnerService } from '../../spinner.service';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { LoaderComponent } from '../../loader/loader.component';
import { EncryptService } from '../../../services/Encrypt-Decrypt/encrypt-decrypt.service';

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
  service: any;
  constructor(
    private apiService: ApiService,
    private spinner: SpinnerService,
    private encryptService: EncryptService
  ) {}
  ngOnInit(): void {
    let data = sessionStorage.getItem('WalletAmount');
    this.Walletform.controls['payFrom'].setValue(data);
    this.apiService.getUserProfile().subscribe((res) => {
      console.log(res);
      if (res) {
        this.profileId = res?.data?.id;
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
            this.service = res?.data[0]?.walletType;
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

  async sendMoney() {
    let SERVICE_NAME: any;
    if (this.service == 'CUSTOMER') {
      SERVICE_NAME = 'CORPORATE_TO_CUSTOMER';
    }else if(this.service == 'CORPORATE'){
      SERVICE_NAME = 'CORPORATE_TO_CORPORATE';
    }else if(this.service == 'AGENT'){
      SERVICE_NAME = 'CORPORATE_TO_AGENT';
    }else if(this.service == 'MERCHAN'){
      SERVICE_NAME = 'CORPORATE_TO_MERCHANT';
    }

    // const encryptedPin = await this.encryptService.encrypt(
    //   this.Walletform.controls['PIN'].value
    // );
    // console.log(encryptedPin);

    // const decrypt = await this.encryptService.decrypt(encryptedPin)
    // console.log(decrypt);

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
        // PIN: this.Walletform.controls['PIN'].value,
        AMOUNT: String(this.totalAmount),
        MEDIUM: 'web',
        SERVICE_NAME: SERVICE_NAME,
        CHANNEL: 'WALLET',
      },
    };
    this.isLoading = true;
    this.apiService.requestMoney(body).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.nextPage = 0;
          this.Walletform.reset();
          this.totalAmount = null;
          alert('Request Sent For Money Transfer');
          this.spinner.hide();
        } else {
          this.isLoading = false;
          alert(res?.error);
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
