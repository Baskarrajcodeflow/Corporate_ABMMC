import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { LoaderComponent } from '../../../../loader/loader.component';
import { SalaryUploadedDetailsComponent } from '../Dialog-components/salary-uploaded-details/salary-uploaded-details.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../ApiService/api.service';
import { DataSharingService } from '../../../../dataSharing/data-sharing.service';

@Component({
  selector: 'app-sheduled-table',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatTooltip,MatButtonModule,LoaderComponent],
  templateUrl: './sheduled-table.component.html',
  styleUrl: './sheduled-table.component.css'
})
export class SheduledTableComponent {
  bulkSalaryData:any
  isLoading: boolean = false;
  basrUserId: any;

  constructor(private apiService:ApiService,private data:DataSharingService,private dialog:MatDialog){
    this.data.reuploadFileData(false)
  }
  ngOnInit(): void {
    this.basrUserId = sessionStorage.getItem('basrUserId')


    this.isLoading = true
   this.apiService.getAllUploadedFiles(this.basrUserId).subscribe({
    next:(res:any)=>{
    if(res?.responseCode == 200){
      const sortedData = res?.data.sort((a:any, b:any) => {
        return new Date(b.uploadedTime).getTime() - new Date(a.uploadedTime).getTime();
      });
      this.bulkSalaryData = sortedData
    this.isLoading = false
    }else{
      alert(res?.error)
    this.isLoading = false
    }
    },error:()=>{
    this.isLoading = false
      alert('Error While Fetching Data')
    }
   })
    
  }

  nextpage(item:any,id:any){
    let dialogRef = this.dialog
    .open(SalaryUploadedDetailsComponent, {
      width: '900px',
      height: '500px',
      data:{item,id},
      panelClass: 'custom-dialog-container',
      disableClose:true
    })
    .afterClosed()
    .subscribe((res:any) => {
      console.log(res);
    if(res == undefined){
    }  
    
    });
  }
}
