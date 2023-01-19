import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class GeneralService {
  private baseUrl: string;
  private urlConsultaDocumento: string;
  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.urlAPI}`;
    this.urlConsultaDocumento = `${environment.UrlConsultaDocumento}`;
  }

  getAllGeneral(page: number, limit: number, search: string) {
    return this.http.get(`${this.baseUrl}/general/fullpage?page=${page}&limit=${limit}&search=${search}`);
  }
  getGeneral(code: any) {
    return this.http.get(`${this.baseUrl}/general?code=${code}`);
  }
  getGeneralById(id: number) {
    return this.http.get(`${this.baseUrl}/general/${id}`);
  }
  postGeneral(general: any) {
    return this.http.post(`${this.baseUrl}/general`, general);
  }
  putGeneral(id: number, general: any) {
    return this.http.put(`${this.baseUrl}/general/${id}`, general);
  }
  deleteGeneral(id: number) {
    return this.http.delete(`${this.baseUrl}/general/${id}`);
  }

  //GET ubigeo
  getUbigeo(accion: string, departamento: string, provincia: string, distrito: string) {
    return this.http.get(`${this.baseUrl}/ubigeo/${accion}/${departamento}/${provincia}/${distrito}`);
  }

  //buscar DNI y RUC
  getConsultaDNI(dni: string) {
    return this.http.get(`${this.urlConsultaDocumento}/dni/${dni}`);
  }
  getConsultaRUC(ruc: string) {
    return this.http.get(`${this.urlConsultaDocumento}/ruc/${ruc}`);
  }

  //empresa
  getCompany() {
    return this.http.get(`${this.baseUrl}/company`);
  }
  getCompanyById(id: number) {
    return this.http.get(`${this.baseUrl}/company/${id}`);
  }
  postCompany(company: any) {
    return this.http.post(`${this.baseUrl}/company`, company);
  }
  putCompany(id: number, company: any) {
    return this.http.put(`${this.baseUrl}/company/${id}`, company);
  }
}
