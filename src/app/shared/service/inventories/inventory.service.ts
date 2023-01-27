import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InventoryService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  getAllMovement(page: number, limit: number, search: string, dateStart: string, dateEnd: string) {
    return this.http.get(
      `${this.baseUrl}/movement/fullpage?page=${page}&limit=${limit}&search=${search}&dateStart=${dateStart}&dateEnd=${dateEnd}`,
      {
        headers: this.headers,
      }
    );
  }
  getMovement() {
    return this.http.get(`${this.baseUrl}/movement`, {
      headers: this.headers,
    });
  }
  getMovementById(id: number) {
    return this.http.get(`${this.baseUrl}/movement/${id}`, {
      headers: this.headers,
    });
  }
  postMovement(movement: any) {
    return this.http.post(`${this.baseUrl}/movement`, movement, {
      headers: this.headers,
    });
  }
  putMovement(id: number, movement: any) {
    return this.http.put(`${this.baseUrl}/movement/${id}`, movement, {
      headers: this.headers,
    });
  }
  deleteMovement(id: number) {
    return this.http.delete(`${this.baseUrl}/movement/${id}`, {
      headers: this.headers,
    });
  }

  getAllStock(page: number, limit: number, search: string) {
    return this.http.get(
      `${this.baseUrl}/products/StockByWarehouse?page=${page}&limit=${limit}&search=${search}`,
      {
        headers: this.headers,
      }
    );
  }
}
