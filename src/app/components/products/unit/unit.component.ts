import { Component } from "@angular/core";
import { Result } from "src/app/shared/models/result";
import { SubCategory } from "src/app/shared/models/sub-category";
import Swal from "sweetalert2";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Unit } from "src/app/shared/models/unit";
import { UnitService } from "src/app/shared/service/units/unit.service";
@Component({
  selector: "app-unit",
  templateUrl: "./unit.component.html",
  styleUrls: ["./unit.component.scss"],
})
export class UnitComponent {
  public closeResult: string;
  public search: string = "";
  unit: Unit[];

  public totalRecords: number;
  edit: boolean = false;

  //create  and edit
  name: string = "";
  code: string = "";
  id: number = 0;

  //save
  saveSubcategory: SubCategory;
  constructor(private modalService: NgbModal, private api: UnitService) {
    this.getAll();
  }

  open(content, id: number) {
    this.id = 0;
    this.name = "";
    this.code = "";
    if (id > 0) {
      this.edit = true;
      this.onGet(id);
    } else {
      this.edit = false;
    }
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" }).result.then(
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
  getAll() {
    this.api.getAllUnit(0, 10, "").subscribe((res: Result) => {
      this.unit = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  paginate(event) {
    this.api.getAllUnit(event.page, event.rows, this.search).subscribe((res: Result) => {
      this.unit = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  onSave() {
    let Unit: Unit = {
      id: 0,
      name: this.name,
      code: this.code,
    };

    this.api.postUnit(Unit).subscribe((res) => {
      this.getAll();
      Swal.fire({
        icon: "success",
        title: "Se grabo correctamente",
        showConfirmButton: false,
        timer: 1100,
      });
      this.modalService.dismissAll();
    });
  }
  onGet(id: number) {
    this.id = id;
    this.api.getUnitById(id).subscribe((res: Result) => {
      this.name = res.payload.data.name;
      this.code = res.payload.data.code;
    });
  }
  onUpdate() {
    let unit: Unit = {
      id: this.id,
      name: this.name,
      code: this.code,
    };

    this.api.putUnit(this.id, unit).subscribe((res) => {
      this.getAll();
      Swal.fire({
        icon: "success",
        title: "Se actualizo correctamente",
        showConfirmButton: false,
        timer: 1100,
      });
      this.modalService.dismissAll();
    });
  }
  onDelete(id: number) {
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
        this.api.deleteUnit(id).subscribe((res) => {
          this.getAll();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }

  onSearch(search: any) {
    this.api.getAllUnit(0, 10, this.search).subscribe((res: Result) => {
      this.unit = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
}
