import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }
  getAllRoles(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/roles/fullpage?page=${page}&limit=${limit}&search=${search}`);
  }
  getRole() {
    return this.http.get(`${this.baseUrl}/roles`);
  }
  getRoleById(id: number) {
    return this.http.get(`${this.baseUrl}/roles/${id}`);
  }
  postRole(role: any) {
    return this.http.post(`${this.baseUrl}/roles`, role);
  }
  putRole(id: number, role: any) {
    return this.http.put(`${this.baseUrl}/roles/${id}`, role);
  }
  deleteRole(id: number) {
    return this.http.delete(`${this.baseUrl}/roles/${id}`);
  }
}
