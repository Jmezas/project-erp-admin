import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }

  getAllUser(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/users/fullpage?page=${page}&limit=${limit}&search=${search}`);
  }

  getUser() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getUserById(id: number) {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }

  postUser(user: any) {
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  putUser(id: number, user: any) {
    return this.http.put(`${this.baseUrl}/users/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }
}
