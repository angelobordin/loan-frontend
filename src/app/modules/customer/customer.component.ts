import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Observable, Subject, takeUntil } from 'rxjs';
import { validatorCpf } from '../../../util/validators/valida-cpf.validator';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';
import { Customer } from 'util/interfaces/customer';
import { CustomerService } from './customer.service';
import { MatIconModule } from "@angular/material/icon";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    AsyncPipe
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit, OnDestroy {
  customers$: Observable<Customer[]>;

  public form: FormGroup = new FormGroup([]);
  public inAction: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private fb: FormBuilder, private _service: CustomerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      cpf: [null, [Validators.required, validatorCpf]],
      name: [null, [Validators.required]],
    });

    this.customers$ = this._service.customers$;
    this.customers$.pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }

  registerCustomer() {
    this._service.registerCustomer(this.form.value).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.form.reset();
      this.toastr.success("Sucesso!", res.message, { timeOut: 3000 });
    });
  }

  saveCustomer() {
    this._service.updateCustomer(this.form.value).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.form.reset();
      this.toastr.success("Sucesso!", res.message, { timeOut: 3000 });
    });
  }

  editCustomer(customer: Customer) {
    this.form.patchValue({
      ...customer
    });
  }

  deleteCustomer(customer: Customer) {
    this._service.deleteCustomer(customer.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
      this.toastr.success("Sucesso!", res.message, { timeOut: 3000 });
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
