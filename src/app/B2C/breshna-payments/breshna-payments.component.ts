import { Component, OnInit } from "@angular/core";
import { ApiService } from "../ApiService/api.service";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { SpinnerComponent } from "../spinner/spinner.component";
import { SpinnerService } from "../spinner.service";
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: "app-breshna-payments",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, SpinnerComponent, LoaderComponent],
  templateUrl: "./breshna-payments.component.html",
  styleUrl: "./breshna-payments.component.css",
})
export class BreshnaPaymentsComponent implements OnInit {
  searchBillDetails: any;
  isLoading:boolean = false
  constructor(
    private apiService: ApiService,
    private spinner: SpinnerService
  ) {}
  breshna = new FormGroup({
    BtnPayFrom: new FormControl("", Validators.required),
    AccNumber: new FormControl("", Validators.required),
    CustomerAccNum: new FormControl("", Validators.required),
    PIN: new FormControl("", Validators.required),
  });

  ngOnInit(): void {
    let data = sessionStorage.getItem("WalletAmount");
    this.breshna.controls["BtnPayFrom"].setValue(data);
  }

  searchBill() {
    this.isLoading = true
    this.apiService
      .fetchBreshnaBill(this.breshna.controls["AccNumber"].value)
      .subscribe({
        next:(res)=>{
            console.log(res);
            if (res?.responseCode == 200) {
              this.isLoading = false
              this.searchBillDetails = res?.data;
            }else{
              this.isLoading = false
              alert(res?.error)
            }
        },error:()=>{
          alert('Something Went Wrong')
          this.isLoading = false
        }
      })
  }

  payBreshnaBill() {
    let userId = sessionStorage.getItem("SenderUserId");
    let basrUserId = sessionStorage.getItem("basrUserId");
   
    let body = {
      initiator: {
        id: Number(userId),
      },
      serviceProvider: {
        id: Number(basrUserId),
      },
      context: {
        MEDIUM: "web",
        AMOUNT: this.searchBillDetails?.AMOUNT,
        CHANNEL: "WALLET",
        TransactionPin: this.breshna.controls["PIN"].value,
        SERVICE_NAME: "BRESHNA_SERVICE",
        accNo: this.searchBillDetails?.ACNO,
        address:this.searchBillDetails?.ADD
      },
      serviceReceiver: {
        id: Number(userId),
      },
    };
    this.isLoading = true
    this.apiService.payBreshnaBill(body).subscribe({
      next:(res)=>{
          console.log(res);
          if (res?.responseCode == 200) {
            alert('Success')
            this.isLoading = false
          }else{
            alert(res?.error)
            this.isLoading = false
          }
      },error:()=>{
        alert('Something Went Wrong')
        this.isLoading = false
      }
    })
  }
}
