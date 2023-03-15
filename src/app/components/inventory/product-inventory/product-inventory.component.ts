import { Component } from "@angular/core";
import { DatePipe } from "@angular/common";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Result } from "src/app/shared/models/result";
import { InventoryService } from "src/app/shared/service/inventories/inventory.service";

@Component({
  selector: "app-product-inventory",
  templateUrl: "./product-inventory.component.html",
  styleUrls: ["./product-inventory.component.scss"],
  providers: [DatePipe],
})
export class ProductInventoryComponent {
  movement: [] = [];
  detail: [] = [];
  totalRecords: number;
  search: string = "";
  dateStart: string = "";
  dateEnd: string = "";
  rangeDates: Date[];
  loading: boolean = false;
  closeResult: string;
  constructor(private api: InventoryService, private modalService: NgbModal) {
    this.getAll();
  }
  getAll() {
    this.api.getAllMovementOther(0, 10, "", "", "").subscribe((res: Result) => {
      this.movement = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  onSearch(search: any) {
    this.loading = true;
    this.api.getAllMovementOther(0, 10, this.search.toUpperCase(), this.dateStart, this.dateEnd).subscribe((res: Result) => {
      this.loading = false;
      this.movement = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  paginate(event) {
    this.loading = true;
    this.api.getAllMovementOther(event.page, event.rows, this.search.toUpperCase(), this.dateStart, this.dateEnd).subscribe((res: Result) => {
      this.loading = false;
      this.movement = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  onSelect() {
    console.log(this.rangeDates);
    if (this.rangeDates != null || this.rangeDates != undefined) {
      this.dateStart = this.rangeDates[0].toISOString().slice(0, 10);
      if (this.rangeDates[1] != null) {
        this.dateEnd = this.rangeDates[1].toISOString().slice(0, 10);

        const [year, month, day] = this.dateEnd.split("-");
        this.dateEnd = `${year}-${parseInt(month)}-${parseInt(day)}`;
      }
      const [year, month, day] = this.dateStart.split("-");
      this.dateStart = `${year}-${parseInt(month)}-${parseInt(day)}`;
    } else {
      this.dateStart = "";
      this.dateEnd = "";
    }

    this.api.getAllMovementOther(0, 10, this.search.toUpperCase(), this.dateStart, this.dateEnd).subscribe((res: Result) => {
      this.movement = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  open(content: any, id: number) {
    this.api.getMovementDetail(id).subscribe((res: Result) => {
      this.detail = res.payload.data;
    });
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "xl" }).result.then(
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
}
