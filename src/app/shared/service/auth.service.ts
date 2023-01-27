import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { concatMap, forkJoin, map } from "rxjs";
import { environment } from "src/environments/environment";
import { Result } from "../models/result";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string;
  private baseUrl: string;
  menus: any[] = [];
  constructor(private http: HttpClient, private router: Router) {
    this.baseUrl = `${environment.urlAPI}`;
  }

  saveToken(token: string, refreshToken?: string) {
    localStorage.setItem("ACCESS_TOKEN", token);
    if (refreshToken) {
      localStorage.setItem("REFRESH_TOKEN", refreshToken);
    }

    this.token = token;
  }

  private getToken() {
    if (!this.token) {
      return localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token;
  }

  logOut() {
    this.token = "";
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    localStorage.removeItem("MENU");
    this.router.navigateByUrl("/auth/login");
  }

  getUserInfo() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      return JSON.parse(window.atob(payload));
    } else {
      return null;
    }
  }

  isLogged() {
    const user = this.getUserInfo();

    return user ? user.exp > Date.now() / 1000 : false;
  }

  private request(user) {
    const headers = new HttpHeaders({ accept: "application/json", "Content-Type": "application/json" });
    return this.http.post(`${this.baseUrl}/auth/login`, user, { headers }).pipe(
      map((res: Result) => {
        if (res.payload.data.accessToken) {
          this.saveToken(res.payload.data.accessToken, res.payload.data.refreshToken);
          this.menus = [];
          //const token = JSON.parse(window.atob(res.payload.data.accessToken.split(".")[1]));
        } else {
          const error = { error: "0007", message: "Insufficient Permissions", statusCode: 401 };
          throw new HttpErrorResponse({ error, status: 401, statusText: "Unauthorized" });
        }
        return res;
      })
    );
  }

  returnToken() {
    return this.isLogged ? this.getToken() : null;
  }
  menuRole(role) {
    let headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
    return this.http.get(`${this.baseUrl}/menu/treeRole/${role}`, { headers: headers });
  }

  login(user) {
    return this.request(user);
    // return this.http.post(`${this.baseUrl}/auth/login`, user);
  }
}
