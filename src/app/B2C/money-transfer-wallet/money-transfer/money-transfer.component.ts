import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
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
  suspend: any;
  dataMew:any
  walletNoLength: any;
  constructor(
    private apiService: ApiService,
    private spinner: SpinnerService,
    private encryptService: EncryptService
  ) {}
  ngOnInit(): void {
    this.dataMew = sessionStorage.getItem('WalletAmount');
    this.Walletform.controls['payFrom'].setValue(this.dataMew);
    this.apiService.getUserProfile().subscribe((res) => {
      console.log(res);
      if (res) {
        this.profileId = res?.data?.id;
      }
    });

    this.Walletform.get('amount')?.setValidators([
      Validators.required,
      Validators.pattern(/^[1-9][0-9]*$/),
      this.maxAmountValidatorFactory()
    ]);
    this.Walletform.get('amount')?.updateValueAndValidity(); // Refresh validation
  }
  payToArray: any;
  serchBill() {
    let walletAccountNo:any = this.Walletform.controls['walletNo'].value
    if (walletAccountNo.length >= 9 && walletAccountNo.slice(-9).startsWith("7")) {
      // Call the findPhone API
        this.findUser("PHONE", walletAccountNo.slice(-9));
    } else if (walletAccountNo.length === 13) {
      // Call the findWallet API
        this.findUser("WALLET", walletAccountNo);
    }
 
  }

  findUser(value:any,wallet:any){
    this.isLoading = true;
    this.apiService
    .searchUserToPay(value,wallet)
    .subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.suspend = res?.data[0]?.accountState;
          if(this.suspend != 'ACTIVE'){
            alert('Receiver Account Suspended')
          }
          if(res?.data[0]?.walletNo.length != 13){
            alert('Receiver Account Is Not Verified')
          }
          this.payToArray = res?.data;
          this.receiverId = res?.data[0]?.id;
          this.service = res?.data[0]?.walletType;
          this.walletNoLength = res?.data[0]?.walletNo
          console.log(this.payToArray, 'aaa');
        }else{
          this.isLoading = false;
          alert(res?.error)
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
    amount: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[1-9][0-9]*$/) ,
      this.maxAmountValidatorFactory() // Ensures only numbers, no leading zero, no 0 itself
    ]),     info: new FormControl('', Validators.required),
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
  maxAmountValidatorFactory() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = Number(control.value);
      return value > this.dataMew ? { maxAmount: true } : null;
    };
  }
  validateAmount(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    
    // Allow only numbers (48-57 are ASCII codes for 0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
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
