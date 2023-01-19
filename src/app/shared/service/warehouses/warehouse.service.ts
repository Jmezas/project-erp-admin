import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class WarehouseService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }
  getAllWarehouse(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/warehouse/fullpage?page=${page}&limit=${limit}&search=${search}`);
  }
  getWarehouse() {
    return this.http.get(`${this.baseUrl}/warehouse`);
  }
  getWarehouseById(id: number) {
    return this.http.get(`${this.baseUrl}/warehouse/${id}`);
  }
  postWarehouse(warehouse: any) {
    return this.http.post(`${this.baseUrl}/warehouse`, warehouse);
  }
  putWarehouse(id: number, warehouse: any) {
    return this.http.put(`${this.baseUrl}/warehouse/${id}`, warehouse);
  }

  deleteWarehouse(id: number) {
    return this.http.delete(`${this.baseUrl}/warehouse/${id}`);
  }
}
