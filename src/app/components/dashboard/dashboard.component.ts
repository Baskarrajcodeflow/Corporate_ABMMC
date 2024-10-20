import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OurServicesComponent } from '../Our-Services/our-services.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [OurServicesComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private router : Router){}

  ngOnInit(){

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
