import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { DataSharingService } from '../dataSharing/data-sharing.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  userName: any;
  kyclevel:any
  constructor(private route: Router,
    private sharedService: SharedService,
    private dataSharing:DataSharingService
  ) {}
  ngOnInit(): void {
    this.dataSharing.kyclevel$.subscribe((res)=>{
      this.kyclevel = res
      console.log(this.kyclevel);
      
    })
    this.sharedService.loginDeatails$.subscribe((res:any)=>{
      if(res)
      this.userName = `${res?.firstName} ${res?.lastName}`
    })
  }
  
  navigate(nav: any) {
    this.route.navigateByUrl(nav);
  }

  isSubMenuOpen = false;
  isSubMenuOpenUser = false;
  bulkSalary = false;
  isSubMenuOpenUserkyc = false
  isAccountStatement = false
  toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }

  toggleSubMenuUser() {
    this.isSubMenuOpenUser = !this.isSubMenuOpenUser;
  }

  toggleBulkSalary() {
    this.bulkSalary = !this.bulkSalary;
  }

  toggleKyc() {
    this.isSubMenuOpenUserkyc = !this.isSubMenuOpenUserkyc;
  }

  accountStatement() {
    this.isAccountStatement = !this.isAccountStatement;
  }

}
