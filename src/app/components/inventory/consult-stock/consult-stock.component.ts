import { Component } from "@angular/core";
import { Result } from "src/app/shared/models/result";
import { InventoryService } from "src/app/shared/service/inventories/inventory.service";

@Component({
  selector: "app-consult-stock",
  templateUrl: "./consult-stock.component.html",
  styleUrls: ["./consult-stock.component.scss"],
})
export class ConsultStockComponent {
  stock: [] = [];
  totalRecords: number;
  search: string = "";
  constructor(private api: InventoryService) {
    this.getAll();
  }
  getAll() {
    this.api.getAllStock(0, 10, "").subscribe((res: Result) => {
      console.log(res);
      this.stock = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  onSearch(search: any) {
    this.api.getAllStock(0, 10, this.search).subscribe((res: Result) => {
      this.stock = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.api.getAllStock(event.page, event.rows, this.search).subscribe((res: Result) => {
      this.stock = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
}
