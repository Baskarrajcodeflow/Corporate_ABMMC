import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatasharingService } from '../../../services/datasharing.service';
import { TopUpRechargeComponent } from "../top-up-recharge/top-up-recharge.component";
import { ListAllTopupComponent } from "../list-all-topup/list-all-topup.component";

@Component({
  selector: 'app-top-up-recharge-dashboard',
  standalone: true,
  imports: [CommonModule, TopUpRechargeComponent, ListAllTopupComponent],
  templateUrl: './top-up-recharge-dashboard.component.html',
  styleUrl: './top-up-recharge-dashboard.component.scss'
})
export class TopUpRechargeDashboardComponent {
  tab = 'requestMoney'
  tab1 = 'requestMoney'
  makerCheckerRestriction: any;

  constructor(private data: DatasharingService,){
    this.makerCheckerRestriction = sessionStorage.getItem('Role');
    if(this.makerCheckerRestriction == 'CHECKER'){
      this.tab1 = 'pending'
    }
  }
  selectTab1(selected :any){
    this.tab1 = selected;
   this.data.settabData(true)
  }
}
