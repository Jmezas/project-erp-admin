import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }

  //get - post - put - delete => CRUD categories

  getAllCategories(page: number, limit: number, search: string) {
    return this.http.get(
      `${this.baseUrl}/categories/fullpage?page=${page}&limit=${limit}&search=${search}`
    );
  }
  getCategories() {
    return this.http.get(`${this.baseUrl}/categories`);
  }
  getCategory(id: number) {
    return this.http.get(`${this.baseUrl}/categories/${id}`);
  }
  postCategory(category: any) {
    return this.http.post(`${this.baseUrl}/categories`, category);
  }
  putCategory(id: number, category: any) {
    return this.http.put(`${this.baseUrl}/categories/${id}`, category);
  }
  deleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }
}
