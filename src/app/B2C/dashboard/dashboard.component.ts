import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OurServicesComponent } from '../Our-Services/our-services.component';
import { BulkSalaryProcessComponent } from '../bulk-salary-process/bulk-salary-process.component';
import { SharedService } from '../../services/shared.service';
import { DatasharingService } from '../../services/datasharing.service';
import { CommonModule } from '@angular/common';
import { TransactionHistoryComponent } from "../transaction-history/transaction-history.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [OurServicesComponent, RouterOutlet, BulkSalaryProcessComponent, CommonModule, TransactionHistoryComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  totalAFN: any;
  profileData: any;
  constructor(private router : Router,
    private data:DatasharingService,private sharedService:SharedService
  ){
  }



  ngOnInit(){
    this.data.currency$.subscribe({
      next:(res)=>{
        this.totalAFN = Math.round(res)
      },error:()=>{
        this.totalAFN = null
      }
    })

    this.sharedService.loginDeatails$.subscribe((res)=>{
      this.profileData = res
    })
  }

  gotoProductPage(product : string){
    this.router.navigate(['/product', product], );
  }

  gotoBranchAddress(){
    this.router.navigate(['/branches']);
  }

  ngOnDestroy(){

  }

}
