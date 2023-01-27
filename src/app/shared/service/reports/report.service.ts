import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private baseUrl: string;
  headers;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
      "Content-type": "application/json",
    });
  }

  getPDF(id: number) {
    console.log("id", id);
    return this.http.get(`${this.baseUrl}/reports/salePDF/${id}`, {
      headers: this.headers,
    });
    //return `${this.baseUrl}/reports/salePDF/${id}`;
  }
  getPDFTicket(id: number) {
    return this.http.get(`${this.baseUrl}/reports/salePDFTikect/${id}`, {
      headers: this.headers,
    });
  }
}
