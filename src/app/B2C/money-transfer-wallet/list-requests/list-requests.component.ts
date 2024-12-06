import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EncryptService } from '../../../services/Encrypt-Decrypt/encrypt-decrypt.service';
import { ApiService } from '../../ApiService/api.service';
import { SpinnerService } from '../../spinner.service';
import { DatasharingService } from '../../../services/datasharing.service';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
interface walletDetails {
  id: any;
  fullName: string;
  walletNo: string;
  createdDate: string;
  tagStatus?: string;
  email: string;
  phone: string;
  showLink: boolean;
  showList: boolean;
  showAuthorize: boolean;
}
@Component({
  selector: 'app-list-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './list-requests.component.html',
  styleUrl: './list-requests.component.scss',
})
export class ListRequestsComponent {
  selectedCase: any;
  wallets: any;
  pin: any;
  @Input() sandData: any;
  isLoading: boolean = false;
  makerCheckerRestriction: any;

  constructor(
    private apiService: ApiService,
    private spinner: SpinnerService,
    private encryptService: EncryptService,
    private data: DatasharingService
  ) {}
  ngOnInit(): void {
      
  this.makerCheckerRestriction = sessionStorage.getItem('Role');
    let alreadyCalled = false;
    this.data.tab$.subscribe((res) => {
      if (res === true && !alreadyCalled) {
        alreadyCalled = true; // Set flag to true to avoid repeated calls
        // console.log('hello');
        this.getDataAll();
      }
    });
  }

  getDataAll() {
    let data = sessionStorage.getItem('basrUserId');
    this.isLoading = true;
    this.apiService.getMoneyTransferRequests(data).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.wallets = res?.data;
          console.log(this.wallets);
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Error');
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
    this.apiService.authorizeAmount(data).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.getDataAll()
          if (boolean == true) {
            this.isLoading = false;
            alert('Money Transfer Success');
          } else {
            this.isLoading = false;
            alert('Rejected Successfully');
          }
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;

        alert('Something Went Wrong');
      },
    });
  }
}
