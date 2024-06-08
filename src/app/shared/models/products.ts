import {Category} from './category';
import {General} from './general';
import {Unit} from './unit';

export class Product {
    id: number;
    name: string;
    code: string;
    price_sale: number;
    price_purchase: number;
    discount: number;
    description: string;
    image?: FormData[] | any[] | any;
    category: number | Category;
    unit: Unit | number;
    operation_type: number | General;
    price_cuarto?: number;
    price_media?: number;
    price_docena?: number;
    price_caja?: number;
    quantity_caja?: number;
    quantity?: number;
}
