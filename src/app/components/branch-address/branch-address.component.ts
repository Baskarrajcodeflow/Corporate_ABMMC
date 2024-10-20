import { Component } from '@angular/core';
import branchList from '../../../assets/data-json/branchList.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-branch-address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branch-address.component.html',
  styleUrl: './branch-address.component.scss'
})
export class BranchAddressComponent {
openMap(arg0: any,arg1: any) {
throw new Error('Method not implemented.');
}
sendEmail(arg0: any) {
throw new Error('Method not implemented.');
}
copyPhoneNumber(arg0: any) {
throw new Error('Method not implemented.');
}
  branch_list : any[] = [];

  ngOnInit(){
    this.branch_list = branchList;
    console.log(this.branch_list);

  }


}
