import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DocumentTypeService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }
  getAllDocument(page: number, limit: number, search: string) {
    return this.http.get(
      `${this.baseUrl}/document-type/fullpage?page=${page}&limit=${limit}&search=${search}`,
      {
        headers: this.headers,
      }
    );
  }
  getDocument() {
    return this.http.get(`${this.baseUrl}/document-type`, {
      headers: this.headers,
    });
  }
  getDocumentById(id: number) {
    return this.http.get(`${this.baseUrl}/document-type/${id}`, {
      headers: this.headers,
    });
  }
  postDocument(document: any) {
    return this.http.post(`${this.baseUrl}/document-type`, document, {
      headers: this.headers,
    });
  }
  putDocument(id: number, document: any) {
    return this.http.put(`${this.baseUrl}/document-type/${id}`, document, {
      headers: this.headers,
    });
  }
  deleteDocument(id: number) {
    return this.http.delete(`${this.baseUrl}/document-type/${id}`, {
      headers: this.headers,
    });
  }
}
