import { Component, Input } from '@angular/core';
import { DatasharingService } from '../../../../services/datasharing.service';
import { EncryptService } from '../../../../services/Encrypt-Decrypt/encrypt-decrypt.service';
import { ApiService } from '../../../ApiService/api.service';
import { SpinnerService } from '../../../spinner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../loader/loader.component';

@Component({
  selector: 'app-get-breshna-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './get-breshna-list.component.html',
  styleUrl: './get-breshna-list.component.scss',
})
export class GetBreshnaListComponent {
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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.sandData);
    this.makerCheckerRestriction = sessionStorage.getItem('Role');
    let alreadyCalled = false;
    this.data.tab$.subscribe((res) => {
      if (res === true && !alreadyCalled) {
        alreadyCalled = true; // Set flag to true to avoid repeated calls
        // console.log('hello');
      }
    });
    this.getDataAll();
  }
  getDataAll() {
    let basrUserId = sessionStorage.getItem('basrUserId');
    this.isLoading = true;
    this.apiService.getBreshnaRequests(basrUserId).subscribe({
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
    this.apiService.authorizeBreshnaAmount(data).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.getDataAll();
          if (boolean == true) {
            this.isLoading = false;
            alert('Money Transfer Success');
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
