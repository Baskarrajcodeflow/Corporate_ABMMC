import { Component } from '@angular/core';
import { FormComponent } from '../../ui-elements/form/form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-our-services',
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule, FormComponent,RouterModule],
  templateUrl: './our-services.component.html',
  styleUrl: './our-services.component.scss'
})
export class OurServicesComponent {
  constructor(private router : Router){}

  gotoProductPage(product : string){
    console.log(product);
    this.router.navigate(['/product', product], );
  }
  transactionHistory(){
    this.router.navigate(['/product/transactionHistory'], );
  }

  gotoBranchAddress(){
    this.router.navigate(['/branches']);
  }
}
