import { Routes } from '@angular/router';
import { LoanComponent } from './loan/loan.component';
import { CustomerComponent } from './customer/customer.component';

export const routes: Routes = [
    { path: 'customer', component: CustomerComponent },
    { path: 'loan', component: LoanComponent },
    { path: '', redirectTo: '/customer', pathMatch: 'full' }
];
