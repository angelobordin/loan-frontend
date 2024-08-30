import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap, take, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "util/interfaces/api-response";
import { LoanForm, LoanResponse } from "util/interfaces/loan";
import { ROUTE_LOAN_DELETE, ROUTE_LOAN_LIST, ROUTE_LOAN_REGISTER, ROUTE_LOAN_UPDATE } from "util/routes/loan.routes";

@Injectable({ providedIn: "root" })
export class LoanService {
	private readonly bcBaseApiURL = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata';
	private _loans: BehaviorSubject<LoanResponse[]> = new BehaviorSubject(null);

	constructor(private _httpClient: HttpClient) {}

	get loans$(): Observable<LoanResponse[]> {
		return this._loans.asObservable();
	}

	getLoanList(): Observable<ApiResponse<LoanResponse[]>> {
		return this._httpClient.get<ApiResponse<LoanResponse[]>>(ROUTE_LOAN_LIST()).pipe(
			tap((response) => {
				this._loans.next(response.data);
				return response;
			})
		);
	}

	registerLoan(loan: LoanForm): Observable<ApiResponse<LoanResponse>> {
		return this.loans$.pipe(
			take(1),
			switchMap((loans) =>
				this._httpClient.post<ApiResponse<LoanResponse>>(ROUTE_LOAN_REGISTER(), loan).pipe(
					map((response) => {
						this._loans.next([
							...loans, response.data
						]);

						return response;
					})
				)
			)
		);
	}

	updateLoan(loan: LoanForm): Observable<ApiResponse<LoanResponse>> {
		return this.loans$.pipe(
			take(1),
			switchMap((loans) =>
				this._httpClient.patch<ApiResponse<LoanResponse>>(ROUTE_LOAN_UPDATE(loan.id), loan).pipe(
					map((response) => {
						const index = loans.findIndex((c: LoanResponse) => c.id === loan.id);

						loans[index] = response.data;
						this._loans.next(loans);

						return response;
					})
				)
			)
		);
	}

	deleteLoan(loan_id: number): Observable<ApiResponse<any>> {
		return this.loans$.pipe(
			take(1),
			switchMap((loans) =>
				this._httpClient.delete<ApiResponse<any>>(ROUTE_LOAN_DELETE(loan_id)).pipe(
					map((result) => {
						const index = loans.findIndex((C: LoanResponse) => C.id === loan_id);

						loans.splice(index, 1);
						this._loans.next(loans);

						return result;
					})
				)
			)
		);
	}

	public async getCotacaoCompra() {
		const url = `${this.bcBaseApiURL}/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='USD'&@dataCotacao='08-29-2024'&$top=1&$orderby=dataHoraCotacao desc&$format=json&$select=cotacaoCompra`;
	
		return this._httpClient.get<{ value: { cotacaoCompra: number }[] }>(url).pipe(
			map((response) => {
					return response.value[0].cotacaoCompra;
			})
		);
	}
}