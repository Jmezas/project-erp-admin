import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { Result } from "src/app/shared/models/result";
import { ProductService } from "src/app/shared/service/products/product.service";
import { productDB } from "src/app/shared/tables/product-list";
import Swal from "sweetalert2";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  public product_list = [];
  totalRecords: number;
  search: string = "";

  @Output() product = new EventEmitter<number>();
  constructor(private api: ProductService, private router: Router) {
    this.getAllProduct();
  }

  ngOnInit() {}

  getAllProduct() {
    this.api.getAllProduct(0, 8, "").subscribe((res: Result) => {
      this.product_list = res.payload.data;
      this.product_list.map((item) => {
        item.image = "assets/images/product-list/1.jpg";
      });
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.api.getAllProduct(event.page, event.rows, this.search).subscribe((res: Result) => {
      this.product_list = res.payload.data;
      this.product_list.map((item) => {
        item.image = "assets/images/product-list/1.jpg";
      });

      this.totalRecords = res.payload.total;
    });
  }
  onSearch() {
    console.log(this.search);
    this.api.getAllProduct(0, 8, this.search).subscribe((res: Result) => {
      this.product_list = res.payload.data;
      this.product_list.map((item) => {
        item.image = "assets/images/product-list/1.jpg";
      });
      this.totalRecords = res.payload.total;
    });
  }
  onEdit(id) {
    this.router.navigate(["/products/add-product"]);
    this.product.emit(id);
    this.api.producto = id;
  }
  onDelete(id) {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, ¡borrarlo!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteProduct(id).subscribe((res) => {
          this.getAllProduct();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }
}
