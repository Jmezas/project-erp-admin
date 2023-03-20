import { Component, Input } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { DismissReason } from "src/app/common/dismissReason";
import { Result } from "src/app/shared/models/result";
import { AuthService } from "src/app/shared/service/auth.service";
import { SaleService } from "src/app/shared/service/sales/sale.service";
import { WarehouseService } from "src/app/shared/service/warehouses/warehouse.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-delete-sale",
  templateUrl: "./delete-sale.component.html",
  styleUrls: ["./delete-sale.component.scss"],
})
export class DeleteSaleComponent {
  public saleForm: UntypedFormGroup;
  detalle: any = [];
  almacen: any[] = [];
  selectAlamcen: any;

  total_quantity = 0;
  total_gravada = 0;
  total_igv = 0;
  total = 0;
  total_exonerada = 0;
  total_inafecta = 0;
  total_gratuita = 0;
  total_discount = 0;

  public search: string = "";
  dateStart: string = "";
  dateEnd: string = "";
  sale: any[] = [];
  totalRecords: number;
  rangeDates: Date[];
  closeResult: string;
  id;
  saleData: any;
  @Input() disabled = false;
  constructor(
    private apiWarehouse: WarehouseService,
    private apiAuth: AuthService,
    private api: SaleService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    this.getWarehouse();
    this.createFormSale();
  }
  getWarehouse() {
    this.apiWarehouse.getWarehouse().subscribe((res: Result) => {
      const warehouse = this.apiAuth.getUserInfo().warehouses;
      this.almacen = res.payload.data.filter((element) => warehouse.includes(element.id));

      this.selectAlamcen = this.almacen[0].id;
    });
  }
  onSearch(search: any) {
    this.api.getAllSale(0, 10, this.search, this.dateStart, this.dateEnd).subscribe((res: Result) => {
      this.sale = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  getAll() {
    this.api.getAllSale(0, 10, "", "", "").subscribe((res: Result) => {
      this.sale = res.payload.data;
      this.sale.map((item) => (item.number = item.number.toString().padStart(6, "0")));
      this.totalRecords = res.payload.total;
    });
  }
  createFormSale() {
    this.saleForm = this.fb.group({
      serie: [""],
      issue_date: [""],
      customer: [""],
      type_document: [""],
      type_document_indetifier: [""],
      document: [""],
    });
  }
  open(content) {
    this.getAll();
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "xl", centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${new DismissReason(reason)}`;
      }
    );
  }

  onSearchButton() {
    if (this.rangeDates != null || this.rangeDates != undefined) {
      this.dateStart = this.rangeDates[0].toISOString().slice(0, 10);
      if (this.rangeDates[1] != null) {
        this.dateEnd = this.rangeDates[1].toISOString().slice(0, 10);
        console.log(this.dateStart, this.dateEnd);
      }
    } else {
      this.dateStart = "";
      this.dateEnd = "";
    }

    this.api.getAllSale(0, 10, this.search, this.dateStart, this.dateEnd).subscribe((res: Result) => {
      this.sale = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.api.getAllSale(event.page, event.rows, this.search, this.dateStart, this.dateEnd).subscribe((res: Result) => {
      this.sale = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  getSaleBy(id: number) {
    this.modalService.dismissAll();
    this.api.getSaleBy(id).subscribe((res: Result) => {
      this.id = res.payload.data.id;
      this.saleData = res.payload.data;
      this.saleForm.patchValue({
        serie: res.payload.data.serie,
        issue_date: new Date(res.payload.data.issue_date),
        customer: res.payload.data.customer.name,
        type_document: res.payload.data.documentType.name,
        type_document_indetifier: res.payload.data.documentType.identifier,
        document: res.payload.data.customer.nroDocumento,
      });
      this.detalle = res.payload.data.details;
      this.detalle.map((x) => {
        x.warehouse = this.selectAlamcen;
      });
      this.total_quantity = res.payload.data.quantity;
      this.total_gravada = res.payload.data.recorded_operation;
      this.total_igv = res.payload.data.igv;
      this.total = res.payload.data.total;
      this.total_exonerada = res.payload.data.exempt_operation;
      this.total_inafecta = res.payload.data.unaffected_operation;
      this.total_gratuita = res.payload.data.free_operation;
      this.total_discount = res.payload.data.global_discount;
    });
  }
  onsaveDelete() {
    if (this.id == undefined || this.id == null) {
      this.toastr.warning("Debe seleccionar una venta", "Advertencia");
      return;
    }
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podras revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.value) {
        this.api.delteSale(this.saleData).subscribe((res: Result) => {
          this.clean();
          Swal.fire({
            title: "Eliminado",
            text: "Se elimino correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.clean();
        Swal.fire("Cancelado", "No se elimino el registro", "error");
      }
    });
  }
  onChangeAlmacen(event) {
    this.detalle.map((x) => {
      x.warehouse = event;
    });
  }
  clean() {
    this.saleData = null;
    this.id = null;
    this.detalle = [];
    this.saleForm.reset();
    this.total_quantity = 0;
    this.total_gravada = 0;
    this.total_igv = 0;
    this.total = 0;
    this.total_exonerada = 0;
    this.total_inafecta = 0;
    this.total_gratuita = 0;
    this.total_discount = 0;
  }
}
