import { Component } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Result } from "src/app/shared/models/result";
import { MenuService } from "src/app/shared/service/menus/menu.service";

@Component({
  selector: "app-menus",
  templateUrl: "./menus.component.html",
  styleUrls: ["./menus.component.scss"],
})
export class MenusComponent {
  closeResult: string;
  search: string = "";
  roles: [];
  totalRecords: number;
  edit: boolean = false;
  constructor(private modalService: NgbModal, private api: MenuService) {
    this.getAll();
  }
  open(content, id: number) {
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

  onSearch(search: any) {
    this.api.getAllMenu(0, 10, this.search).subscribe((res: Result) => {
      this.roles = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  getAll() {
    this.api.getAllMenu(0, 10, "").subscribe((res: Result) => {
      this.roles = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.api.getAllMenu(event.page, event.rows, this.search).subscribe((res: Result) => {
      this.roles = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  onGet(id: number) {
    this.api.getMenuById(id).subscribe((res: Result) => {});
  }
  onSave() {}
  onUpdate() {}
  onDelete(id: number) {}
}
