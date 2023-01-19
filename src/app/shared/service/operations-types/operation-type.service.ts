import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OperationTypeService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }
  getAllOperationType(page: number, limit: number, search: string) {
    return this.http.get(
      `${this.baseUrl}/operation-type/fullpage?page=${page}&limit=${limit}&search=${search}`
    );
  }
  getOperationType() {
    return this.http.get(`${this.baseUrl}/operation-type`);
  }
  getOperationTypeById(id: number) {
    return this.http.get(`${this.baseUrl}/operation-type/${id}`);
  }
  postOperationType(operationType: any) {
    return this.http.post(`${this.baseUrl}/operation-type`, operationType);
  }
  putOperationType(id: number, operationType: any) {
    return this.http.put(`${this.baseUrl}/operation-type/${id}`, operationType);
  }
  deleteOperationType(id: number) {
    return this.http.delete(`${this.baseUrl}/operation-type/${id}`);
  }
}
