import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
  }

  getPDF(id: number) {
    console.log("id", id);
    return this.http.get(`${this.baseUrl}/reports/salePDF/${id}`);
    //return `${this.baseUrl}/reports/salePDF/${id}`;
  }
  getPDFTicket(id: number) {
    return this.http.get(`${this.baseUrl}/reports/salePDFTikect/${id}`);
  }
}
