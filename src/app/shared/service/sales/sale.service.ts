import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Sale } from "../../models/sale";

@Injectable({
  providedIn: "root",
})
export class SaleService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  postSale(sale: Sale) {
    return this.http.post(`${this.baseUrl}/sales`, sale, {
      headers: this.headers,
    });
  }
  getAllSale(page: number, limit: number, search: string, dateStart: string, dateEnd: string) {
    return this.http.get(
      `${this.baseUrl}/sales/fullpage?page=${page}&limit=${limit}&search=${search}&dateStart=${dateStart}&dateEnd=${dateEnd}`,
      {
        headers: this.headers,
      }
    );
  }
  getSale(id: number) {
    return this.http.get(`${this.baseUrl}/sales/${id}`, {
      headers: this.headers,
    });
  }
}
