import { inject } from '@angular/core';
import { CustomerComponent } from './modules/customer/customer.component';
import { CustomerService } from './modules/customer/customer.service';
import { LoanComponent } from './modules/loan/loan.component';
import { Routes } from '@angular/router';
import { CurrencyService } from 'util/external/currency.service';
import { LoanService } from './modules/loan/loan.service';

export const routes: Routes = [
    { 
        path: 'customer', 
        component: CustomerComponent,
        resolve: {
            _: () => inject(CustomerService).getCustomerList()
        } 
    },
    { 
        path: 'loan', 
        component: LoanComponent,
        resolve: {
            _: () => inject(LoanService).getLoanList(),
            customers: () => inject(CustomerService).getCustomerList(),
            currencies: () => inject(CurrencyService).getCurrencyFromBC()
        } 
    },
    { path: '', redirectTo: '/customer', pathMatch: 'full' }
];
