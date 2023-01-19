import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }
  getAllCustomer(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/customers/fullpage?page=${page}&limit=${limit}&search=${search}`);
  }
  getallCustomer(search: string, type: string) {
    return this.http.get(`${this.baseUrl}/customers?search=${search}&type=${type}`);
  }

  getCustomerById(id: number) {
    return this.http.get(`${this.baseUrl}/customers/${id}`);
  }
  createCustomer(data: any) {
    return this.http.post(`${this.baseUrl}/customers`, data);
  }
  updateCustomer(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/customers/${id}`, data);
  }
  deleteCustomer(id: number) {
    return this.http.delete(`${this.baseUrl}/customers/${id}`);
  }
}
