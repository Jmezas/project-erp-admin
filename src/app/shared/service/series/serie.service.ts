import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SerieService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }
  getAllSerie(page: number, limit: number, search: string) {
    return this.http.get(
      `${this.baseUrl}/document-type/fullpage?page=${page}&limit=${limit}&search=${search}`
    );
  }
  getSerie() {
    return this.http.get(`${this.baseUrl}/document-type`);
  }
  getSerieById(id: number) {
    return this.http.get(`${this.baseUrl}/document-type/${id}`);
  }
  postSerie(serie: any) {
    return this.http.post(`${this.baseUrl}/document-type`, serie);
  }
  putSerie(id: number, serie: any) {
    return this.http.put(`${this.baseUrl}/document-type/${id}`, serie);
  }
  deleteSerie(id: number) {
    return this.http.delete(`${this.baseUrl}/document-type/${id}`);
  }
}
