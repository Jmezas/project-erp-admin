import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormGroup } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Product } from "src/app/shared/models/products";
import { Result } from "src/app/shared/models/result";
import { CategoryService } from "src/app/shared/service/categories/category.service";
import { GeneralService } from "src/app/shared/service/general.service";
import { ProductService } from "src/app/shared/service/products/product.service";
import { UnitService } from "src/app/shared/service/units/unit.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { category } from "src/app/shared/models/category";
import { Unit } from "src/app/shared/models/unit";
import { General } from "src/app/shared/models/general";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"],
})
export class AddProductComponent implements OnInit {
  public productForm: UntypedFormGroup;
  public Editor = ClassicEditor;
  public counter: number = 1;
  category: any = [];
  unit: any = [];
  general: any = [];
  id: number = 0;
  edit: boolean = false;
  files: File[] = [];
  selectedCategory: category;
  selectedUnit: Unit;
  selectedOperation: General;

  public url = [
    {
      img: "assets/images/user.png",
    },
    {
      img: "assets/images/user.png",
    },
    {
      img: "assets/images/user.png",
    },
    {
      img: "assets/images/user.png",
    },
    {
      img: "assets/images/user.png",
    },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private apiCategory: CategoryService,
    private apiUnit: UnitService,
    private apiGeneral: GeneralService,
    private api: ProductService,
    private router: Router
  ) {
    this.createform();
    this.getcategory();
    this.getunit();
    this.getGeneral();
    if (this.api.producto != 0) this.getProduct();
    this.productForm.patchValue({
      price_cuarto: 0,
      price_media: 0,
      price_docena: 0,
      price_caja: 0,
      quantity_caja: 0,
    });
  }

  createform() {
    this.productForm = this.fb.group({
      name: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+[a-zA-Z]$"), Validators.minLength(3)],
      ],
      code: ["", [Validators.required, Validators.minLength(3)]],
      price_sale: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      price_purchase: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      discount: ["", [Validators.required, Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")]],
      category: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      operation_type: ["", Validators.required],
      description: [""],
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

  onSelect(event) {
    console.log(event);
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
  onSave() {
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
      id: this.id,
      name: data.name,
      code: data.code,
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
      image: data.image || null,
    };
    console.log(proucto);
    if (this.productForm.invalid) {
      return Object.values(this.productForm.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }

    this.api.postProduct(proucto).subscribe((res: Result) => {
      this.productForm.reset();
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

  getProduct() {
    this.edit = true;
    this.api.getProductById(this.api.producto).subscribe((res: Result) => {
      this.productForm.patchValue({
        id: res.payload.data.id,
        name: res.payload.data.name,
        code: res.payload.data.code,
        price_sale: res.payload.data.price_sale,
        price_purchase: res.payload.data.price_purchase,
        discount: res.payload.data.discount,
        category: res.payload.data.category,
        unit: res.payload.data.unit,
        operation_type: res.payload.data.operation_type,
        description: res.payload.data.description,
        price_cuarto: res.payload.data.price_cuarto,
        price_media: res.payload.data.price_media,
        price_docena: res.payload.data.price_docena,
        price_caja: res.payload.data.price_caja,
        quantity_caja: res.payload.data.quantity_caja,
      });
      this.id = res.payload.data.id;
    });
  }
  onUpdate() {
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
      id: this.id,
      name: data.name,
      code: data.code,
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
      image: data.image || null,
    };
    this.api.putProduct(this.id, proucto).subscribe((res: Result) => {
      //this.productForm.reset();
      Swal.fire({
        title: "Producto actualizado!",
        text: "deseas volver a lista de productos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ir a productos!",
        cancelButtonText: "¿Seguir editando?",
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(["/products/product-list"]);
        }
      });
    });
  }
  ngOnInit() {}
}
