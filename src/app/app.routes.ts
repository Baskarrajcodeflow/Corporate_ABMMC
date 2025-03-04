import { Routes } from '@angular/router';
import { DashboardComponent } from './B2C/dashboard/dashboard.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { HomeComponent } from './B2C/home/home.component';
import { CustomerKycComponent } from './components/customer-kyc/customer-kyc.component';
import { MoneyTransferComponent } from './B2C/money-transfer-wallet/money-transfer/money-transfer.component';
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
import { AirtimeTopUpReportsComponent } from './B2C/report-management/airtime-top-up-reports/airtime-top-up-reports.component';
import { ListMoneytransferRequestsComponent } from './B2C/money-transfer-wallet/list-moneytransfer-requests/list-moneytransfer-requests.component';
import { GetBreshnaListComponent } from './B2C/breshna-payments/getbreshna-requests/get-breshna-list/get-breshna-list.component';
import { BreshnaDashboardComponent } from './B2C/breshna-payments/getbreshna-requests/breshna-dashboard/breshna-dashboard.component';
import { TopUpRechargeComponent } from './B2C/top-up-recharge/top-up-recharge/top-up-recharge.component';
import { TopUpRechargeDashboardComponent } from './B2C/top-up-recharge/top-up-recharge-dashboard/top-up-recharge-dashboard.component';
import { AuthGuard } from './services/auth-guard.service';

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
  { path: 'createUser', component: CreateUserComponent, canActivate: [AuthGuard] },
  { path: 'AgentKyc', component: CustomerKycComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignupComponent },
  { path: 'moneyTransfer', component: MoneyTransferComponent, canActivate: [AuthGuard] },
  { path: 'listRequests', component: ListMoneytransferRequestsComponent, canActivate: [AuthGuard] },
  { path: 'breshnaPay', component: BreshnaPaymentsComponent , canActivate: [AuthGuard]},
  { path: 'cashoutRequests', component: CashoutRequestRejectComponent, canActivate: [AuthGuard] },
  { path: 'bulkCustomerUpload', component: BulkSalaryProcessComponent, canActivate: [AuthGuard] },
  { path: 'bulkSalaryProcess', component: BulkCustomerUploadComponent, canActivate: [AuthGuard] },
  { path: 'corpsUser', component: CorporateUsersListComponent , canActivate: [AuthGuard]},
  { path: 'pushpull', component: PushPullMoneyComponent , canActivate: [AuthGuard]},
  { path: 'tranactionHistory', component: TransactionHistoryComponent, canActivate: [AuthGuard] },
  { path: 'bulkSalaryProcessNew', component: SalaryDashboardComponent , canActivate: [AuthGuard]},
  { path: 'corporateRegister', component: RegisterCorporateComponent, canActivate: [AuthGuard] },
  { path: 'corpKyc', component: CorporateRegistartionComponent, canActivate: [AuthGuard] },
  { path: 'accountStatement', component: AccountStatementComponent , canActivate: [AuthGuard]},
  { path: 'airTime', component: AirtimeTopUpReportsComponent , canActivate: [AuthGuard]},
  { path: 'listBreshna', component: BreshnaDashboardComponent, canActivate: [AuthGuard] },
  { path: 'topup', component: TopUpRechargeDashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent, canActivate: [AuthGuard]
  },
 
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // default route
];
