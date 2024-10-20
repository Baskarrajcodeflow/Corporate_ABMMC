import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../ApiService/api.service';

@Component({
  selector: 'app-corporate-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './corporate-users-list.component.html',
  styleUrl: './corporate-users-list.component.scss'
})
export class CorporateUsersListComponent {
  wallets:any
  constructor(private apiService:ApiService){ }

  ngOnInit(): void {
    this.apiService.getCorpUsers().subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res?.responseCode == 200){
          this.wallets = res?.data
        }
      },error:()=>{
        alert('Something Went Wrong!!!')
      }
     })
  }
}
