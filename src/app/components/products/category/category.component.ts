import { Component, OnInit } from "@angular/core";
import { category } from "../../../shared/models/category";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { DecimalPipe } from "@angular/common";
import { TableService } from "src/app/shared/service/table.service";
import { CategoryService } from "src/app/shared/service/categories/category.service";
import { Result } from "src/app/shared/models/result";
import { Message, MessageService } from "primeng/api";
import Swal from "sweetalert2";
@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
  providers: [TableService, DecimalPipe, MessageService],
})
export class CategoryComponent implements OnInit {
  public closeResult: string;
  public search: string = "";
  category: category[];
  public totalRecords: number;
  edit: boolean = false;
  loading: boolean;
  isloading: boolean = false;
  //message
  msgs1: Message[];

  //create  and edit
  public name: string = "";
  id: number = 0;

  constructor(private modalService: NgbModal, private api: CategoryService) {
    this.getAll();
  }

  open(content, id: number) {
    this.name = "";
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
    this.loading = true;
    this.api.getAllCategories(0, 10, this.search.toUpperCase()).subscribe((res: Result) => {
      this.loading = false;
      this.category = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  getAll() {
    this.loading = true;
    this.api.getAllCategories(0, 10, "").subscribe((res: Result) => {
      this.loading = false;
      this.category = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.loading = true;
    this.api.getAllCategories(event.page, event.rows, this.search.toUpperCase()).subscribe((res: Result) => {
      this.loading = false;
      this.category = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }

  onSave() {
    let category: category = {
      id: 0,
      name: this.name,
    };
    this.isloading = true;
    this.api.postCategory(category).subscribe((res) => {
      this.isloading = false;
      this.getAll();
      Swal.fire({
        icon: "success",
        title: "Se grabo correctamente",
        showConfirmButton: false,
        timer: 1100,
      });
    });
  }
  onGet(id: number) {
    this.id = id;
    this.isloading = true;
    this.api.getCategory(id).subscribe((res: Result) => {
      this.isloading = false;
      this.name = res.payload.data.name;
    });
  }
  onUpdate() {
    let category: category = {
      id: this.id,
      name: this.name,
    };
    this.isloading = true;
    this.api.putCategory(this.id, category).subscribe((res) => {
      this.isloading = false;

      this.getAll();
      Swal.fire({
        icon: "success",
        title: "Se actualizo correctamente",
        showConfirmButton: false,
        timer: 1100,
      });
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
        this.api.deleteCategory(id).subscribe((res) => {
          this.getAll();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }

  ngOnInit() {}
}
