import { Component } from '@angular/core';
import { EncryptService } from '../../../services/Encrypt-Decrypt/encrypt-decrypt.service';
import { ApiService } from '../../ApiService/api.service';
import { SpinnerService } from '../../spinner.service';
import { CommonModule } from '@angular/common';
import { MoneyTransferComponent } from "../money-transfer/money-transfer.component";
import { ListRequestsComponent } from "../list-requests/list-requests.component";
import { DatasharingService } from '../../../services/datasharing.service';

@Component({
  selector: 'app-list-moneytransfer-requests',
  standalone: true,
  imports: [CommonModule, MoneyTransferComponent, ListRequestsComponent],
  templateUrl: './list-moneytransfer-requests.component.html',
  styleUrl: './list-moneytransfer-requests.component.scss'
})
export class ListMoneytransferRequestsComponent {
  tab = 'requestMoney'
  tab1 = 'requestMoney'
  makerCheckerRestriction: any;

  constructor(
    private apiService: ApiService,
    private spinner: SpinnerService,
    private encryptService: EncryptService,
    private data: DatasharingService,
  ) {}
  selectTab1(selected :any){
    this.tab1 = selected;
   this.data.settabData(true)
  }
 ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  
  this.makerCheckerRestriction = sessionStorage.getItem('Role');
if(this.makerCheckerRestriction == 'CHECKER'){
  this.tab1 = 'pending'
}
 }
}
