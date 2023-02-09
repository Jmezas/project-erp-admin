import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Result } from "src/app/shared/models/result";
import { Sale } from "src/app/shared/models/sale";
import { SaleService } from "src/app/shared/service/sales/sale.service";
import { GeneralService } from "src/app/shared/service/general.service";
import { ReportService } from "src/app/shared/service/reports/report.service";
import { pdfDefaultOptions } from "ngx-extended-pdf-viewer";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  public closeResult: string;
  public search: string = "";
  public totalRecords: number;
  sale: Sale[];
  invoice: Sale;
  dateStart: string = "";
  dateEnd: string = "";
  rangeDates: Date[];
  date: Date;
  compnay: any;
  base64textString: string;
  pdfSrc;
  constructor(private modalService: NgbModal, private api: SaleService, private company: GeneralService, private apiReport: ReportService) {
    this.getAll();
    this.getComoany();
    //pdfDefaultOptions.assetsFolder = "bleeding-edge";
  }

  ngOnInit() {}
  open(content) {
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
  paginate(event) {
    this.api.getAllSale(event.page, event.rows, this.search, this.dateStart, this.dateEnd).subscribe((res: Result) => {
      this.sale = res.payload.data;
      this.totalRecords = res.payload.total;
    });
  }
  getComoany() {
    this.company.getCompany().subscribe(async (res: Result) => {
      this.compnay = res.payload.data[0];
      this.company["logo"] = "../../../../assets/images/cat3.png";
    });
  }

  onSelect() {
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
  openProducto(content, id) {
    this.generatePDFTicket(id);
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title", size: "lg", centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  generatePDFTicket(id: number) {
    this.apiReport.getPDFTicket(id).subscribe((res: any) => {
      console.log(res);
      this.base64textString = res.pdf;
      var byteCharacters = window.atob(this.base64textString);
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
}
