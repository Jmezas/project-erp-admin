import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SerieService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  getAllSerie(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/document-type/fullpage/${page}/${limit}?search=${search}`, {
      headers: this.headers,
    });
  }
  getSerie() {
    return this.http.get(`${this.baseUrl}/document-type`, {
      headers: this.headers,
    });
  }
  getSerieById(id: number) {
    return this.http.get(`${this.baseUrl}/document-type/${id}`, {
      headers: this.headers,
    });
  }
  postSerie(serie: any) {
    return this.http.post(`${this.baseUrl}/document-type`, serie, {
      headers: this.headers,
    });
  }
  putSerie(id: number, serie: any) {
    return this.http.put(`${this.baseUrl}/document-type/${id}`, serie, {
      headers: this.headers,
    });
  }
  deleteSerie(id: number) {
    return this.http.delete(`${this.baseUrl}/document-type/${id}`, {
      headers: this.headers,
    });
  }
}
