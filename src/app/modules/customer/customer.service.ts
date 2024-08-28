import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap, take, tap } from "rxjs";
import { Customer } from "../../../util/interfaces/customer";
import { HttpClient } from "@angular/common/http";
import { ROUTE_CUSTOMER_DELETE, ROUTE_CUSTOMER_LIST, ROUTE_CUSTOMER_REGISTER, ROUTE_CUSTOMER_UPDATE } from "util/routes/customer.routes";
import { ApiResponse } from "util/interfaces/api-response";

@Injectable({ providedIn: "root" })
export class CustomerService {
	private _customers: BehaviorSubject<Customer[]> = new BehaviorSubject(null);

	constructor(private _httpClient: HttpClient) {}

	get customers$(): Observable<Customer[]> {
		return this._customers.asObservable();
	}

	getCustomerList(): Observable<ApiResponse<Customer[]>> {
		return this._httpClient.get<ApiResponse<Customer[]>>(ROUTE_CUSTOMER_LIST()).pipe(
			tap((response) => {
				this._customers.next(response.data);
				return response;
			})
		);
	}

	registerCustomer(customer: Customer): Observable<ApiResponse<Customer>> {
		return this.customers$.pipe(
			take(1),
			switchMap((customers) =>
				this._httpClient.post<ApiResponse<Customer>>(ROUTE_CUSTOMER_REGISTER(), customer).pipe(
					map((response) => {
						this._customers.next([
							...customers, response.data
						]);

						return response;
					})
				)
			)
		);
	}

	updateCustomer(customer: Customer): Observable<ApiResponse<Customer>> {
		return this.customers$.pipe(
			take(1),
			switchMap((customers) =>
				this._httpClient.patch<ApiResponse<Customer>>(ROUTE_CUSTOMER_UPDATE(customer.id), customer).pipe(
					map((response) => {
						const index = customers.findIndex((c: Customer) => c.id === customer.id);

						customers[index] = response.data;
						this._customers.next(customers);

						return response;
					})
				)
			)
		);
	}

	deleteCustomer(customer_id: number): Observable<ApiResponse<any>> {
		return this.customers$.pipe(
			take(1),
			switchMap((customers) =>
				this._httpClient.delete<ApiResponse<any>>(ROUTE_CUSTOMER_DELETE(customer_id)).pipe(
					map((result) => {
						const index = customers.findIndex((C: Customer) => C.id === customer_id);

						customers.splice(index, 1);
						this._customers.next(customers);

						return result;
					})
				)
			)
		);
	}
}