import { Component } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Result } from "src/app/shared/models/result";
import { CategoryService } from "src/app/shared/service/categories/category.service";
import { SubCategoryService } from "src/app/shared/service/sub-categories/sub-category.service";
import { category } from "src/app/shared/models/category";
import { SubCategory } from "src/app/shared/models/sub-category";
import Swal from "sweetalert2";

@Component({
  selector: "app-sub-category",
  templateUrl: "./sub-category.component.html",
  styleUrls: ["./sub-category.component.scss"],
})
export class SubCategoryComponent {
  public closeResult: string;
  public search: string = "";
  Subcategory: SubCategory[];
  category: category[];

  public totalRecords: number;
  edit: boolean = false;

  //create  and edit
  public name: string = "";
  id: number = 0;

  //filter category
  selectedCategory: category;
  //save
  saveSubcategory: SubCategory;

  isloading: boolean = false;
  loading: boolean;
  constructor(
    private modalService: NgbModal,
    private api: SubCategoryService,
    private apiCategory: CategoryService
  ) {
    this.getAll();
    this.getCategory();
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

  getAll() {
    this.loading = true;
    this.api.getAllSubCategories(0, 10, "").subscribe((res: Result) => {
      this.loading = false;
      this.Subcategory = res.payload.data;
      this.totalRecords = res.payload.total;
      console.log(this.Subcategory);
    });
  }
  getCategory() {
    this.apiCategory.getCategories().subscribe((res: Result) => {
      console.log(res);
      this.category = res.payload.data;
    });
  }
  paginate(event) {
    this.loading = true;
    this.api
      .getAllSubCategories(event.page, event.rows, this.search.toUpperCase())
      .subscribe((res: Result) => {
        this.loading = false;
        this.Subcategory = res.payload.data;
        this.totalRecords = res.payload.total;
      });
  }
  onSave() {
    let Subcategory: SubCategory = {
      id: 0,
      name: this.name,
      category: this.selectedCategory,
    };
    this.isloading = true;

    this.api.postSubCategory(Subcategory).subscribe((res) => {
      this.isloading = false;
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
    this.isloading = true;
    this.api.getSubCategory(id).subscribe((res: Result) => {
      this.isloading = false;
      this.name = res.payload.data.name;
      //this.selectedCategory = res.payload.data.category;
      let ent = this.category.find((e) => e.id == res.payload.data.category.id);
      this.selectedCategory = { id: ent.id, name: ent.name };
    });
  }
  onUpdate() {
    this.isloading = true;
    let Subcategory: SubCategory = {
      id: this.id,
      name: this.name,
      category: this.selectedCategory,
    };

    this.api.putSubCategory(this.id, Subcategory).subscribe((res) => {
      this.isloading = false;
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
        this.isloading = true;
        this.api.deleteSubCategory(id).subscribe((res) => {
          this.isloading = true;
          this.getAll();
          Swal.fire("Borrado!", "Tu registro ha sido borrado.", "success");
        });
      }
    });
  }

  onSearch(search: any) {
    this.api.getAllSubCategories(0, 10, this.search.toUpperCase()).subscribe((res: Result) => {
      this.Subcategory = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
}
