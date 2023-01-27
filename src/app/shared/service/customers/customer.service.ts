import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  getAllCustomer(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/customers/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }
  getallCustomer(search: string, type: string) {
    return this.http.get(`${this.baseUrl}/customers?search=${search}&type=${type}`, {
      headers: this.headers,
    });
  }

  getCustomerById(id: number) {
    return this.http.get(`${this.baseUrl}/customers/${id}`, {
      headers: this.headers,
    });
  }
  createCustomer(data: any) {
    return this.http.post(`${this.baseUrl}/customers`, data, {
      headers: this.headers,
    });
  }
  updateCustomer(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/customers/${id}`, data, {
      headers: this.headers,
    });
  }
  deleteCustomer(id: number) {
    return this.http.delete(`${this.baseUrl}/customers/${id}`, {
      headers: this.headers,
    });
  }
}
