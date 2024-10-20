import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionDialogComponent } from './Dialog/transaction-dialog/transaction-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../services/login.service';
import { DatasharingService } from '../../services/datasharing.service';
import { SharedService } from '../../services/shared.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss',
})
export class TransactionHistoryComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private loginService: LoginService,
    private dataSharing: DatasharingService,
    private sharedService: SharedService
  ) {}
  //----------------------------------------------------------------------------//
  nextPage: any = 0;
  responseLength!: boolean;
  isLoadingResults!: boolean;
  // previousPage: any = 0;
  tranactionHistory: any = [];
  ngOnInit(): void {
    this.getTranasctionHistory(this.nextPage);
  }
  openDialog(responseData: any) {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      data: {
        message: responseData,
      },
      maxWidth: '500px',
      width: '450px',
    });
  }

  //----------------------------------------------------------------------------//
  getTranasctionHistory(Page: any) {
    let operator: any;

    this.dataSharing.operator$.subscribe((res) => {
      operator = res;
    });
    let req = {
      accountNo: this.sharedService.walletNo,
      serviceName: operator,
      fromDate: '2024-06-01 00:00:00',
      toDate: '2024-06-26 23:59:59',
    };

    if (Page === 'nextPage') {
      this.isLoadingResults = true;
      this.loginService
        .getTranasctionHistory(req, ++this.nextPage)
        .subscribe((res) => {
          if (res?.code == 100) {
            this.isLoadingResults = false;
            console.log(res?.response);
            this.tranactionHistory = res?.response;
            if (res?.response.length < 5) {
              this.responseLength = true;
            } else {
              this.responseLength = false;
            }
          }
        });
    } else if (Page === 'previousPage') {
      this.isLoadingResults = true;
      this.loginService
        .getTranasctionHistory(req, --this.nextPage)
        .subscribe((res) => {
          if (res?.code == 100) {
            this.isLoadingResults = false;
            console.log(res?.response);
            this.tranactionHistory = res?.response;
          }
        });
    } else {
      this.loginService
        .getTranasctionHistory(req, this.nextPage)
        .subscribe((res) => {
          if (res?.code == 100) {
            console.log(res?.response);
            this.tranactionHistory = res?.response;
          }
        });
    }
  }
}
