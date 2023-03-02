import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Product } from "src/app/shared/models/products";
import { Result } from "src/app/shared/models/result";
import { CategoryService } from "src/app/shared/service/categories/category.service";
import { GeneralService } from "src/app/shared/service/general.service";
import { InventoryService } from "src/app/shared/service/inventories/inventory.service";
import { OperationTypeService } from "src/app/shared/service/operations-types/operation-type.service";
import { ProductService } from "src/app/shared/service/products/product.service";
import { UnitService } from "src/app/shared/service/units/unit.service";
import { WarehouseService } from "src/app/shared/service/warehouses/warehouse.service";
import { environment } from "src/environments/environment";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Inventory } from "src/app/shared/models/inventory";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
@Component({
  selector: "app-add-movement",
  templateUrl: "./add-movement.component.html",
  styleUrls: ["./add-movement.component.scss"],
  providers: [DatePipe],
})
export class AddMovementComponent {
  //cabecera
  SaleForm: UntypedFormGroup;
  dateEmision: Date;
  detalle: any[] = [];
  data: any[];
  selectedProductAdvanced: any;

  selectAlamcen: any;

  typeMovement: any[] = [];
  moneda: any[] = [];
  almacen: any[] = [];
  operacion: any[] = [];

  serie: string;
  number: string;

  //prod
  productForm: UntypedFormGroup;
  category: any = [];
  unit: any = [];
  generalOperacion: any = [];
  closeResult: string;
  Editor = ClassicEditor;
  files: File[] = [];
  //total
  total: number = 0;
  total_igv: number = 0;
  total_quantity: number = 0;
  total_gravada: number = 0;
  total_inafecta: number = 0;
  total_exonerada: number = 0;
  total_gratuita: number = 0;
  igv: number = environment.IGV;
  isloading: boolean = false;
  loading: boolean = false;
  constructor(
    private apiProduct: ProductService,
    private toastr: ToastrService,
    private fb: UntypedFormBuilder,
    private apiGeneral: GeneralService,
    private apiWarehouse: WarehouseService,
    private apiOperation: OperationTypeService,
    private apiInventory: InventoryService,
    private apiCategory: CategoryService,
    private apiUnit: UnitService,
    private modalService: NgbModal,
    public datepipe: DatePipe
  ) {
    this.createForm();
    this.getMovementType();
    this.getMoneda();
    this.getWarehouse();
    this.getOperationTypes();
    this.getMovement();
    let today = new Date();
    this.dateEmision = new Date();
    this.dateEmision.setDate(today.getDate());

    //inicizar
    this.SaleForm.get("issue_date").setValue(this.dateEmision);
    this.SaleForm.get("movement").setValue(1);
    this.SaleForm.get("currency").setValue("PEN");
  }

  //crear formulario
  createForm() {
    this.SaleForm = this.fb.group({
      issue_date: ["", Validators.required],
      movement: ["", Validators.required],
      operationType: ["", Validators.required],
      currency: ["", Validators.required],
      observation: [""],
    });
  }
  getMovementType() {
    this.isloading = true;
    let code = 3;
    this.apiGeneral.getGeneral(code).subscribe((res: Result) => {
      this.isloading = false;
      this.typeMovement = res.payload.data;
    });
  }
  getMoneda() {
    this.isloading = true;
    let code = 4;
    this.apiGeneral.getGeneral(code).subscribe((res: Result) => {
      this.isloading = false;
      this.moneda = res.payload.data;
    });
  }
  getWarehouse() {
    this.isloading = true;
    this.apiWarehouse.getWarehouse().subscribe((res: Result) => {
      this.isloading = false;
      this.almacen = res.payload.data;
      this.selectAlamcen = res.payload.data[0].id;
    });
  }
  getOperationTypes() {
    this.isloading = true;
    this.apiOperation.getOperationType().subscribe((res: Result) => {
      this.isloading = false;
      this.operacion = res.payload.data;
      this.SaleForm.get("operationType").setValue(16);
    });
  }
  getMovement() {
    this.isloading = true;
    this.apiInventory.getMovement().subscribe((res: Result) => {
      this.isloading = false;
      if (res.payload.data.length == 0) {
        this.serie = "0001";
        this.number = "0000001";
        return;
      }
      this.serie = res.payload.data[0].serie;
      this.number = "000000" + (res.payload.data[0].number + 1);
    });
  }
  //producto
  createformProducto() {
    this.productForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"), Validators.minLength(3)]],
      code: ["", [Validators.required, Validators.minLength(3)]],
      price_sale: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      price_purchase: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      discount: ["", [Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      category: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      operation_type: ["", Validators.required],
      description: [""],
      //precio
      price_cuarto: ["", [Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      price_media: ["", [Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      price_docena: ["", [Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      price_caja: ["", [Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      quantity_caja: ["", [Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
    });
  }

  getcategory() {
    this.isloading = true;
    this.apiCategory.getCategories().subscribe((res: Result) => {
      this.isloading = false;
      this.category = res.payload.data;
    });
  }
  getunit() {
    this.isloading = true;
    this.apiUnit.getUnit().subscribe((res: Result) => {
      this.isloading = false;
      this.unit = res.payload.data;
    });
  }
  getGeneralOperacion() {
    this.isloading = true;
    this.apiProduct.getTypeIgv().subscribe((res: Result) => {
      this.isloading = false;
      this.generalOperacion = res.payload.data;
    });
  }
  //open producto
  openProducto(content) {
    this.createformProducto();
    this.getcategory();
    this.getunit();
    this.getGeneralOperacion();
    this.productForm.patchValue({
      price_cuarto: 0,
      price_media: 0,
      price_docena: 0,
      price_caja: 0,
      quantity_caja: 0,
    });
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg", centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  onSaveProducto() {
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
    let proucto: Product = {
      id: 0,
      name: data.name,
      code: data.code,
      price_sale: data.price_sale,
      price_purchase: data.price_purchase,
      discount: data.discount,
      category: data.category.id,
      unit: data.unit.id,
      operation_type: data.operation_type.id,
      description: data.description,
      image: data.image || null,
      price_cuarto: data.price_cuarto,
      price_media: data.price_media,
      price_docena: data.price_docena,
      price_caja: data.price_caja,
      quantity_caja: data.quantity_caja,
    };
    this.isloading = true;
    this.apiProduct.postProduct(proucto).subscribe((res) => {
      this.isloading = false;
      this.toastr.success("Producto creado correctamente", "¡Éxito!");
      this.modalService.dismissAll();
      let unidad;
      this.unit.filter((x) => {
        if (x.id === res["payload"].data.unit) {
          unidad = x.code;
        }
      });

      this.detalle.push({
        id: res["payload"].data.id,
        name: res["payload"].data.name,
        unit: unidad,
        discount: parseFloat(res["payload"].data.discount),
        quantity: 1,
        price: parseFloat(res["payload"].data.price_purchase),
        product: res["payload"].data.id,
        total: 1 * (res["payload"].data.price_purchase - res["payload"].data.discount),
        warehouse: this.selectAlamcen,
      });
      this.calculateTotal();
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  //FileUpload
  onRemoveFile(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  //fin producto

  onChangeSearch(val: string) {
    this.loading = true;
    this.data = [];
    this.apiProduct.getProduct(val["term"].toUpperCase()).subscribe((res: Result) => {
      this.loading = false;
      this.data = res.payload.data;
      this.data.map((product) => (product.name = `${product.name} ${product.code}`));
    });
  }
  selectEvent(item) {
    if (this.validateProduct(item.id)) {
      this.toastr.warning("El producto ya se encuentra en la lista", "¡Avertencia!");
      this.selectedProductAdvanced = [];
      this.data = [];
      return;
    }
    let quantity: number = 1;
    this.detalle.push({
      id: item.id,
      name: item.name,
      unit: item.unit,
      discount: parseFloat(item.discount),
      quantity: quantity,
      price: parseFloat(item.price_purchase),
      product: item.id,
      total: quantity * (item.price_purchase - item.discount),
      warehouse: this.selectAlamcen,
    });

    this.selectedProductAdvanced = [];
    this.data = [];

    //total
    this.calculateTotal();
    console.log(this.detalle);
  }

  onChangeAlmacen(event) {
    this.detalle.map((x) => (x.warehouse = event));
  }
  onDelete(id: number) {
    this.detalle = this.detalle.filter((x) => x.id != id);
    this.calculateTotal();
  }

  validateProduct(id: number) {
    let bFound: boolean = false;
    this.detalle.forEach((x) => {
      if (x.id == id) {
        bFound = true;
        return false;
      }
    });
    return bFound;
  }

  calculateTotal() {
    this.total_quantity = 0;
    this.total_gravada = 0;
    this.total_igv = 0;
    this.total = 0;
    this.detalle.forEach((x) => {
      x.total = x.quantity * (x.price - x.discount);
      this.total_quantity += parseInt(x.quantity);
      this.total_gravada += x.total / (this.igv / 100 + 1);
      this.total_igv += (x.total / (this.igv / 100 + 1)) * (this.igv / 100);
      this.total = this.total_gravada + this.total_igv;
    });
  }
  Onsave() {
    if (this.SaleForm.invalid) {
      return Object.values(this.SaleForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }

    let movement: Inventory = {
      id: 0,
      issue_date: this.datepipe.transform(this.SaleForm.value.issue_date, "yyyy/MM/dd"),
      serie: this.serie,
      number: parseInt(this.number),
      type: this.SaleForm.value.movement,
      currency: this.SaleForm.value.currency,
      operationType: this.SaleForm.value.operationType,
      quantity: this.total_quantity,
      recorded_operation: this.total_gravada,
      unaffected_operation: this.total_inafecta,
      exempt_operation: this.total_exonerada,
      free_operation: this.total_gratuita,
      igv: this.total_igv,
      total: this.total,
      observation: this.SaleForm.value.observation,
      details: this.detalle,
    };

    if (this.detalle == null || this.detalle.length == 0) {
      Swal.fire("Error!", "No se ha agregado ningún producto.", "error");
      return;
    }
    this.isloading = true;
    this.apiInventory.postMovement(movement).subscribe((res: Result) => {
      const data = res.payload.data;
      this.clean();

      this.isloading = false;
      Swal.fire("Buen trabajo!", "Tu registro ha sido guardado.", "success");
    });
  }
  clean() {
    this.SaleForm.reset();
    this.getMovement();
    this.detalle = [];
    this.total_quantity = 0;
    this.total_gravada = 0;
    this.total_exonerada = 0;
    this.total_inafecta = 0;
    this.total_gratuita = 0;
    this.total_igv = 0;
    this.total = 0;
    this.SaleForm.get("issue_date").setValue(this.dateEmision);
    this.SaleForm.get("movement").setValue(1);
    this.SaleForm.get("currency").setValue("PEN");
    this.SaleForm.get("operationType").setValue(16);
    this.SaleForm.get("observation").setValue("");
  }
}
