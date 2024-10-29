import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MakerComponent } from "../workflow/maker/maker.component";
import { BulkSalaryProcessingComponent } from "../bulk-salary-processing/bulk-salary-processing.component";
import { DataSharingService } from '../../../dataSharing/data-sharing.service';
import { ProcessFilesTableComponent } from '../table/process-files-table/process-files-table.component';
import { RejectedTableComponent } from '../table/rejected-table/rejected-table.component';
import { SheduledTableComponent } from '../table/sheduled-table/sheduled-table.component';
import { TableComponent } from '../table/table.component';
import { CorpChooserComponent } from '../corp-chooser/corp-chooser.component';


@Component({
  selector: 'app-salary-dashboard',
  standalone: true,
  imports: [CommonModule,CorpChooserComponent, MakerComponent, BulkSalaryProcessingComponent, TableComponent, SheduledTableComponent, ProcessFilesTableComponent, RejectedTableComponent],
  templateUrl: './salary-dashboard.component.html',
  styleUrl: './salary-dashboard.component.css'
})
export class SalaryDashboardComponent {
  activeTab: number = 1;
  userPrivileges: any;
  SalaryPrivelege: any;
constructor(private data:DataSharingService){
  data.reuploadFileData(false)
 
}
makerCheckerRestriction: any;

  setActiveTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }

  ngOnInit(): void {

    this.makerCheckerRestriction = sessionStorage.getItem('Role');

if(this.makerCheckerRestriction == 'CHECKER'){
  this.setActiveTab(2)
}
  }
}
