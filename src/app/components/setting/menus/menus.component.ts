import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Result } from "src/app/shared/models/result";
import { MenuService } from "src/app/shared/service/menus/menu.service";
import Swal from "sweetalert2";

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
  menuForm: UntypedFormGroup;
  menu: [];
  tipo: any[] = [
    { id: "sub", name: "sub" },
    { id: "link", name: "link" },
  ];
  id: number = 0;
  constructor(private modalService: NgbModal, private api: MenuService, private fb: UntypedFormBuilder) {
    this.getAll();
    this.getMenus();
    this.createForm();
  }

  createForm() {
    this.menuForm = this.fb.group({
      code_menu: [],
      name: ["", [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"), Validators.minLength(3)]],
      path: [""],
      icon: ["", [Validators.required, Validators.minLength(2)]],
      type: ["", [Validators.required]],
      order: ["", [Validators.required]],
    });
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
    this.api.getAllMenu(0, 10, this.search.toUpperCase()).subscribe((res: Result) => {
      this.roles = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  getAll() {
    this.api.getAllMenu(0, 25, "").subscribe((res: Result) => {
      this.roles = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.api.getAllMenu(event.page, event.rows, this.search.toUpperCase()).subscribe((res: Result) => {
      this.roles = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  onGet(id: number) {
    this.api.getMenuById(id).subscribe((res: Result) => {
      this.menuForm.patchValue({
        code_menu: res.payload.data.code_menu,
        name: res.payload.data.name,
        path: res.payload.data.path,
        icon: res.payload.data.icon,
        type: res.payload.data.type,
        order: res.payload.data.order,
      });
      this.id = id;
    });
  }
  getMenus() {
    this.api.getMenu().subscribe((res: Result) => {
      this.menu = res.payload.data;
    });
  }
  onSave() {
    if (this.menuForm.invalid) {
      return Object.values(this.menuForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    let menu = {
      code_menu: this.menuForm.value.code_menu,
      name: this.menuForm.value.name,
      path: this.menuForm.value.path,
      icon: this.menuForm.value.icon,
      type: this.menuForm.value.type,
      order: this.menuForm.value.order,
    };
    console.log(menu);
    this.api.postMenu(menu).subscribe((res: Result) => {
      this.clean();
      Swal.fire("Menu", "Menu creado con exito", "success");
    });
  }
  onUpdate() {
    if (this.menuForm.invalid) {
      return Object.values(this.menuForm.controls).forEach((control) => {
        if (control instanceof UntypedFormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    let menu = {
      code_menu: this.menuForm.value.code_menu,
      name: this.menuForm.value.name,
      path: this.menuForm.value.path,
      icon: this.menuForm.value.icon,
      type: this.menuForm.value.type,
      order: this.menuForm.value.order,
    };
    console.log(menu);
    this.api.putMenu(this.id, menu).subscribe((res: Result) => {
      this.clean();
      Swal.fire("Menu", "Menu actualizado con exito", "success");
    });
  }
  onDelete(id: number) {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, bórralo!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteMenu(id).subscribe((res: Result) => {
          this.getAll();
          Swal.fire("Eliminado!", "El menu ha sido eliminado.", "success");
        });
      }
    });
  }

  clean() {
    this.modalService.dismissAll();
    this.menuForm.reset();
    this.getAll();
    this.getMenus();
  }
}
