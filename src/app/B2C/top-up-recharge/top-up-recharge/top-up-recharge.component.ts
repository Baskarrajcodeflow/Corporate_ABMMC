import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../ApiService/api.service';
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: 'app-top-up-recharge',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './top-up-recharge.component.html',
  styleUrl: './top-up-recharge.component.scss',
})
export class TopUpRechargeComponent {
  constructor(private apiService:ApiService){}
  // Map of prefixes to service names
  serviceMap: { [key: string]: string } = {
    '70': 'AWCC_TOPUP',
    '71': 'AWCC_TOPUP',
    '72': 'ROSHAN_TOPUP',
    '79': 'ROSHAN_TOPUP',
    '73': 'ETISALAT_TOPUP',
    '78': 'ETISALAT_TOPUP',
    '74': 'SALAM_TOPUP',
    '76': 'MTN_TOPUP',
    '77': 'MTN_TOPUP',
  };
  serviceName: any;
  onPhoneNumberInput() {
    const prefix: any = this.topUp.controls['mobNum'].value?.slice(0, 2); // Get first two digits
    this.serviceName = this.serviceMap[prefix] || null; // Find matching service
  }
  currentBal: any;
  isLoading:boolean = false
  topUp = new FormGroup({
    BtnPayFrom: new FormControl('', Validators.required),
    mobNum: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    PIN: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.currentBal = sessionStorage.getItem('WalletAmount');

    this.topUp.controls['BtnPayFrom'].setValue(this.currentBal);
  }
  submit() {
    let userId = sessionStorage.getItem("SenderUserId");
    let basrUserId = sessionStorage.getItem("basrUserId");
    let data = {
      context: {
        AMOUNT:  this.topUp.controls['amount'].value,
        CHANNEL: 'WALLET',
        MEDIUM: 'web',
        SERVICE_NAME: this.serviceName,
        accountId: '73300',
        mobileNumber: this.topUp.controls['mobNum'].value,
      },
      initiator: { id: Number(userId) },
      serviceProvider: { id: Number(basrUserId) },
      serviceReceiver: { id: Number(basrUserId) },
    };

    console.log(data);
    this.isLoading = true
    this.apiService.topUpRecharge(data).subscribe({
      next:(res:any)=>{
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.topUp.controls['mobNum'].reset()
          this.topUp.controls['amount'].reset()
            alert('Airtime Topup Success');
        } else {
          this.isLoading = false;
          alert(res?.error || res?.data);
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Something Went Wrong');
      },
    })
  }
}
