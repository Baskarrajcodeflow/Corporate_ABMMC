import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatasharingService } from './datasharing.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceNameService {


  constructor(private dataSharing:DatasharingService) {}

  operatorData: any;
  objectData(firstTwo: any) {
    console.log(firstTwo);
    if (firstTwo == 70 || firstTwo == 71) {
      this.operatorData = 'AWCC';
    } else if (firstTwo == 72 || firstTwo == 79) {
      this.operatorData = 'ROSHAN';
    } else if (firstTwo == 73 || firstTwo == 78) {
      this.operatorData = 'ETISALAT';
    } else if (firstTwo == 74) {
      this.operatorData = 'SALAM';
    } else if (firstTwo == 76 || firstTwo == 77) {
      this.operatorData = 'MTN';
    }

    this.setOperator()
  }

  setOperator() {
    let operator;
    switch (this.operatorData) {
      case 'AWCC':
        operator = 'AWCC_TOPUP';
        break;
      case 'SALAM':
        operator = 'SALAAM_TOPUP';
        break;
      case 'MTN':
        operator = 'MTN_TOPUP';
        break;
      case 'ROSHAN':
        operator = 'ROSHAN_TOPUP';
        break;
      case 'ETISALAT':
        operator = 'ETISALAT_TOPUP';
        break;
      default:
        operator = 'UNKNOWN';
        break;
    }
    this.dataSharing.setOperatorData(operator);
  }

  // operator() {
  //   const PAY_ROLL = 'PAY_ROLL';
  //   const CASH_IN = 'CASH_IN';
  //   const CASH_OUT = 'CASH_OUT';
  //   const RECHARGE_TOPUP = 'RECHARGE_TOPUP';
  //   const AWCC = 'AWCC_TOPUP';
  //   const SALAM = 'SALAAM_TOPUP';
  //   const MTN = 'MTN_TOPUP';
  //   const ROSHAN = 'ROSHAN_TOPUP';
  //   const ETISALATH = 'ETISALAT_TOPUP';
  //   const WALLET_TO_WALLET = 'WALLET_TO_WALLET';
  //   const APS_TO_APS = 'APS_TO_APS';
  //   const SCAN_QR = 'SCAN_QR';
  //   const BRESHNA_SERVICE = 'BRESHNA_SERVICE';
  //   const BRESHNA_PAYMENT = 'BRESHNA_PAYMENT';
  //   const APS_PULL_MONEY = 'PULL_MONEY';
  //   const APS_PUSH_MONEY = 'PUSH_MONEY';
  //   const AUB_PULL_MONEY = 'PULL_MONEY';
  //   const AUB_PUSH_MONEY = 'PUSH_MONEY';
  // }
}
