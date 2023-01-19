import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DocumentTypeService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }
  getAllDocument(page: number, limit: number, search: string) {
    return this.http.get(
      `${this.baseUrl}/document-type/fullpage?page=${page}&limit=${limit}&search=${search}`
    );
  }
  getDocument() {
    return this.http.get(`${this.baseUrl}/document-type`);
  }
  getDocumentById(id: number) {
    return this.http.get(`${this.baseUrl}/document-type/${id}`);
  }
  postDocument(document: any) {
    return this.http.post(`${this.baseUrl}/document-type`, document);
  }
  putDocument(id: number, document: any) {
    return this.http.put(`${this.baseUrl}/document-type/${id}`, document);
  }
  deleteDocument(id: number) {
    return this.http.delete(`${this.baseUrl}/document-type/${id}`);
  }
}
