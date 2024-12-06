import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ModuleMeta } from "../../interface/interface-list";

@Injectable({
  providedIn: "root",
})
export class DataSharingService {
  constructor() {}

  private operatorSubject = new BehaviorSubject<any>(null);
  operator$ = this.operatorSubject.asObservable();

  setOperatorData(operator: any) {
    this.operatorSubject.next(operator);
  }

  private headerSubject = new BehaviorSubject<any>(null);
  headerOperator$ = this.headerSubject.asObservable();

  setHeaderSubjectData(operator: any) {
    this.headerSubject.next(operator);
  }

  private setIdSubject = new BehaviorSubject<any>(null);
  setIdOperator$ = this.setIdSubject.asObservable();

  setIdSubjectData(operator: any) {
    this.setIdSubject.next(operator);
  }

  
  private setIdSubjectArray = new BehaviorSubject<any>(null);
  setOperator$ = this.setIdSubjectArray.asObservable();

  setSubjectData(modules: ModuleMeta[]) {
    console.log(modules);
    this.setIdSubjectArray.next(modules);
  }

  
  private setEmptyArray = new BehaviorSubject<any>(null);
  emptyArray$ = this.setEmptyArray.asObservable();

  emptyArray(modules:boolean) {
    console.log(modules);
    this.setEmptyArray.next(modules);
  }

  private setModuleName = new BehaviorSubject<any>(null);
  setModuleNameData$ = this.setModuleName.asObservable();

  setModuleNameData(modules:any) {
    console.log(modules);
    this.setModuleName.next(modules);
  }

  private setComponentName = new BehaviorSubject<any>(null);
  setComponentNameData$ = this.setComponentName.asObservable();

  setComponentNameData(Components:any) {
    console.log(Components);
    this.setComponentName.next(Components);
  }

  private kyc = new BehaviorSubject<any>(null);
  kycData$ = this.kyc.asObservable();

  kycData(Components:any) {
    this.kyc.next(Components);
  }

  private salaryProcessingId = new BehaviorSubject<any>(null);
  salaryProcessingIdData$ = this.salaryProcessingId.asObservable();

  salaryProcessingIdData(Components:any) {
    this.salaryProcessingId.next(Components);
  }

  private setFlag = new BehaviorSubject<boolean>(false);
  setFlagData$ = this.setFlag.asObservable();

  setFlagData(Components:any) {
    this.setFlag.next(Components);
  }

  private reuploadFile = new BehaviorSubject<boolean>(false);
  reuploadFileData$ = this.reuploadFile.asObservable();

  reuploadFileData(Components:any) {
    this.reuploadFile.next(Components);
  }

  private setFlagForNewUpload = new BehaviorSubject<boolean>(false);
  setFlagForNewUpload$ = this.setFlag.asObservable();

  setFlagForNewUploadData(Components:any) {
    this.setFlagForNewUpload.next(Components);
  }

  private apiCallSource = new BehaviorSubject<boolean>(false); // Default value
  setApiCall$ = this.apiCallSource.asObservable();

  setApiCallData(status: boolean) {
    this.apiCallSource.next(status);
  }

  private corpKyc = new BehaviorSubject<boolean>(false); // Default value
  corpKyc$ = this.corpKyc.asObservable();

  corpKycData(status: boolean) {
    this.corpKyc.next(status);
  }

  
  private kyclevel = new BehaviorSubject<any>(null);
  kyclevel$ = this.kyclevel.asObservable();

  setkyclevelData(currency: any) {
    this.kyclevel.next(currency);
  }

    
  private profilepic = new BehaviorSubject<any>(null);
  profilepic$ = this.profilepic.asObservable();

  setprofilepicData(currency: any) {
    this.profilepic.next(currency);
  }
}
