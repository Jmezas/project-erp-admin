import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  private baseUrl: string;
  producto: number = 0;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }
  getAllMenu(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/menu/fullpage?page=${page}&limit=${limit}&search=${search}`);
  }
  getMenu() {
    return this.http.get(`${this.baseUrl}/menu`);
  }
  getMenuById(id: number) {
    return this.http.get(`${this.baseUrl}/menu/${id}`);
  }
  postMenu(menu: any) {
    return this.http.post(`${this.baseUrl}/menu`, menu);
  }
  putMenu(id: number, menu: any) {
    return this.http.put(`${this.baseUrl}/menu/${id}`, menu);
  }
  deleteMenu(id: number) {
    return this.http.delete(`${this.baseUrl}/menu/${id}`);
  }
}
