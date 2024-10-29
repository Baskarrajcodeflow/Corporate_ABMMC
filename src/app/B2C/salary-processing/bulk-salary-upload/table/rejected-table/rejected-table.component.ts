import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { LoaderComponent } from "../../../../loader/loader.component";
import { ApiService } from '../../../../ApiService/api.service';
import { DataSharingService } from '../../../../dataSharing/data-sharing.service';

@Component({
  selector: 'app-rejected-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltip, MatButtonModule, LoaderComponent],
  templateUrl: './rejected-table.component.html',
  styleUrl: './rejected-table.component.css'
})
export class RejectedTableComponent {
  bulkSalaryData:any
  isLoading: boolean = false;
  basrUserId: any;

  constructor(private apiService:ApiService,
    data:DataSharingService
  ){
    data.reuploadFileData(false)
  }
  ngOnInit(): void {
    this.basrUserId = sessionStorage.getItem('basrUserId')

    this.isLoading = true
   this.apiService.getAllUploadedFiles(this.basrUserId).subscribe({
    next:(res:any)=>{
    if(res?.responseCode == 200){
    this.isLoading = false
    const sortedData = res?.data.sort((a:any, b:any) => {
      return new Date(b.uploadedTime).getTime() - new Date(a.uploadedTime).getTime();
    });
    this.bulkSalaryData = sortedData
    }else{
    this.isLoading = false
      alert(res?.error)
    }
    },error:()=>{
    this.isLoading = false
      alert('Error While Fetching Data')
    }
   })
    
  }
}
