import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  private baseUrl: string;
  producto: number = 0;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  getAllMenu(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/menu/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }
  getMenu() {
    return this.http.get(`${this.baseUrl}/menu`, {
      headers: this.headers,
    });
  }
  getMenuTree() {
    return this.http.get(`${this.baseUrl}/menu/tree`, {
      headers: this.headers,
    });
  }
  getMenuById(id: number) {
    return this.http.get(`${this.baseUrl}/menu/${id}`, {
      headers: this.headers,
    });
  }
  postMenu(menu: any) {
    return this.http.post(`${this.baseUrl}/menu`, menu, {
      headers: this.headers,
    });
  }
  putMenu(id: number, menu: any) {
    return this.http.put(`${this.baseUrl}/menu/${id}`, menu, {
      headers: this.headers,
    });
  }
  deleteMenu(id: number) {
    return this.http.delete(`${this.baseUrl}/menu/${id}`, {
      headers: this.headers,
    });
  }
}
