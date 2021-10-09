import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
declare var $: any;
// import { jsPDF } from "jspdf";

@Component({
  selector: 'app-member-report',
  templateUrl: './member-report.component.html',
  styleUrls: ['./member-report.component.css', '../../partial.component.css']
})
export class MemberReportComponent implements OnInit {
  @ViewChild('pdfTable', {static: false}) pdfTable!: ElementRef;
  filterForm!:FormGroup;
  memberNameArray:any;
  defaultCloseBtn: boolean = false;
  resActivitiesReport:any;
  profileInfo:any;
  comUserdetImg:any;
  programGalleryImg!: GalleryItem[];
  @ViewChild('content') content!: ElementRef;

  constructor(  private spinner: NgxSpinnerService, private route: ActivatedRoute,    private datePipe: DatePipe,
    private toastrService: ToastrService, private router: Router, private commonService: CommonService,public gallery: Gallery,
    private _lightbox: Lightbox,
    private callAPIService: CallAPIService, public datepipe: DatePipe, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.getMemberName();
    this.defaultFilterForm();
    this.getMemberDetails();
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      MemberId: [28],
      FromDate: [''],
      ToDate: [''],
      fromToDate: [''],
    })
  }

  getMemberDetails(){
    this.spinner.show();
    let data = this.filterForm.value;
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesReport?MemberId=' + data.MemberId+'&FromDate='+ data.FromDate+'&ToDate='+ data.ToDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.profileInfo = res.data1[0];
        this.resActivitiesReport = res.data2;

        let programDetailsImagesArray = res.data2;
        this.programGalleryImg = programDetailsImagesArray;
        this.programGalleryImg =   this.commonService.imgesDataTransform(this.programGalleryImg,'obj');
        this.gallery.ref().load(this.programGalleryImg);
      } else {
        this.toastrService.error("Data is not available 2");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getMemberName() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'GetMemberddl_Web_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.memberNameArray = res.data1;
      } else {
        this.spinner.hide();
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  selDateRangeByFilter(getDate: any) {
    this.defaultCloseBtn = true;
    this.filterForm.value.fromDate = this.datePipe.transform(getDate[0], 'dd/MM/yyyy');
    this.filterForm.value.toDate = this.datePipe.transform(getDate[1], 'dd/MM/yyyy');
    this.getMemberDetails();
  }

  clearFilter(flag: any) {
    if (flag == 'member') {
      this.filterForm.controls['member'].setValue(0);
    } else if (flag == 'dateRangePIcker') {
      this.filterForm.controls['fromToDate'].setValue(['', '']);
      this.defaultCloseBtn = false;
    }
    this.getMemberDetails()
  }

  filterData() {
    this.getMemberDetails()
  }

  printPage() {
    window.print();
  }



  // makePdf() {
  //   console.log(this.content.nativeElement);
  //   let doc: any = new jsPDF('p', 'pt', 'a4');
  //   doc.addHTML(this.content.nativeElement, function() {
  //     doc.save("obrz.pdf");
  //   });
  // }
}