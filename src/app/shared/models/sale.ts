import { Customer } from "./customers";
import { documentType } from "./document_type";
import { Product } from "./products";

export class Sale {
  id: number;
  customer: Customer;
  documentType: documentType;
  payment_condition: number;
  issue_date: string;
  payment_date: string;
  serie: string;
  number: Number | string;
  quantity: Number;
  recorded_operation: Number;
  unaffected_operation: Number;
  exempt_operation: Number;
  free_operation: Number;
  igv: Number;
  total_discount: Number;
  global_discount: Number;
  total: Number;
  currency: string;
  shipment_status: string;
  details: SaleItem[];
  checkSale: checkSale;
}
export class checkSale {
  amount_received: number;
  amount_paid: number;
  amount_change: number;
  type_payment: number;
}
export class SaleItem {
  unit: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  code_type: string;
  code_igv: string;
  product: Product;
}
