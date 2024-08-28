import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class CurrencyService {

	constructor(private _httpClient: HttpClient) {}

    getCurrencyFromBC() {
		const headers = new HttpHeaders().set("Accept", "application/json;odata.metadata=minimal");

		return this._httpClient.get<any>("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?%24format=json", { headers, observe: "response"}).pipe(
			tap((response) => {
				return response;
			})
		);
	}

}