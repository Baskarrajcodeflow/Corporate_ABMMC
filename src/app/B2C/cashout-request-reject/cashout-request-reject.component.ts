import { Component, OnInit } from '@angular/core';
import { ApiService } from '../ApiService/api.service';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CashoutRequestsComponent } from './cashout-requests/cashout-requests.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cashout-request-reject',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './cashout-request-reject.component.html',
  styleUrl: './cashout-request-reject.component.scss',
})
export class CashoutRequestRejectComponent implements OnInit {
  reqData: any;
  customerId: any;
  constructor(private apiService: ApiService, private dialog: MatDialog) {}
  ngOnInit(): void {
    this.customerId = sessionStorage.getItem('SenderUserId');

    this.getRequestsData(this.customerId);
  }

  getRequestsData(customerId: any) {
    this.apiService.findWithdrawal(customerId).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode == 200) this.reqData = res?.data;
      },
    });
  }

  onClickView(row: any) {
    let dialogRef = this.dialog
      .open(CashoutRequestsComponent, {
        width: '400px',
        panelClass: 'custom-dialog-container',
        data: row,
        // disableClose:true
      })
      .afterClosed()
      .subscribe((res) => {
        this.getRequestsData(this.customerId);
      });
  }

  rejectData(item: any) {
    this.apiService.payRequstedBillForAgent(item?.id,false,'').subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode == 200) {
          alert('Request Rejected Successfully');
        } else {
          alert(res?.error);
        }
      },
      error: () => {
        alert('Error Try Again!!!');
      },
    });
  }
}
