import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InventoryService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }
  getAllMovement(page: number, limit: number, search: string, dateStart: string, dateEnd: string) {
    return this.http.get(
      `${this.baseUrl}/movement/fullpage?page=${page}&limit=${limit}&search=${search}&dateStart=${dateStart}&dateEnd=${dateEnd}`
    );
  }
  getMovement() {
    return this.http.get(`${this.baseUrl}/movement`);
  }
  getMovementById(id: number) {
    return this.http.get(`${this.baseUrl}/movement/${id}`);
  }
  postMovement(movement: any) {
    return this.http.post(`${this.baseUrl}/movement`, movement);
  }
  putMovement(id: number, movement: any) {
    return this.http.put(`${this.baseUrl}/movement/${id}`, movement);
  }
  deleteMovement(id: number) {
    return this.http.delete(`${this.baseUrl}/movement/${id}`);
  }

  getAllStock(page: number, limit: number, search: string) {
    return this.http.get(
      `${this.baseUrl}/products/StockByWarehouse?page=${page}&limit=${limit}&search=${search}`
    );
  }
}
