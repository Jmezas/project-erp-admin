import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }

  //get - post - put - delete => CRUD categories

  getAllCategories(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/categories/fullpage/${page}/${limit}?search=${search}`, {
      headers: this.headers,
    });
  }
  getCategories() {
    return this.http.get(`${this.baseUrl}/categories`, {
      headers: this.headers,
    });
  }
  getCategory(id: number) {
    return this.http.get(`${this.baseUrl}/categories/${id}`, {
      headers: this.headers,
    });
  }
  postCategory(category: any) {
    return this.http.post(`${this.baseUrl}/categories`, category, {
      headers: this.headers,
    });
  }
  putCategory(id: number, category: any) {
    return this.http.put(`${this.baseUrl}/categories/${id}`, category, {
      headers: this.headers,
    });
  }
  deleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/categories/${id}`, {
      headers: this.headers,
    });
  }
}
