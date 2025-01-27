import { Component, Inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../../../loader/loader.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../ApiService/api.service';

@Component({
  selector: 'app-reject-reason-dialog',
  standalone: true,
  imports: [MatButton,MatButtonModule,FormsModule,LoaderComponent,CommonModule],
  templateUrl: './reject-reason-dialog.component.html',
  styleUrl: './reject-reason-dialog.component.css'
})
export class RejectReasonDialogComponent {
constructor(private dialog:MatDialogRef<RejectReasonDialogComponent>,
  private apiService:ApiService,
  @Inject(MAT_DIALOG_DATA) public data: any,

){
  console.log(data);
  
}
isLoading: boolean = false;
reason:any
close(){
this.dialog.close(true)
}

rejectUploadedFiles(){
  this.isLoading = true
  this.apiService.approveOrRejectUploadedFiles(this.data,false,this.reason).subscribe({
    next:(res:any)=>{
      if(res?.responseCode == 200){
  this.isLoading = false
        alert('File Rejected')
this.dialog.close()
      }else{
  this.isLoading = false
  alert(res?.error);
}
    },error:()=>{
  this.isLoading = false
      alert('Unable to Reject the File')
    }
  })
}
}
