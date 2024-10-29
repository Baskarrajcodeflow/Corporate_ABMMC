// src/app/corp-chooser/corp-chooser.component.ts
import { Component, EventEmitter, Output } from "@angular/core";
import { CorpChooserService } from "./corp-chooser.service";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgIf, NgFor, CommonModule } from "@angular/common";
import { FormControl, FormsModule } from "@angular/forms";
import { Corp } from "./corp-chooser.model";
import { LoaderComponent } from "../../../loader/loader.component";
import { DataSharingService } from "../../../dataSharing/data-sharing.service";
import { ApiService } from "../../../ApiService/api.service";
import { CsvUploadComponent } from "../csv-upload/csv-upload.component";
@Component({
  standalone: true,
  imports: [FormsModule, DragDropModule, NgIf, NgFor, CommonModule,
    LoaderComponent, CsvUploadComponent],
  selector: "app-corp-chooser",
  templateUrl: "./corp-chooser.component.html",
})
export class CorpChooserComponent {
  @Output() corporateSelected = new EventEmitter<Corp>();
  corporates: any[] = [];
  accountNumber: string = "";
  corporateName: string = "";
  allcorpData: any;
  filteredData: any;
  userPrivileges: any;
  SalaryPrivelege: any;
  corpData: any;
  isLoading:boolean = false
  constructor(
    private dattaSharing: DataSharingService,
    private apiService: ApiService
  ) {

  }
  cities: any[] = [];
  ngOnInit(): void {
    this.getAuthCorpData()
    this.dattaSharing.setFlagForNewUpload$.subscribe((res) => {
      console.log(res);

      if (res == false) {
        this.accountNumber = "";
        this.corporateName = "";
        this.corporates = [];
        
      }
    });
    this.dattaSharing.setFlagData$.subscribe((res) => {
      console.log(res,'none');

      if (res == false) {
        this.corpData = false
        this.selectedCity = null
        console.log(this.cities, 'cities after clearing selection');
      }
    });

  }
  getAuthCorpData(){
    // this.isLoading = true
    // this.apiService.getAuthorizedCorporate().subscribe({
    //   next: (res) => {
    // this.isLoading = false
    //     this.allcorpData = res;
    //     this.cities = res.map((user: any) => ({
    //       id: user.id,
    //       name: `${user.firstName} ${user.lastName} / ${user?.walletAccount?.accountNo}`,
    //       accountNumber: user.walletAccount?.accountNo,
    //       email: user?.email,
    //       firstName: user?.firstName,
    //       lastName: user?.lastName,
    //       phone: user?.phone,
    //       walletStatus: user?.walletAccount?.walletStatus,
    //       createdOn:user?.createdOn,
    //       gender:user?.gender,
    //       corpType:user?.corpType
    //     }));
    //     console.log(this.cities, 'cities');
    //   },error:()=>{
    // this.isLoading = false
    //   }
    // });
  }
  searchByAccountNumber() {
    if (this.accountNumber.length == 0) {
      this.corporates = [];
    }
    if (this.accountNumber) {
      this.filteredData = this.allcorpData.filter((data: any) =>
        data.walletAccount.accountNo.includes(this.accountNumber)
      );
      console.log(this.filteredData);
      this.corporates = this.filteredData;
    }
  }

  searchByName() {
    if (this.corporateName.length == 0) {
      this.corporates = [];
    }
    if (this.corporateName) {
      this.filteredData = this.allcorpData.filter((data: any) =>
        data.firstName.toLowerCase().includes(this.corporateName.toLowerCase())
      );
      this.corporates = this.filteredData;

      console.log(this.filteredData);
    }
  }

  selectCorporate(corporate: any) {
    console.log("Selected corporate:", corporate);
    this.corporateSelected.emit(corporate);

    this.dattaSharing.salaryProcessingIdData(corporate);
  this.selectedCorporate = corporate;

  }

  selectedCorporate: any = null;
  customSearchFn(term: string, item: any) {
    console.log(term, item);
    item.name = item.name.replace(',', '');
    term = term.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) || 
      item.accountNumber?.toLowerCase().includes(term) 
    );
  }
  selectedCity: any;
  onCityChange(selectedCityId: any) {
    console.log(selectedCityId);
    this.corpData = selectedCityId
    this.corporateSelected.emit(selectedCityId);
    this.dattaSharing.salaryProcessingIdData(selectedCityId);

  }
  

}
