import {Product} from './products';

export class WarehouseStock {
    id: number;
    product: Product;
    quantity: number;
    warehouse: any;
    stock: number;
    stock_min: number;
    notification: string;
}
