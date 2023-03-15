import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class GeneralService {
  private baseUrl: string;
  private headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }

  getAllGeneral(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/general/fullpage?page=${page}&limit=${limit}&search=${search}`, {
      headers: this.headers,
    });
  }
  getGeneral(code: any) {
    return this.http.get(`${this.baseUrl}/general?code=${code}`, {
      headers: this.headers,
    });
  }
  getGeneralById(id: number) {
    return this.http.get(`${this.baseUrl}/general/${id}`, {
      headers: this.headers,
    });
  }
  postGeneral(general: any) {
    return this.http.post(`${this.baseUrl}/general`, general, {
      headers: this.headers,
    });
  }
  putGeneral(id: number, general: any) {
    return this.http.put(`${this.baseUrl}/general/${id}`, general, {
      headers: this.headers,
    });
  }
  deleteGeneral(id: number) {
    return this.http.delete(`${this.baseUrl}/general/${id}`, {
      headers: this.headers,
    });
  }

  //GET ubigeo
  getUbigeo(accion: string, departamento: string, provincia: string, distrito: string) {
    return this.http.get(`${this.baseUrl}/ubigeo/${accion}/${departamento}/${provincia}/${distrito}`, {
      headers: this.headers,
    });
  }

  //empresa
  getCompany() {
    return this.http.get(`${this.baseUrl}/company`, {
      headers: this.headers,
    });
  }
  getCompanyById(id: number) {
    return this.http.get(`${this.baseUrl}/company/${id}`, {
      headers: this.headers,
    });
  }
  postCompany(company: any) {
    return this.http.post(`${this.baseUrl}/company`, company, {
      headers: this.headers,
    });
  }
  putCompany(id: number, company: any) {
    return this.http.put(`${this.baseUrl}/company/${id}`, company, {
      headers: this.headers,
    });
  }
}
