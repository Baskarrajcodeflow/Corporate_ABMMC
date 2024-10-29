import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  userName: any;
  ngOnInit(): void {
    this.sharedService.loginDeatails$.subscribe((res:any)=>{
      if(res)
      this.userName = `${res?.firstName} ${res?.lastName}`
    })
  }
  
  constructor(private route: Router,
    private sharedService: SharedService
  ) {}
  navigate(nav: any) {
    this.route.navigateByUrl(nav);
  }

  isSubMenuOpen = false;
  isSubMenuOpenUser = false;
  bulkSalary = false;
  isSubMenuOpenUserkyc = false
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
}
