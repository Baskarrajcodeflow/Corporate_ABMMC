import { Routes } from '@angular/router';
import { DashboardComponent } from './B2C/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard.service';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { HomeComponent } from './B2C/home/home.component';
import { CustomerKycComponent } from './components/customer-kyc/customer-kyc.component';
import { MoneyTransferComponent } from './B2C/money-transfer/money-transfer.component';
import { SignupComponent } from './components/signup/signup.component';
import { BulkSalaryProcessComponent } from './B2C/bulk-salary-process/bulk-salary-process.component';
import { BulkCustomerUploadComponent } from './B2C/bulk-customer-upload/bulk-customer-upload.component';
import { BreshnaPaymentsComponent } from './B2C/breshna-payments/breshna-payments.component';
import { CashoutRequestRejectComponent } from './B2C/cashout-request-reject/cashout-request-reject.component';
import { LoginComponent } from './B2C/login/login.component';
import { SystemwalletComponent } from './B2C/wallet-management/systemwallet/systemwallet.component';
import { PushPullMoneyComponent } from './B2C/wallet-management/push-pull-money/push-pull-money.component';
import { CorporateUsersListComponent } from './B2C/wallet-management/corporate-users-list/corporate-users-list.component';
import { TransactionHistoryComponent } from './B2C/transaction-history/transaction-history.component';
import { SalaryDashboardComponent } from './B2C/salary-processing/bulk-salary-upload/salary-dashboard/salary-dashboard.component';
import { RegisterCorporateComponent } from './B2C/corporate-register/register-corporate/register-corporate.component';
import { CorporateRegistartionComponent } from './B2C/corporate-register/corporate-registartion/corporate-registartion.component';
import { AccountStatementComponent } from './B2C/report-management/account-statement/account-statement.component';

// export const routes: Routes = [
//     {
//         path : 'registration', component : RegistrationFormComponent
//     },
//     {
//         path : 'product/:product', component : ProductComponent, canActivate : [AuthGuardService]
//     },
//     {
//         path : 'dashboard', component : DashboardComponent , canActivate : [AuthGuardService]
//     },
//     {
//         path : 'branches', component : BranchAddressComponent , canActivate : [AuthGuardService]
//     },
//     {
//         path : 'ourservices', component : OurServicesComponent , canActivate : [AuthGuardService]
//     },
//     {
//         path : 'transactionHistory', component : TransactionHistoryComponent , canActivate : [AuthGuardService]
//     }, {
//         path : 'createUser', component : CreateUserComponent
//     }
// ];
export const routes: Routes = [
  { path: 'createUser', component: CreateUserComponent },
  { path: 'AgentKyc', component: CustomerKycComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignupComponent },
  { path: 'moneyTransfer', component: MoneyTransferComponent },
  { path: 'breshnaPay', component: BreshnaPaymentsComponent },
  { path: 'cashoutRequests', component: CashoutRequestRejectComponent },
  { path: 'bulkCustomerUpload', component: BulkSalaryProcessComponent },
  { path: 'bulkSalaryProcess', component: BulkCustomerUploadComponent },
  { path: 'corpsUser', component: CorporateUsersListComponent },
  { path: 'pushpull', component: PushPullMoneyComponent },
  { path: 'tranactionHistory', component: TransactionHistoryComponent },
  { path: 'bulkSalaryProcessNew', component: SalaryDashboardComponent },
  { path: 'corporateRegister', component: RegisterCorporateComponent },
  { path: 'corpKyc', component: CorporateRegistartionComponent },
  { path: 'accountStatement', component: AccountStatementComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
 
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // default route
];
