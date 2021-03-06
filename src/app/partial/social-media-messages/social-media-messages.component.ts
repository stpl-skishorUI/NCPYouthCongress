import { Component, OnInit } from '@angular/core';
import { CallAPIService } from 'src/app/services/call-api.service';
import { ToastrService } from 'ngx-toastr';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { Alert } from 'selenium-webdriver';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-social-media-messages',
  templateUrl: './social-media-messages.component.html',
  styleUrls: ['./social-media-messages.component.css', '../partial.component.css']
})
export class SocialMediaMessagesComponent implements OnInit {

  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  viewMembersObj: any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText: '' }
  filterForm!: FormGroup;
  allDistrictArray: any;
  socialMediaArray: any;
  memberNameArray: any;
  socialMediaMessagesArray: any;
  socialMediaDetailsArray: any;
  lat: any;
  lng: any;
  zoom: any = 15;
  socialMediaDetailsImageArray: any;
  // defaultToDate: string = '';
  // defaultFromDate: string = '';
  TotalMsg: any;
  FacebookCount: any;
  WhtasAppCount: any;
  socialMediaCount: any;
  Twitter: any;
  comUserdetImg: any;
  programGalleryImg!: GalleryItem[];
  HighlightRow: any;
  searchFilter = "";
  defaultCloseBtn:boolean = false;
  subject: Subject<any> = new Subject();
  previous:any;
  socialMediaDetailsAddress:any;
  socialMediaDetailsLatLongArray: any;
  
  constructor(
    private callAPIService: CallAPIService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public gallery: Gallery,
    private _lightbox: Lightbox,
    private datePipe:DatePipe,
    public dateTimeAdapter: DateTimeAdapter<any>) {
      {dateTimeAdapter.setLocale('en-IN');} }

  ngOnInit(): void {
    this.defaultFilterForm();
    //this.getDistrict();
    this.getMemberName();
    this.getSocialMedia();
    this.GetSocialMediaMessages();
    this.searchFilters('false');
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      memberName: ['0'],
      district: ['0'],
      mediaSource: ['0'],
      fromTo: [['','']],
      searchText:[''],
    })
  }

  GetSocialMediaMessages() {
    this.spinner.show();
    let formData = this.filterForm.value;
    let fromDate: any;
    let toDate: any;
    formData.fromTo[0] != "" ? (fromDate = this.datePipe.transform(formData.fromTo[0], 'dd/MM/yyyy')) : fromDate = '';
    formData.fromTo[1] != "" ? (toDate = this.datePipe.transform(formData.fromTo[1], 'dd/MM/yyyy')) : toDate = '';
    let obj = 'UserId='+this.commonService.loggedInUserId()+'&Districtid=' + formData.district + '&MediaType=' + formData.mediaSource + '&nopage=' + this.paginationNo +
      '&MemberId=' + formData.memberName + '&FromDate=' + fromDate + '&ToDate=' + toDate + '&Search=' + formData.searchText
    // this.callAPIService.setHttp('get', 'Web_GetSocialMediaMessages_Web_2_0_Committee?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.setHttp('get', 'Web_GetSocialMediaMessages_Web_2_0_Committee_with_Search?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      res.data == 0 ? (this.TotalMsg = res.data3[4].TotalMsg) : this.TotalMsg = 0;
      res.data == 0 ? (this.FacebookCount = res.data3[1].TotalMsg) : this.FacebookCount = 0;
      res.data == 0 ? (this.WhtasAppCount = res.data3[0].TotalMsg) : this.WhtasAppCount = 0;
      res.data == 0 ? (this.Twitter = res.data3[2].TotalMsg) : this.Twitter = 0;
      res.data == 0 ? (this.socialMediaCount = res.data3[3].TotalMsg) : this.socialMediaCount = 0;

      if (res.data == 0) {
        this.spinner.hide();
        this.socialMediaMessagesArray = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        this.socialMediaMessagesArray = [];
        // //this.toastrService.error("Data is not available");
      }

    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  clearFilter(flag: any) {
    if (flag == 'member') {
      this.filterForm.controls['memberName'].setValue(0);
    } else if (flag == 'district') {
      this.filterForm.controls['district'].setValue(0);
    } else if (flag == 'media') {
      this.filterForm.controls['mediaSource'].setValue(0);
    }else  if(flag ==  'search'){
      this.filterForm.controls['searchText'].setValue('');
    }else  if(flag ==  'dateRangePIcker'){
      this.defaultCloseBtn = false;
      this.filterForm.controls['fromTo'].setValue(['','']);
    }
    this.paginationNo = 1;
    this.GetSocialMediaMessages();
  }

  filterData(flag:any){
    flag == 'range' ?  this.defaultCloseBtn = true :  this.defaultCloseBtn = false; 
    this.paginationNo = 1;
    this.GetSocialMediaMessages();
  }

  onKeyUpFilter(){
    this.subject.next();
  }

  searchFilters(flag: any) {
    if (flag == 'true') {
      if (this.filterForm.value.searchText == "" || this.filterForm.value.searchText == null) {
        this.toastrService.error("Please search and try again");
        return
      }
    }
    this.subject.pipe(debounceTime(700)).subscribe(() => {
      this.searchFilter = this.filterForm.value.searchText;
      this.paginationNo = 1;
      this.GetSocialMediaMessages();
    }
    );
  }

  getMemberName() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetBodyMemberListHaveSocialMedia_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); //GetMemberddl_Web_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.memberNameArray = res.data1;
      } else {
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0?StateId=' + 1, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrictArray = res.data1;
      } else {
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getSocialMedia() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'GetSocialMediaddl_Web_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.socialMediaArray = res.data1;
      } else {
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getSocialMediaDetails(id: any) {
    this.spinner.show();
    this.socialMediaDetailsAddress = '';
    this.callAPIService.setHttp('get', 'GetSocialMediaMessage_Details_Web_1_0?UserId=' + this.commonService.loggedInUserId() + '&Id=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.socialMediaDetailsArray = res.data1[0];
        this.HighlightRow = this.socialMediaDetailsArray.Id;
        let socialMediaDetailsImageArray = res.data2;
        this.programGalleryImg = socialMediaDetailsImageArray;
        this.programGalleryImg = this.commonService.imgesDataTransform(this.programGalleryImg, 'obj');
        this.gallery.ref().load(this.programGalleryImg);

        this.socialMediaDetailsLatLongArray = res.data3[0];
        this.socialMediaDetailsAddress= res.data3[0]?.LocationName;
        this.latitudeLongitude(this.socialMediaDetailsLatLongArray);
      } else {
        //this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  latitudeLongitude(latlagData: any) { // only Add latLong Array formate
    console.log(this.socialMediaDetailsLatLongArray)
    if (latlagData != "" && latlagData != undefined && latlagData != null) {
      let latLong = [latlagData.Latitude ,latlagData.Longitude]
      this.lat = Number(latLong[0]);
      this.lng = Number(latLong[1]);
    } else {
      this.lat = 19.663280;
      this.lng = 75.300293;
    }
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.GetSocialMediaMessages();
  }

  redToMemberProfile(memberId: any, FullName: any) {
    let obj = { 'memberId': memberId, 'FullName': FullName }
    sessionStorage.setItem('memberId', JSON.stringify(obj));
    this.router.navigate(['../profile'])
  }

  redToSocialMediaPerson(PersonName: any, MemberMobileNo: any) {
    let obj = { 'PersonName': PersonName, 'MemberMobileNo': MemberMobileNo }
    sessionStorage.setItem('SocialMediaDataPM', JSON.stringify(obj));
    this.router.navigate(['../social-media/person-profile'], { relativeTo: this.route });
  }

  clickedMarker(infowindow:any) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infowindow;
 }

}
