import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }

  getAllUser(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/users/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }

  getUser() {
    return this.http.get(`${this.baseUrl}/users`, {
      headers: this.headers,
    });
  }

  getUserById(id: number) {
    return this.http.get(`${this.baseUrl}/users/${id}`, {
      headers: this.headers,
    });
  }

  postUser(user: any) {
    return this.http.post(`${this.baseUrl}/users`, user, {
      headers: this.headers,
    });
  }

  putUser(id: number, user: any) {
    return this.http.put(`${this.baseUrl}/users/${id}`, user, {
      headers: this.headers,
    });
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/users/${id}`, {
      headers: this.headers,
    });
  }
  updatePassword(userPass: any) {
    return this.http.post(`${this.baseUrl}/users/update-password`, userPass, {
      headers: this.headers,
    });
  }
}
