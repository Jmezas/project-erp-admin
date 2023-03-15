import { Component, EventEmitter, Output } from "@angular/core";
import { DatePipe } from "@angular/common";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Customer } from "src/app/shared/models/customers";
import { Result } from "src/app/shared/models/result";
import { CustomerService } from "src/app/shared/service/customers/customer.service";
import { DocumentTypeService } from "src/app/shared/service/document-types/document-type.service";
import { GeneralService } from "src/app/shared/service/general.service";
import { NavService } from "src/app/shared/service/nav.service";
import { ProductService } from "src/app/shared/service/products/product.service";
import Swal from "sweetalert2";
import { environment } from "src/environments/environment";
import { Sale } from "src/app/shared/models/sale";
import { SaleService } from "src/app/shared/service/sales/sale.service";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { WarehouseService } from "src/app/shared/service/warehouses/warehouse.service";
import { catchError, firstValueFrom, forkJoin, Observable, of } from "rxjs";
import { InventoryService } from "src/app/shared/service/inventories/inventory.service";
import { ReportService } from "src/app/shared/service/reports/report.service";
import { AuthService } from "src/app/shared/service/auth.service";

@Component({
  selector: "app-new-sale",
  templateUrl: "./new-sale.component.html",
  styleUrls: ["./new-sale.component.scss"],
  providers: [DatePipe],
})
export class NewSaleComponent {
  dateEmision: Date;
  es: any;
  documento_type: any[];
  general: any = [];
  selectDocument: any;

  selectDocumentCliente: any;
  //documento
  public serie: string = "";
  public number: string = "";

  public getInitialDateFrom(): Date {
    return new Date();
  }

  //moneda  //harcode
  public moneda: any[] = [];
  public selectMoneda: any = { id: 1 };
  //fin moneda

  //buscar cliente
  selectedClientAdvanced: any[];
  filteredCliente: any[];

  departamento: any = [];
  provincia: any = [];
  distrito: any = [];
  customerForm: UntypedFormGroup;
  closeResult: string;
  selectdepartamento: any;

  //cabecera
  SaleForm: UntypedFormGroup;

  //producto venta
  selectedProductAdvanced: any;
  filteredProduct: any;
  keyword = "name";
  data: any[];
  listPrice: any[];
  almacen: any[] = [];
  selectAlamcen: any;
  //-----!!!**-
  public productForm: UntypedFormGroup;
  category: any = [];
  unit: any = [];
  generalOperacion: any = [];
  public Editor = ClassicEditor;
  //consultar stock
  stock: [] = [];
  totalRecords: number;
  search: string = "";
  selectedProducts: any[] = [];
  //detalle
  checked: boolean = true;
  detalle: any[] = [];

  //totales
  total: number = 0;
  total_igv: number = 0;
  total_discount: number = 0;
  total_quantity: number = 0;
  total_otros: number = 0;
  total_gravada: number = 0;
  total_inafecta: number = 0;
  total_exonerada: number = 0;
  total_gratuita: number = 0;
  igv: number = environment.IGV;

  //pdf
  pdfSrc;

  isloading: boolean = false;
  isloadingProduct: boolean = false;
  isloadingStock: boolean = false;
  @Output() pdrVenta = new EventEmitter<boolean>();
  constructor(
    private apiDocument: DocumentTypeService,
    public navServices: NavService,
    private apiGeneral: GeneralService,
    private apiCustomer: CustomerService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private apiProduct: ProductService,
    private apiSale: SaleService,
    public datepipe: DatePipe,
    private apiWarehouse: WarehouseService,
    private apiInventory: InventoryService,
    private apiReport: ReportService,
    private apiAuth: AuthService
  ) {
    this.onconfigDate();
    this.getDocumentType();
    this.pdrVenta.emit(false);

    //date
    let today = new Date();
    this.dateEmision = this.getInitialDateFrom();
    this.dateEmision.setDate(today.getDate());

    //documento cliente
    this.getDocumentTypeClient();

    this.createForm();
    //inicializar con valores por defecto
    this.SaleForm.get("issue_date").setValue(this.dateEmision);
    this.SaleForm.get("currency").setValue({ description2: "PEN" });

    //cargar ubigeo
    this.getDepartamento();
    this.getWarehouse();
    this.getMoneda();
    this.getListPrecios();
  }

  //crear formulario
  createForm() {
    this.SaleForm = this.fb.group({
      customer: ["", Validators.required],
      documentType: ["", Validators.required],
      issue_date: ["", Validators.required],
      currency: ["", Validators.required],
      // payment_condition: ["", Validators.required],
      // payment_date: ["", Validators.required],
    });
  }

  onconfigDate() {
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["Do", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: "Hoy",
      clear: "Borrar",
    };
  }
  getMoneda() {
    let code = 4;
    this.isloading = true;
    this.apiGeneral.getGeneral(code).subscribe((res: Result) => {
      this.isloading = false;
      this.moneda = res.payload.data;
    });
  }
  getListPrecios() {
    let code = 5;
    this.apiGeneral.getGeneral(code).subscribe((res: Result) => {
      this.listPrice = res.payload.data;
    });
  }
  getDocumentType() {
    this.isloading = true;
    this.apiDocument.getDocument().subscribe((data: Result) => {
      this.documento_type = data.payload.data;
      this.selectDocument = { id: environment.saleTypeOperation };
      this.SaleForm.get("documentType").setValue(this.selectDocument);
      this.serie = this.documento_type.find((x) => x.id == this.selectDocument.id).serie;
      this.number = "00000000" + this.documento_type.find((x) => x.id == this.selectDocument.id).number;

      //harcode
      this.selectDocumentCliente = { code: 1 };
      this.isloading = false;
    });
  }
  onChangeDocument(even: any) {
    this.serie = this.documento_type.find((x) => x.id == even.value.id).serie;
    this.number = "00000000" + this.documento_type.find((x) => x.id == even.value.id).number;
    if (even.value.id == 1) {
      //harcode
      this.selectDocumentCliente = { code: 1 };
    } else {
      //harcode
      this.selectDocumentCliente = { code: 6 };
    }
  }

  getDocumentTypeClient() {
    let code = 1;
    this.isloading = true;
    this.apiGeneral.getGeneral(code).subscribe((res: Result) => {
      this.isloading = false;
      this.general = res.payload.data;
    });
  }

  //buscar cliente
  filterClient(event) {
    let query = event.query;
    let code = this.selectDocumentCliente == undefined ? 2 : this.selectDocumentCliente.code;
    this.apiCustomer.getallCustomer(query.toUpperCase(), code).subscribe((res: Result) => {
      this.filteredCliente = res.payload.data;
      this.filteredCliente.map((cliente) => (cliente.name = `${cliente.name} ${cliente.nroDocumento}`));
    });
  }
  //fin buscar cliente
  //crear cliente
  open(content) {
    this.provincia = [];
    this.distrito = [];
    this.createform();
    this.customerForm.reset();
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg", centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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

  //crear formualrio
  createform() {
    this.customerForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      nroDocumento: ["", [Validators.required]],
      email: ["", [Validators.pattern("/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/")]],
      phone: [""],
      address: ["", [Validators.required]],
      document: ["", [Validators.required]],
      departament: ["", [Validators.required]],
      province: ["", Validators.required],
      distrit: ["", [Validators.required]],
    });
  }
  getBucarDocumento() {
    if (this.customerForm.value.document != null) {
      if (this.customerForm.value.nroDocumento != null) {
        if (this.customerForm.value.document.code == 6) {
          if (this.customerForm.value.nroDocumento.length != 11) {
            this.toastr.warning("El RUC debe tener 11 digitos", "¡Avertencia!");
            return;
          }
          this.apiCustomer.searchDocument(this.customerForm.value.nroDocumento).subscribe((res: Result) => {
            if (res.payload.data.TipoRespuesta == 2) {
              this.toastr.error(res.payload.data.MensajeRespuesta, "¡Error!");
              return;
            }
            this.customerForm.controls["name"].setValue(res.payload.data.RazonSocial.trim());
            this.customerForm.controls["address"].setValue(res.payload.data.DomicilioFiscal.replace(/\s+/g, " "));
          });
        } else if (this.customerForm.value.document.code == 1) {
          if (this.customerForm.value.nroDocumento.length != 8) {
            this.toastr.warning("El DNI debe tener 8 digitos", "¡Avertencia!");
            return;
          }
          this.apiCustomer.searchDocument(this.customerForm.value.nroDocumento).subscribe((res: Result) => {
            if (res.payload.data.nombre == null || res.payload.data == null) {
              this.toastr.error(res.payload.data.respuesta, "¡Error!");
              return;
            }
            this.customerForm.controls["name"].setValue(
              `${res.payload.data.nombre} ${res.payload.data.apellidoPaterno} ${res.payload.data.apellidoMaterno}`
            );
          });
        } else {
          this.toastr.warning("Seleccione un tipo de documento", "¡Avertencia!");
          return;
        }
      } else {
        this.toastr.warning("Ingrese nro documento", "¡Avertencia!");
        return;
      }
    } else {
      this.toastr.warning("Seleccione un tipo de documento", "¡Avertencia!");
      return;
    }
  }

  getDepartamento() {
    let accion = "DEPARTAMENTO";
    this.apiGeneral.getUbigeo(accion, "00", "00", "00").subscribe((res: any[]) => {
      this.departamento = res;
    });
  }

  getProvincia(departamento: any) {
    this.selectdepartamento = departamento.value.code;
    let accion = "PROVINCIA";
    this.apiGeneral.getUbigeo(accion, departamento.value.code, "00", "00").subscribe((res: any[]) => {
      this.provincia = res;
    });
  }

  getDistrito(provincia: any) {
    let accion = "DISTRITO";
    this.apiGeneral.getUbigeo(accion, this.selectdepartamento, provincia.value.code, "00").subscribe((res: any[]) => {
      this.distrito = res;
    });
  }
  onSave() {
    if (this.customerForm.invalid) {
      return Object.values(this.customerForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    let customer: Customer = {
      id: 0,
      name: this.customerForm.value.name,
      nroDocumento: this.customerForm.value.nroDocumento,
      email: this.customerForm.value.email,
      phone: this.customerForm.value.phone,
      address: this.customerForm.value.address,
      document: this.customerForm.value.document.code,
      departament: this.customerForm.value.departament.code,
      province: this.customerForm.value.province.code,
      distrit: this.customerForm.value.distrit.code,
      ubigeo: this.customerForm.value.distrit.idubi,
    };
    this.isloading = true;
    this.apiCustomer.createCustomer(customer).subscribe((res: Result) => {
      this.isloading = false;
      const data = res.payload.data;
      this.SaleForm.get("customer").setValue(data.id);
      this.selectedClientAdvanced = { name: `${data.name} ${data.nroDocumento}` } as any;
      this.modalService.dismissAll();
      this.customerForm.reset();

      Swal.fire("Buen trabajo!", "Tu registro ha sido guardado.", "success");
    });
  }

  //cliente
  onChangeClient(val: string) {
    console.log(val);
    // this.selectedClientAdvanced = [];
    this.SaleForm.controls["customer"].setValue(val["id"]);
  }
  //buscar producto

  onChangeSearch(val: string) {
    this.data = [];
    this.isloadingProduct = true;
    this.apiProduct.getProduct(val["term"].toUpperCase()).subscribe((res: Result) => {
      this.isloadingProduct = false;
      this.data = res.payload.data;
      this.data.map((product) => (product.name = `${product.name} ${product.code}`));
    });
  }
  async selectEvent(item) {
    let quantity: number = 1;
    let val = await this.verificarStock(item.id, this.selectAlamcen, quantity);
    if (val) {
      this.toastr.warning("No hay stock suficiente", "¡Avertencia!");
      this.selectedProductAdvanced = [];
      this.data = [];
      return;
    }
    if (this.validateProduct(item.id)) {
      this.toastr.warning("El producto ya se encuentra en la lista", "¡Avertencia!");
      this.selectedProductAdvanced = [];
      this.data = [];
      return;
    }

    this.detalle.push({
      id: item.id,
      name: item.name,
      unit: item.unit,
      discount: parseFloat(item.discount),
      quantity: quantity,
      price: parseFloat(item.price_sale),
      code_type: "01",
      code_igv: "10",
      product: item.id,
      total: quantity * (item.price_sale - item.discount),
      lstprecio: { code: 1, description: "Unidad" },
      warehouse: this.selectAlamcen,
      //confir precio
      price_unit: item.price_sale,
      price_cuarto: item.price_cuarto,
      price_media: item.price_media,
      price_docena: item.price_docena,
      price_caja: item.price_caja,
      quantity_caja: item.quantity_caja,
    });
    this.selectedProductAdvanced = [];
    this.data = [];

    //total
    this.calculateTotal();
  }

  //consulta stock
  getAll() {
    this.isloadingStock = true;
    this.apiInventory.getAllStock(0, 10, "").subscribe((res: Result) => {
      this.isloadingStock = false;
      this.stock = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  onSearch(search: any) {
    this.isloadingStock = true;
    this.apiInventory.getAllStock(0, 10, this.search).subscribe((res: Result) => {
      this.isloadingStock = false;
      this.stock = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.isloadingStock = true;
    this.apiInventory.getAllStock(event.page, event.rows, this.search).subscribe((res: Result) => {
      this.isloadingStock = false;
      this.stock = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  //open producto
  openProducto(content) {
    this.getAll();
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg", centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  select() {
    console.log(this.selectedProducts);
    this.selectedProducts.forEach(async (element) => {
      let quantity: number = 1;

      let val = await this.verificarStock(element.product.id, this.selectAlamcen, quantity);
      if (val) {
        this.toastr.warning("No hay stock suficiente", "¡Avertencia!");
        return;
      }
      if (this.validateProduct(element.product.id)) {
        this.toastr.warning("El producto ya se encuentra en la lista", "¡Avertencia!");
        return;
      }
      this.detalle.push({
        id: element.product.id,
        name: element.product.name,
        unit: element.product.unit.name,
        discount: parseFloat(element.product.discount),
        quantity: quantity,
        price: parseFloat(element.product.price_sale),
        code_type: "01",
        code_igv: "10",
        product: element.product.id,
        total: quantity * (element.product.price_sale - element.product.discount),
        lstprecio: { code: 1, description: "Unidad" },
        warehouse: this.selectAlamcen,
        //confir precio
        price_unit: element.product.price_sale,
        price_cuarto: element.product.price_cuarto,
        price_media: element.product.price_media,
        price_docena: element.product.price_docena,
        price_caja: element.product.price_caja,
        quantity_caja: element.product.quantity_caja,
      });
      this.calculateTotal();
    });
    this.selectedProducts = [];
    this.modalService.dismissAll();
  }

  getWarehouse() {
    this.apiWarehouse.getWarehouse().subscribe((res: Result) => {
      const warehouse = this.apiAuth.getUserInfo().warehouses;
      this.almacen = res.payload.data.filter((element) => warehouse.includes(element.id));

      this.selectAlamcen = this.almacen[0].id;
    });
  }
  onChangeAlmacen(event) {
    this.detalle.map((x) => {
      x.warehouse = event;
    });
  }

  //verificar stock
  async verificarStock(product, warehouse, quantity: number) {
    console.log(product, warehouse, quantity);
    return new Promise<Boolean>((resolve, reject) => {
      firstValueFrom(this.apiProduct.verifyStock(product, warehouse))
        .then((res: Result) => {
          if (res.payload.data) {
            if (res.payload.data.stock >= parseInt(quantity.toString())) {
              resolve(false); //hay sotck
            } else {
              resolve(true); //no hay stock
            }
          } else {
            resolve(true); //no hay stock
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  //configuracion de precio
  onchangeListPrecio(event: any) {
    this.detalle.forEach((x) => {
      if (x.lstprecio.code === 1) {
        x.price = x.price_unit;
        x.quantity = 1;
      } else if (x.lstprecio.code === 2) {
        x.price = x.price_cuarto;
        x.quantity = 3;
      } else if (x.lstprecio.code === 3) {
        x.price = x.price_media;
        x.quantity = 6;
      } else if (x.lstprecio.code === 4) {
        x.price = x.price_docena;
        x.quantity = 12;
      } else if (x.lstprecio.code === 5) {
        x.price = x.price_caja;
        x.quantity = x.quantity_caja;
      }
    });
    this.calculateTotal();
  }

  onDelete(id: number) {
    this.detalle = this.detalle.filter((x) => x.id != id);
    this.calculateTotal();
  }
  calculateTotal() {
    console.log(this.detalle);
    this.total_quantity = 0;
    this.total_discount = 0;
    this.total_gravada = 0;
    this.total_igv = 0;
    this.total = 0;
    this.detalle.forEach((x) => {
      x.total = x.quantity * (x.price - x.discount);
      this.total_quantity += parseInt(x.quantity);
      this.total_discount += x.discount;
      this.total_gravada += x.total / (this.igv / 100 + 1);
      this.total_igv += (x.total / (this.igv / 100 + 1)) * (this.igv / 100);
      this.total = this.total_gravada + this.total_igv;
    });
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
  async onSaveSale(content) {
    if (this.SaleForm.invalid) {
      return Object.values(this.SaleForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    let sale: Sale = {
      id: 0,
      customer: this.SaleForm.value.customer,
      documentType: this.SaleForm.value.documentType["id"],
      payment_condition: 3,
      issue_date: this.datepipe.transform(this.SaleForm.value.issue_date, "yyyy/MM/dd"),
      payment_date: this.datepipe.transform(this.SaleForm.value.issue_date, "yyyy/MM/dd"),
      serie: this.serie,
      number: parseInt(this.number),
      quantity: this.total_quantity,
      recorded_operation: this.total_gravada,
      unaffected_operation: this.total_inafecta,
      exempt_operation: this.total_exonerada,
      free_operation: this.total_gratuita,
      igv: this.total_igv,
      total_discount: this.total_discount,
      global_discount: 0,
      total: this.total,
      currency: this.SaleForm.value.currency["description2"],
      shipment_status: "N",
      details: this.detalle,
      checkSale: {
        amount_received: 118,
        amount_paid: 118,
        amount_change: 0,
        type_payment: 1,
      },
    };
    if (this.detalle == null || this.detalle.length == 0) {
      Swal.fire("Error!", "No se ha agregado ningún producto.", "error");
      return;
    }
    this.isloading = true;
    for (let i = 0; i < this.detalle.length; i++) {
      if (this.detalle[i].quantity === 0) {
        this.isloading = false;
        Swal.fire("Error!", "La cantidad del producto no puede ser cero.", "error");
        return;
      }
      let val = await this.verificarStock(this.detalle[i].id, this.detalle[i].warehouse, this.detalle[i].quantity);
      if (val) {
        this.isloading = false;
        Swal.fire("Error!", "No hay stock suficiente del producto " + this.detalle[i].name, "error");
        return;
      }
    }

    this.isloading = true;
    this.apiSale.postSale(sale).subscribe((res: Result) => {
      this.isloading = false;
      const data = res.payload.data;
      this.clean();
      this.getDocumentType();
      Swal.fire({
        title: "Venta registrada",
        text: "Se ha registrado la venta correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          //this.router.navigate(["/sale"]);
          this.generatePDF(data.id);
          this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg", centered: true }).result.then(
            (result) => {
              this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
          );
        }
      });
    });
  }
  generatePDF(id: number) {
    this.apiReport.getPDF(id).subscribe((res: any) => {
      console.log(res);
      let base64textString = res.pdf;
      var byteCharacters = window.atob(base64textString);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var blob = new Blob([byteArray], { type: "application/pdf" });
      var fileURL = URL.createObjectURL(blob);
      console.log(fileURL);
      this.pdfSrc = fileURL;
      //window.open(fileURL, "_blank").print();
    });
  }
  clean() {
    this.SaleForm.reset();
    this.detalle = [];
    this.total_quantity = 0;
    this.total_discount = 0;
    this.total_gravada = 0;
    this.total_exonerada = 0;
    this.total_inafecta = 0;
    this.total_gratuita = 0;
    this.total_igv = 0;
    this.total = 0;
    this.selectedClientAdvanced = [];
    this.SaleForm.get("issue_date").setValue(this.dateEmision);
    this.SaleForm.get("currency").setValue({ description2: "PEN" });
    this.SaleForm.get("documentType").setValue(this.selectDocument);
  }
}
