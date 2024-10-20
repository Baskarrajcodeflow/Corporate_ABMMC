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

@Component({
  selector: "app-breshna-payments",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, SpinnerComponent],
  templateUrl: "./breshna-payments.component.html",
  styleUrl: "./breshna-payments.component.css",
})
export class BreshnaPaymentsComponent implements OnInit {
  searchBillDetails: any;

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
    this.spinner.show();
    this.apiService
      .fetchBreshnaBill(this.breshna.controls["AccNumber"].value)
      .subscribe((res) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.spinner.hide();
        }else{
          this.spinner.hide();
        }
        this.searchBillDetails = res?.data;
      });
  }

  payBreshnaBill() {
    let userId = sessionStorage.getItem("SenderUserId");
   
    let body = {
      initiator: {
        id: Number(userId),
      },
      serviceProvider: {
        id: Number(userId),
      },
      context: {
        MEDIUM: "web",
        AMOUNT: this.searchBillDetails?.AMOUNT,
        CHANNEL: "WALLET",
        TransactionPin: this.breshna.controls["PIN"].value,
        SERVICE_NAME: "BRESHNA_SERVICE",
        accNo: this.searchBillDetails?.ACNO,
      },
      serviceReceiver: {
        id: Number(userId),
      },
    };
    this.spinner.show();
    this.apiService.payBreshnaBill(body).subscribe((res) => {
      console.log(res);
      if (res?.responseCode == 200) {
        alert(res?.data)
        this.spinner.hide();
      }else{
        this.spinner.hide();
      }
    });
  }
}
