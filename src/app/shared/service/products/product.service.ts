import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private baseUrl: string;
  producto: number = 0;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
    });
  }
  //get - post - put - delete => CRUD products
  getAllProduct(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/products/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }
  getProduct(search: string) {
    return this.http.get(`${this.baseUrl}/products?search=${search}`, {
      headers: this.headers,
    });
  }
  getProductById(id: number) {
    return this.http.get(`${this.baseUrl}/products/${id}`, {
      headers: this.headers,
    });
  }
  subirFile(file: any) {
    return this.http.post(`${this.baseUrl}/reports/upload`, file, {
      headers: this.headers,
    });
  }
  postProduct(product: any) {
    console.log(product);
    return this.http.post(`${this.baseUrl}/products`, product, {
      headers: this.headers,
    });
  }
  putProduct(id: number, product: any) {
    return this.http.put(`${this.baseUrl}/products/${id}`, product, {
      headers: this.headers,
    });
  }
  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}/products/${id}`, {
      headers: this.headers,
    });
  }
  getTypeIgv() {
    return this.http.get(`${this.baseUrl}/affectation-type-igv`, {
      headers: this.headers,
    });
  }
  verifyStock(product: number, warehouse: number) {
    return this.http.get(`${this.baseUrl}/products/stock/${product}/${warehouse}`, {
      headers: this.headers,
    });
  }
}
