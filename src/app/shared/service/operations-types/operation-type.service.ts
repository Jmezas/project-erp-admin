import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OperationTypeService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  getAllOperationType(page: number, limit: number, search: string) {
    return this.http.get(
      `${this.baseUrl}/operation-type/fullpage?page=${page}&limit=${limit}&search=${search}`,
      {
        headers: this.headers,
      }
    );
  }
  getOperationType() {
    return this.http.get(`${this.baseUrl}/operation-type`, {
      headers: this.headers,
    });
  }
  getOperationTypeById(id: number) {
    return this.http.get(`${this.baseUrl}/operation-type/${id}`, {
      headers: this.headers,
    });
  }
  postOperationType(operationType: any) {
    return this.http.post(`${this.baseUrl}/operation-type`, operationType, {
      headers: this.headers,
    });
  }
  putOperationType(id: number, operationType: any) {
    return this.http.put(`${this.baseUrl}/operation-type/${id}`, operationType, {
      headers: this.headers,
    });
  }
  deleteOperationType(id: number) {
    return this.http.delete(`${this.baseUrl}/operation-type/${id}`, {
      headers: this.headers,
    });
  }
}
