import { DatePipe } from "@angular/common";
import { Component, HostListener } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";

import { category } from "src/app/shared/models/category";
import { General } from "src/app/shared/models/general";
import { Result } from "src/app/shared/models/result";
import { Unit } from "src/app/shared/models/unit";
import { CategoryService } from "src/app/shared/service/categories/category.service";
import { InventoryService } from "src/app/shared/service/inventories/inventory.service";
import { ProductService } from "src/app/shared/service/products/product.service";
import { UnitService } from "src/app/shared/service/units/unit.service";
import { WarehouseService } from "src/app/shared/service/warehouses/warehouse.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Router } from "@angular/router";
@Component({
  selector: "app-add-inventory",
  templateUrl: "./add-inventory.component.html",
  styleUrls: ["./add-inventory.component.scss"],
  providers: [DatePipe],
})
export class AddInventoryComponent {
  productForm: UntypedFormGroup;
  public cabecera: UntypedFormGroup;
  Editor = ClassicEditor;
  counter: number = 1;
  category: any = [];
  unit: any = [];
  general: any = [];
  files: File[] = [];
  file: File;
  selectedCategory: category;
  selectedUnit: Unit;
  selectedOperation: General;
  detalle: any[] = [];
  detailMovement: any[] = [];

  almacen: any[] = [];
  selectAlamcen: any;

  total_quantity = 0;
  total_gravada = 0;
  total_igv = 0;
  total = 0;
  igv: number = environment.IGV;
  observacion: string;
  dateEmision: Date = new Date();
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "F2") {
      //console.log("F2 pressed");
      // Call Function
      this.onAdd();
    }
  }
  constructor(
    private fb: UntypedFormBuilder,
    private apiCategory: CategoryService,
    private apiUnit: UnitService,
    private api: ProductService,
    private apiMovemente: InventoryService,
    private apiWarehouse: WarehouseService,
    public datepipe: DatePipe,
    private router: Router
  ) {
    this.createFormCabecera();
    this.createform();
    this.getcategory();
    this.getunit();
    this.getGeneral();
    this.getWarehouse();
    this.startComponent();
  }
  createFormCabecera() {
    this.cabecera = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      issue_date: ["", [Validators.required]],
    });
  }
  createform() {
    this.productForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      code: ["", [Validators.required, Validators.minLength(3)]],
      price_sale: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      price_purchase: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      discount: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      category: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      operation_type: ["", Validators.required],
      description: [""],
      quantity: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      //lista precio
      price_cuarto: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      price_media: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      price_docena: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      price_caja: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      quantity_caja: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
    });
  } //end createform

  //FileUpload
  onRemoveFile(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  change(event) {
    console.log(event[0]);
    this.file = event[0];
  }
  onSelect(event) {
    console.log(event);
    console.log(...event.addedFiles);
    this.files.push(...event.addedFiles);
  }
  getcategory() {
    this.apiCategory.getCategories().subscribe((res: Result) => {
      this.category = res.payload.data;
    });
  }
  getunit() {
    this.apiUnit.getUnit().subscribe((res: Result) => {
      this.unit = res.payload.data;
    });
  }
  getGeneral() {
    this.api.getTypeIgv().subscribe((res: Result) => {
      this.general = res.payload.data;
    });
  }
  getWarehouse() {
    this.apiWarehouse.getWarehouse().subscribe((res: Result) => {
      this.almacen = res.payload.data;
      this.selectAlamcen = res.payload.data[0].id;
    });
  }
  onfileSave() {
    const formData = new FormData();
    let fileToUpLoad = <File>this.file;
    formData.append("file", fileToUpLoad, fileToUpLoad.name);
    this.api.subirFile(formData).subscribe((res: any) => {
      console.log(res);
    });
  }
  onChangeAlmacen(event) {
    this.detalle.map((x) => (x.warehouse = event));
  }
  onAdd() {
    if (this.productForm.invalid) {
      return Object.values(this.productForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    let data = this.productForm.value;
    let product = {
      name: data.name.trim(),
      code: data.code.trim(),
      price_sale: data.price_sale,
      price_purchase: data.price_purchase,
      discount: data.discount,
      category: data.category.id,
      unit: data.unit.id,
      operation_type: data.operation_type.id,
      description: data.description,
      price_cuarto: data.price_cuarto,
      price_media: data.price_media,
      price_docena: data.price_docena,
      price_caja: data.price_caja,
      quantity_caja: data.quantity_caja,
      quantity: data.quantity,
      total: data.quantity * data.price_purchase,
      warehouse: this.selectAlamcen,
      unit_code: data.unit.code,
    };

    console.log(product);
    this.detalle.push(product);
    this.calculateTotal();
    this.productForm.reset();
    this.startComponent();
  }
  onSave() {
    if (this.cabecera.invalid) {
      return Object.values(this.cabecera.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    if (this.detalle == null || this.detalle.length == 0) {
      Swal.fire("Error!", "No se ha agregado ningún producto.", "error");
      return;
    }
    let data = this.cabecera.value;
    for (let i = 0; i < this.detalle.length; i++) {
      let detalle = {
        quantity: this.detalle[i].quantity,
        price: this.detalle[i].price_purchase,
        discount: this.detalle[i].discount,
        total: this.detalle[i].total,
        unit: this.detalle[i].unit_code,
        warehouse: this.detalle[i].warehouse,
      };
      this.detailMovement.push(detalle);
    }
    let cabecera = {
      name: data.name,
      issue_date: this.datepipe.transform(data.issue_date, "yyyy/MM/dd"),
      movement: {
        issue_date: this.datepipe.transform(data.issue_date, "yyyy/MM/dd"),
        type: 1, //1=ingreso, 2=salida
        currency: "PEN",
        quantity: this.total_quantity,
        recorded_operation: this.total_gravada,
        unaffected_operation: 0,
        exempt_operation: 0,
        free_operation: 0,
        igv: this.total_igv,
        total: this.total,
        observation: this.observacion,
        operationType: 16, //16 ingreso para almacen
        details: this.detailMovement,
      },
      detail: this.detalle,
    };

    this.apiMovemente.postMovementOther(cabecera).subscribe((res: Result) => {
      this.clean();
      this.startComponent();

      Swal.fire({
        title: "Producto creado!",
        text: "deseas volver a lista de productos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ir a productos!",
        cancelButtonText: "¿Seguir creando?",
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(["/products/product-list"]);
        }
      });
    });
  }
  calculateTotal() {
    this.total_quantity = 0;
    this.total_gravada = 0;
    this.total_igv = 0;
    this.total = 0;
    this.detalle.forEach((x) => {
      x.total = x.quantity * (x.price_purchase - x.discount);
      this.total_quantity += parseInt(x.quantity);
      this.total_gravada += x.total / (this.igv / 100 + 1);
      this.total_igv += (x.total / (this.igv / 100 + 1)) * (this.igv / 100);
      this.total = this.total_gravada + this.total_igv;
    });
  }
  onDelete(code: string) {
    this.detalle = this.detalle.filter((x) => x.code != code);
    this.calculateTotal();
  }
  startComponent() {
    let today = new Date();
    this.dateEmision.setDate(today.getDate());
    this.cabecera.get("issue_date").setValue(this.dateEmision);

    this.productForm.patchValue({
      price_cuarto: 0,
      price_media: 0,
      price_docena: 0,
      price_caja: 0,
      quantity_caja: 0,
    });
  }
  clean() {
    this.cabecera.reset();
    this.total_quantity = 0;
    this.total_gravada = 0;
    this.total_igv = 0;
    this.total = 0;
    this.observacion = "";
    this.detalle = [];
    this.detailMovement = [];
  }
  ngOnInit() {}
}
