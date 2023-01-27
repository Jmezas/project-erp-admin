import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class SubCategoryService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  //get - post - put - delete => CRUD sub categories
  getAllSubCategories(page: number, limit: number, search: string) {
    return this.http.get(
      `${this.baseUrl}/subcategories/fullpage?page=${page}&limit=${limit}&search=${search}`,
      {
        headers: this.headers,
      }
    );
  }
  getSubCategories() {
    return this.http.get(`${this.baseUrl}/subcategories`, {
      headers: this.headers,
    });
  }
  getSubCategory(id: number) {
    return this.http.get(`${this.baseUrl}/subcategories/${id}`, {
      headers: this.headers,
    });
  }
  postSubCategory(subcategory: any) {
    return this.http.post(`${this.baseUrl}/subcategories`, subcategory, {
      headers: this.headers,
    });
  }
  putSubCategory(id: number, subcategory: any) {
    return this.http.put(`${this.baseUrl}/subcategories/${id}`, subcategory, {
      headers: this.headers,
    });
  }
  deleteSubCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/subcategories/${id}`, {
      headers: this.headers,
    });
  }
}
