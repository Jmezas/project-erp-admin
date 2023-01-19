import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class SubCategoryService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }
  //get - post - put - delete => CRUD sub categories
  getAllSubCategories(page: number, limit: number, search: string) {
    return this.http.get(
      `${this.baseUrl}/subcategories/fullpage?page=${page}&limit=${limit}&search=${search}`
    );
  }
  getSubCategories() {
    return this.http.get(`${this.baseUrl}/subcategories`);
  }
  getSubCategory(id: number) {
    return this.http.get(`${this.baseUrl}/subcategories/${id}`);
  }
  postSubCategory(subcategory: any) {
    return this.http.post(`${this.baseUrl}/subcategories`, subcategory);
  }
  putSubCategory(id: number, subcategory: any) {
    return this.http.put(`${this.baseUrl}/subcategories/${id}`, subcategory);
  }
  deleteSubCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/subcategories/${id}`);
  }
}
