export interface WarehouseSave {
    id: number;
    name: string;
    phone: string;
    address: string;
    email: string;
    ubigeo: number;
    company: number;
}

export interface DroplistUbigeo {
    code: number | string;
    description: string;
}

export interface ListWarehouse {
    id: number;
    name: string;
    phone: string;
    email: string;
}
