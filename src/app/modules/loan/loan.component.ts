import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute } from '@angular/router';
import { LoanService } from './loan.service';
import { Customer } from 'util/interfaces/customer';
import { LoanResponse } from 'util/interfaces/loan';
import { Currency } from 'util/interfaces/currrency';

@Component({
  selector: 'app-loan',
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
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
		MatSelectModule,
		MatOptionModule,
  ],
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.scss'
})
export class LoanComponent implements OnInit, OnDestroy {
  loans$: Observable<LoanResponse[]>;
  loanDuration: number = 0;
  valor_convertido: number = 0;

  tmpCurrency: Currency;

  customers: Customer[];
  currencies: Currency[];
  
  public form: FormGroup = new FormGroup([]);
  public inAction: boolean = false;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private fb: FormBuilder, private _service: LoanService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.customers = data['customers']['data'];
      this.currencies = data['currencies']['body']['value'];
    });

    this.form = this.fb.group({
      id: [null],
      data_emprestimo: [null, [Validators.required]],
      data_vencimento: [null, [Validators.required]],
      moeda: [null, [Validators.required]],
      valor_obtido: [null, [Validators.required]],
      valor_convertido: [{ value: null, disabled: true }],
      valor_final: [null, [Validators.required]],
      customer_id: [null, [Validators.required]],
    })

    this.loans$ = this._service.loans$;
    this.loans$.pipe(takeUntil(this._unsubscribeAll)).subscribe();

    this.form.valueChanges.subscribe(res => {
      this.calcularValorFinalEmprestimo();
    })

    this.form.get('data_emprestimo').valueChanges.subscribe(newValue => {
      this.loanDuration = this.calculateMonthsDifference(newValue, this.form.value['data_vencimento']);
    });

    this.form.get('data_vencimento').valueChanges.subscribe(newValue => {
      this.loanDuration = this.calculateMonthsDifference(this.form.value['data_emprestimo'], newValue);
    });
  }

  updateLoanCurrency(e: any) {
    this.tmpCurrency = e.value;
    this.form.patchValue({ moeda: this.tmpCurrency.simbolo });
  }

  calculateMonthsDifference(start_date: string, final_date: string) {
    if (!start_date || !final_date) return;

    const start = new Date(start_date);
    const end = new Date(final_date);

    const yearDifference = end.getFullYear() - start.getFullYear();
    const monthDifference = end.getMonth() - start.getMonth();

    const totalMonths = (yearDifference * 12) + monthDifference;
    
    return Math.abs(totalMonths);
  }

  calcularValorFinalEmprestimo() {
    if (this.valor_convertido > 0 && this.loanDuration > 0) { 
      console.log('passou')
      const taxaMensal = 0.01;
      const valorFinal = this.valor_convertido * Math.pow(1 + taxaMensal, this.loanDuration);
      this.form.get("valor_final").setValue(parseFloat(valorFinal.toFixed(2)));
    }
  }

  convertCurrency() {
    this.valor_convertido = this.form.get("valor_obtido").value
    this.calcularValorFinalEmprestimo();
  }

  /** 
  Exemplo de cálculo da cotação das moedas tipo A em unidade monetária corrente, considerando o real (BRL) como unidade monetária corrente e o dólar canadense (CAD) como moeda estrangeira:

  Cotação de Compra CADBRL = Cotação USDBRL de Compra ÷ Paridade USDCAD de Venda
  Cotação de Venda CADBRL = Cotação USDBRL de Venda ÷ Paridade USDCAD de Compra

  Exemplo de cálculo da cotação das moedas tipo B em unidade monetária corrente, considerando o real (BRL) como unidade monetária corrente e o euro (EUR) como moeda estrangeira:

  Cotação de Compra EURBRL = Paridade EURUSD de Compra × Cotação USDBRL de Compra
  Cotação de Venda EURBRL = Paridade EURUSD de Venda × Cotação USDBRL de Venda
  */

  registerLoan() {
    this._service.registerLoan({
      ...this.form.value, 
      data_emprestimo: new Date(this.form.value['data_emprestimo']),
      data_vencimento: new Date(this.form.value['data_vencimento'])
    }).pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }

  deleteLoan(loan: LoanResponse) {
    this._service.deleteLoan(loan.id).pipe(takeUntil(this._unsubscribeAll)).subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
  }
}
