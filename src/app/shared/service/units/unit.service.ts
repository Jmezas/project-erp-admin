import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UnitService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }
  getAllUnit(page: number, limit: number, search: string) {
    return this.http.get(
      `${this.baseUrl}/unit/fullpage?page=${page}&limit=${limit}&search=${search}`
    );
  }
  getUnit() {
    return this.http.get(`${this.baseUrl}/unit`);
  }
  getUnitById(id: number) {
    return this.http.get(`${this.baseUrl}/unit/${id}`);
  }
  postUnit(unit: any) {
    return this.http.post(`${this.baseUrl}/unit`, unit);
  }
  putUnit(id: number, unit: any) {
    return this.http.put(`${this.baseUrl}/unit/${id}`, unit);
  }
  deleteUnit(id: number) {
    return this.http.delete(`${this.baseUrl}/unit/${id}`);
  }
}
