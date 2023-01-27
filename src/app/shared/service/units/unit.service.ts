import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UnitService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  getAllUnit(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/unit/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }
  getUnit() {
    return this.http.get(`${this.baseUrl}/unit`, {
      headers: this.headers,
    });
  }
  getUnitById(id: number) {
    return this.http.get(`${this.baseUrl}/unit/${id}`, {
      headers: this.headers,
    });
  }
  postUnit(unit: any) {
    return this.http.post(`${this.baseUrl}/unit`, unit, {
      headers: this.headers,
    });
  }
  putUnit(id: number, unit: any) {
    return this.http.put(`${this.baseUrl}/unit/${id}`, unit, {
      headers: this.headers,
    });
  }
  deleteUnit(id: number) {
    return this.http.delete(`${this.baseUrl}/unit/${id}`, {
      headers: this.headers,
    });
  }
}
