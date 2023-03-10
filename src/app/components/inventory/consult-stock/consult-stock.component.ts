import { Component } from "@angular/core";
import { Result } from "src/app/shared/models/result";
import { WarehouseStock } from "src/app/shared/models/warehouse_stock";
import { InventoryService } from "src/app/shared/service/inventories/inventory.service";

@Component({
  selector: "app-consult-stock",
  templateUrl: "./consult-stock.component.html",
  styleUrls: ["./consult-stock.component.scss"],
})
export class ConsultStockComponent {
  stock: WarehouseStock[] = [];
  totalRecords: number;
  search: string = "";
  isloading: boolean = false;
  constructor(private api: InventoryService) {
    this.getAll();
  }
  getAll() {
    this.isloading = true;
    this.api.getAllStock(0, 10, "").subscribe((res: Result) => {
      this.isloading = false;
      console.log(res);
      this.stock = res.payload.data;
      this.stock.map((item) => {
        if (item.product.image == null || item.product.image.length == 0 || item.product.image == undefined) {
          item.product.image.push({
            secure_url: "assets/images/product-list/1.jpg",
          });
        }
      });
      console.log(this.stock);
      this.totalRecords = res.payload.total;
    });
  }
  onSearch() {
    this.isloading = true;
    this.api.getAllStock(0, 10, this.search.toUpperCase()).subscribe((res: Result) => {
      this.isloading = false;
      this.stock = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.isloading = true;
    this.api.getAllStock(event.page, event.rows, this.search.toUpperCase()).subscribe((res: Result) => {
      this.isloading = false;
      this.stock = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
}
