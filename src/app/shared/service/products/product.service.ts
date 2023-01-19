import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private baseUrl: string;
  producto: number = 0;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }
  //get - post - put - delete => CRUD products
  getAllProduct(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/products/fullpage?page=${page}&limit=${limit}&search=${search}`);
  }
  getProduct(search: string) {
    return this.http.get(`${this.baseUrl}/products?search=${search}`);
  }
  getProductById(id: number) {
    return this.http.get(`${this.baseUrl}/products/${id}`);
  }
  postProduct(product: any) {
    return this.http.post(`${this.baseUrl}/products`, product);
  }
  putProduct(id: number, product: any) {
    return this.http.put(`${this.baseUrl}/products/${id}`, product);
  }
  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}/products/${id}`);
  }
  getTypeIgv() {
    return this.http.get(`${this.baseUrl}/affectation-type-igv`);
  }
  verifyStock(product: number, warehouse: number) {
    return this.http.get(`${this.baseUrl}/products/stock/${product}/${warehouse}`);
  }
}
