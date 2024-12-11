import { Component, Input } from '@angular/core';
import { DatasharingService } from '../../../services/datasharing.service';
import { EncryptService } from '../../../services/Encrypt-Decrypt/encrypt-decrypt.service';
import { ApiService } from '../../ApiService/api.service';
import { SpinnerService } from '../../spinner.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../loader/loader.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-all-topup',
  standalone: true,
  imports: [CommonModule, LoaderComponent,FormsModule],
  templateUrl: './list-all-topup.component.html',
  styleUrl: './list-all-topup.component.scss'
})
export class ListAllTopupComponent {
  @Input() sandData: any;
  isLoading: boolean = false;
  makerCheckerRestriction: any;
  wallets: any;
pin: any;
  constructor(
    private apiService: ApiService,
    private spinner: SpinnerService,
    private encryptService: EncryptService,
    private data: DatasharingService
  ) {}
ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.getDataAll()
}
  getDataAll() {
    let basrUserId = sessionStorage.getItem('basrUserId');
    this.isLoading = true;
    this.apiService.getMoneyTopUpRequests(basrUserId).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.wallets = res?.data;
        } else {
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Something Went Wrong');
      },
    });
  }

  toggleAuthorize(wallet: any) {
    wallet.showAuthorizeForm = !wallet.showAuthorizeForm;
  }

  authorize(event: any, boolean: boolean) {
    console.log(event);
    let data = {
      id: event?.id,
      value: boolean,
      pin: this.pin,
    };
    this.isLoading = true;
    this.apiService.authorizeTopupAmount(data).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.getDataAll();
          if (boolean == true) {
            this.isLoading = false;
            alert('Success');
          } else {
            this.isLoading = false;
            alert('Rejected Successfully');
          }
        } else {
          this.isLoading = false;
          alert(res?.error || res?.data);
        }
      },
      error: () => {
        this.isLoading = false;

        alert('Something Went Wrong');
      },
    });
  }
}
