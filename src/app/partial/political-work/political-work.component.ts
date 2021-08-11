import { Component, OnInit } from '@angular/core';
import { CallAPIService } from 'src/app/services/call-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { DateTimeAdapter } from 'ng-pick-datetime';
@Component({
  selector: 'app-political-work',
  templateUrl: './political-work.component.html',
  styleUrls: ['./political-work.component.css', '../partial.component.css']
})
export class PoliticalWorkComponent implements OnInit {
  memberNameArray: any;
  politicalWorkArray: any;
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  viewMembersObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
  filterForm!: FormGroup;
  defaultToDate: string = '';
  defaultFromDate: string = '';
  minDate = new Date();
  defaultCloseBtn: boolean = false;
  globalMemberId: number = 0;
  PoliticalWork:any; 
  newsLetters:any; 
  PersonalHelp:any; 
  partyPrograms:any; 
  Helpme:any; 
  TotalWorks:any; 
  socialMediaCount: any;
  socialMediaArray:any;

  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dateTimeAdapter: DateTimeAdapter<any>,
  ) { { dateTimeAdapter.setLocale('en-IN') } }

  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.defaultFilterForm();
    this.getPoliticalWork();
    this.getMemberName();
    this.getSocialMedia();
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      memberName: [0],
      fromTo: [''],
      workType: [0], //workType == categoryid
    })
  }

  selDateRangeByFilter(getDate: any) {
    this.defaultCloseBtn = true;
    this.defaultFromDate = getDate[0];
    this.defaultToDate = getDate[1];
    // this.paginationNo = 1 ; 
    this.getPoliticalWork();
  }


  clearValue() {
    this.defaultCloseBtn = false;
    // this.defaultToDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    // this.defaultFromDate = new Date(Date.now() + - 365 * 24 * 60 * 60 * 1000);
    this.filterForm.controls['fromTo'].setValue(['', '']);
    this.paginationNo = 1;
    this.getPoliticalWork();

  }

  getPoliticalWork() {
    debugger;
    let formData = this.filterForm.value;
    this.spinner.show();
    let obj = 'categoryid=' + formData.workType + '&nopage=' + this.paginationNo + '&MemberId=' + formData.memberName + '&FromDate=' + this.defaultFromDate + '&ToDate=' + this.defaultToDate
    this.callAPIService.setHttp('get', 'GetPoliticalWork_Web_1_0?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      console.log(res);
      res.data == 0 ? (this.PoliticalWork = res.data3[0].Totalwork) : this.PoliticalWork = 0;
      res.data == 0 ? (this.newsLetters = res.data3[1].Totalwork) : this.newsLetters = 0;
      res.data == 0 ? (this.socialMediaCount = res.data3[2].Totalwork) : this.socialMediaCount = 0;
      res.data == 0 ? (this.PersonalHelp = res.data3[3].Totalwork) : this.PersonalHelp = 0;
      res.data == 0 ? (this.partyPrograms = res.data3[4].Totalwork) : this.partyPrograms = 0;
      res.data == 0 ? (this.Helpme = res.data3[5].Totalwork) : this.Helpme = 0;
      res.data == 0 ? (this.TotalWorks = res.data3[6].Totalwork) : this.TotalWorks = 0;
      if (res.data == 0) {
        this.spinner.hide();
        this.politicalWorkArray = res.data1;
        console.log(this.politicalWorkArray);
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        this.politicalWorkArray = [];
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
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
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getPoliticalWorkById() {
    this.paginationNo = 1;
    this.getPoliticalWork()
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getPoliticalWork()
  }

  // redToMemberProfile(memberId:any){
  //   localStorage.setItem('memberId', memberId)
  //   this.router.navigate(['../master/member-profile'], {relativeTo:this.route})
  // }

  filterData(){
    this.getPoliticalWork()
  }

  clearFilter(flag: any) {
    if (flag == 'member') {
      this.filterForm.controls['memberName'].setValue(0);
    } else if (flag == 'district') {
      this.filterForm.controls['district'].setValue(0);
    } else if (flag == 'media') {
      this.filterForm.controls['workType'].setValue(0);
    }
    this.paginationNo = 1;
    this.getPoliticalWork()
  }

  getSocialMedia() {
    this.spinner.show();    
    this.callAPIService.setHttp('get', 'GetSocialMediaddl_Web_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.socialMediaArray = res.data1;
      } else {
          this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

}
