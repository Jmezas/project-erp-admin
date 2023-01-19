import { Product } from "./products";

export class Inventory {
  id: number;
  issue_date: string;
  serie: string;
  number: number;
  type: number;
  currency: string;
  quantity: number;
  recorded_operation: number;
  unaffected_operation: number;
  exempt_operation: number;
  free_operation: number;
  igv: number;
  total: number;
  observation: string;
  operationType: number;
  details: InventoryDetail[];
}

export class InventoryDetail {
  warehouse: number;
  unit: string;
  quantity: number;
  unit_value: number;
  igv: number;
  total: number;
  product: Product;
}
