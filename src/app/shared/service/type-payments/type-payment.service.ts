import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class TypePaymentService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  getAllTypePayment(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/type-payment/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }
  getTypePayment() {
    return this.http.get(`${this.baseUrl}/type-payment`, {
      headers: this.headers,
    });
  }
  getTypePaymentById(id: number) {
    return this.http.get(`${this.baseUrl}/type-payment/${id}`, {
      headers: this.headers,
    });
  }
  postTypePayment(unit: any) {
    return this.http.post(`${this.baseUrl}/type-payment`, unit, {
      headers: this.headers,
    });
  }
  putTypePayment(id: number, unit: any) {
    return this.http.put(`${this.baseUrl}/type-payment/${id}`, unit, {
      headers: this.headers,
    });
  }
  deleteTypePayment(id: number) {
    return this.http.delete(`${this.baseUrl}/type-payment/${id}`, {
      headers: this.headers,
    });
  }
}
