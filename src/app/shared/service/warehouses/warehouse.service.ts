import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {WarehouseSave} from '../../models/warehouse';

@Injectable({
    providedIn: 'root',
})
export class WarehouseService {
    private baseUrl: string;
    headers;

    constructor(private http: HttpClient) {
        this.baseUrl = `${environment.urlAPI}`;
        this.headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
            'Content-type': 'application/json',
        });
    }

    getAllWarehouse(page: number, limit: number, search: string) {
        return this.http.get(`${this.baseUrl}/warehouse/fullpage?page=${page}&limit=${limit}&search=${search}`, {
            headers: this.headers,
        });
    }

    getWarehouse() {
        return this.http.get(`${this.baseUrl}/warehouse`, {
            headers: this.headers,
        });
    }

    getWarehouseById(id: number) {
        return this.http.get(`${this.baseUrl}/warehouse/${id}`, {
            headers: this.headers,
        });
    }

    postWarehouse(warehouse: WarehouseSave) {
        return this.http.post(`${this.baseUrl}/warehouse`, warehouse, {
            headers: this.headers,
        });
    }

    putWarehouse(id: number, warehouse: WarehouseSave) {
        return this.http.put(`${this.baseUrl}/warehouse/${id}`, warehouse, {
            headers: this.headers,
        });
    }

    deleteWarehouse(id: number) {
        return this.http.delete(`${this.baseUrl}/warehouse/${id}`, {
            headers: this.headers,
        });
    }
}
