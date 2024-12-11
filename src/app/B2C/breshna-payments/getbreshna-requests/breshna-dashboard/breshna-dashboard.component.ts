import { Component } from '@angular/core';
import { BreshnaPaymentsComponent } from "../../breshna-payments.component";
import { GetBreshnaListComponent } from "../get-breshna-list/get-breshna-list.component";
import { CommonModule } from '@angular/common';
import { DatasharingService } from '../../../../services/datasharing.service';
import { EncryptService } from '../../../../services/Encrypt-Decrypt/encrypt-decrypt.service';
import { ApiService } from '../../../ApiService/api.service';
import { SpinnerService } from '../../../spinner.service';

@Component({
  selector: 'app-breshna-dashboard',
  standalone: true,
  imports: [BreshnaPaymentsComponent, GetBreshnaListComponent,CommonModule],
  templateUrl: './breshna-dashboard.component.html',
  styleUrl: './breshna-dashboard.component.scss'
})
export class BreshnaDashboardComponent {
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
