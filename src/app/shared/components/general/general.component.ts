import { Component } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { General } from "../../models/general";
import { Result } from "../../models/result";
import { GeneralService } from "../../service/general.service";

@Component({
  selector: "app-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.scss"],
})
export class GeneralComponent {
  closeResult: string;
  search: string = "";
  general: General[];

  totalRecords: number;
  edit: boolean = false;

  //create  and edit

  //save
  saveGeneral: General = {};
  constructor(private modalService: NgbModal, private api: GeneralService) {
    this.getAll();
  }

  open(content, id: number) {
    this.saveGeneral = {};
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
    this.api.getAllGeneral(0, 10, "").subscribe((res: Result) => {
      this.general = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  paginate(event) {
    this.api.getAllGeneral(event.page, event.rows, this.search).subscribe((res: Result) => {
      this.general = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  onSave() {
    this.api.postGeneral(this.saveGeneral).subscribe((res) => {
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
    this.api.getGeneralById(id).subscribe((res: Result) => {
      this.saveGeneral = res.payload.data;
    });
  }
  onUpdate(id: number) {
    this.api.putGeneral(id, this.saveGeneral).subscribe((res) => {
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
        this.api.deleteGeneral(id).subscribe((res) => {
          this.getAll();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }

  onSearch(search: any) {
    this.api.getAllGeneral(0, 10, this.search).subscribe((res: Result) => {
      this.general = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
}
