import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../dialogs/delete/delete.component';
import { DateTimeAdapter } from 'ng-pick-datetime';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css', '../partial.component.css']
})
export class NotificationsComponent implements OnInit {
  subject: Subject<any> = new Subject();
  notificationForm!: FormGroup;
  submitted = false;
  allLevels: any;
  memberNameArray: any;
  filterForm!: FormGroup;
  allDistrict: any;
  viewMembersObj:any = { DistrictId: 0, Talukaid: 0, villageid: 0, SearchText:''}
  getTalkaByDistrict: any;
  resultVillageOrCity: any;
  notificationscopeArray: any;
  notificationArray: any;
  paginationNo: number = 1;
  pageSize: number = 10;
  searchFilter = "";
  defaultCloseBtn:boolean = false;
  total:any;
  imgName: any;
  ImgUrl: any;
  getImgExt: any;
  selectedFile: any;
  NotificationText:string =  "Push";
  getImgPath:any;
  NotificationId:any;
  ScopeId:any;
  MemberIdEdit:any;
  getBodyOrgCellName:any;
  globalMemberId:any[]= [];
  NewsId:any;
  @ViewChild('clickPushModal') clickPushModal:any;
  IsChangeImage:boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  schedulerFlag:boolean = false;
  minDate: any = new Date();
  IspushedFlag:any = 0;

  constructor(
    private callAPIService: CallAPIService, 
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe:DatePipe,
    public dialog: MatDialog,
    public dateTimeAdapter: DateTimeAdapter<any>) {
      {dateTimeAdapter.setLocale('en-IN');} }

  ngOnInit(): void {
    this.customForm();
    this.getLevel();
    this.defaultFilterForm();
    this.gerNotificationscope();
    this.getNotificationData();
    this.searchFilters('false');
  }

  customForm() {
    this.notificationForm = this.fb.group({
      Id:[0],
      CreatedBy:[this.commonService.loggedInUserId()],
      ScopeId: ['', Validators.required], 
      Title: ['', Validators.required],
      Description: ['', Validators.required],
      ImageUrl: [''],
      Link: [''], 
      DistrictId: [''],
      BodyId:[''],
      MemberStr: [],
      NotificationDate:['']
    })
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      fromTo: [['','']],
      ScopeId: [0],
      searchText:[''],
    })
  }

  get f() { return this.notificationForm.controls };
  
  onSubmit(){
    this.valiationForScheduler();
    this.spinner.show();
    this.submitted = true;
    if (this.notificationForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      this.globalMemberId = [];
      let fromData = new FormData();
      let notificationFlag:any;
      let ImageChangeFlag:any;
      if(this.IsChangeImage || this.selectedFile){
        notificationFlag = 2;
        ImageChangeFlag = 1 
      }else{
        notificationFlag = 1;
        ImageChangeFlag = 0
      }
      let getObj:any = this.notificationForm.value;

      let fillSelection:any;
      if(getObj.ScopeId == 4){
        fillSelection = getObj.MemberStr
      }else if (getObj.ScopeId == 3){
        fillSelection = getObj.BodyId
      }else if (getObj.ScopeId == 2){
        fillSelection = getObj.DistrictId
      }
      
      if(getObj.ScopeId == 4 || getObj.ScopeId == 3 || getObj.ScopeId == 2){
        fillSelection.map((ele:any)=>{
          this.globalMemberId.push({"MemberId":ele});
        })
      }
      let id:any;
      getObj.Id ? id = getObj.Id : id = 0;
      let convertDate:any;
      let NotificationDate:any;
      if(getObj.NotificationDate){
        NotificationDate = this.datePipe.transform(getObj.NotificationDate, 'dd/MM/YYYY HH:mm');
        // convertDate = NotificationDate.split(':');
        convertDate = NotificationDate;
      }else{
        NotificationDate = this.datePipe.transform(new Date, 'dd/MM/YYYY HH:mm');
        // convertDate= NotificationDate.split(':');
        convertDate= NotificationDate;
      }
      fromData.append('Id', id);
      fromData.append('CreatedBy', this.commonService.loggedInUserId());
      fromData.append('ScopeId', getObj.ScopeId);
      fromData.append('Title', getObj.Title);
      fromData.append('Description', getObj.Description);
      fromData.append('ImageUrl', getObj.ImageUrl ? this.selectedFile : '');
      fromData.append('Link', getObj.Link);
      fromData.append('MemberStr', JSON.stringify(this.globalMemberId));
      fromData.append('AttchmentStr', this.selectedFile ? this.selectedFile : '');
      fromData.append('NotificationType', notificationFlag);
      fromData.append('IsChangeImage',  ImageChangeFlag );
      // fromData.append('NotificationDate', convertDate[0]+":00");
      fromData.append('NotificationDate', convertDate);
      fromData.append('IsPushed',  this.IspushedFlag);


      this.callAPIService.setHttp('post', 'InsertNotification_Web_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.deleteImg();
          this.IsChangeImage = false;
          this.submitted = false;
          this.notificationForm.reset();
          // let modalClick = this.clickPushModal.nativeElement;
          // modalClick.click();
          this.toastrService.success(res.data1[0].Msg);
          this.pushMotificationStatus(res.data1[0].ID, res.data1[0].ScopeId);
          // this.pushMotificationStatus(getObj?.Id, getObj?.ScopeId)
          this.schedulerFlag = false;
          this.getNotificationData();
          this.resetNotificationForm();
        } else {
          this.spinner.hide();
        }
      } ,(error:any) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.router.navigate(['../500'], { relativeTo: this.route });
        }
      })
    }
  }

  addValidationOn(scodeId: any) {
    if (scodeId == 2) {
      this.validationRemove();
      this.getDistrict();
      this.notificationForm.controls["DistrictId"].setValidators(Validators.required);
      this.notificationForm.controls["DistrictId"].updateValueAndValidity();
      this.notificationForm.controls['DistrictId'].clearValidators();
    } else if (scodeId == 3) {
      this.validationRemove();
      this.getOrgName()
      this.notificationForm.controls["BodyId"].setValidators(Validators.required);
      this.notificationForm.controls["BodyId"].updateValueAndValidity();
      this.notificationForm.controls['BodyId'].clearValidators();
    } else if (scodeId == 4) {
      this.validationRemove();
      this.getMemberName();
      this.notificationForm.controls["MemberStr"].setValidators(Validators.required);
      this.notificationForm.controls["MemberStr"].updateValueAndValidity();
      this.notificationForm.controls['MemberStr'].clearValidators();
    } else{
      this.validationRemove();
    }
  }
  
  validationRemove() {
    this.notificationForm.controls['DistrictId'].clearValidators();
    this.notificationForm.controls["DistrictId"].updateValueAndValidity();
    this.notificationForm.controls['DistrictId'].setValue('');
    this.notificationForm.controls['BodyId'].clearValidators();
    this.notificationForm.controls["BodyId"].updateValueAndValidity();
    this.notificationForm.controls['MemberStr'].setValue('');
    this.notificationForm.controls['MemberStr'].clearValidators();
    this.notificationForm.controls['MemberStr'].updateValueAndValidity();
    this.notificationForm.controls['BodyId'].setValue('');
  }

  editNotification(data:any){
    if(data.IsPushed == 2){
      this.schedulerFlag = true;
    }else{
      this.schedulerFlag = false;
    }
    
    this.NotificationText = "Update";
    this.getImgPath = data.AttachmentPath;
   
    this.addValidationOn(data.ScopeId);

    if(data.ScopeId == 4){
      data.MemberStr = data.MemberStr.split(",").map((item:any)=> {
        return parseInt(item);
    });
    }else if (data.ScopeId == 3){
      data.BodyId =   data.MemberStr.split(",").map((item:any)=> {
        return parseInt(item);
    });
    }else if (data.ScopeId == 2){
      data.DistrictId =   data.MemberStr.split(",").map((item:any)=> {
        return parseInt(item);
    });
    }
    let dateTransForm:any = data.NotificationDate.split(" ");
    let datefomratChange:any = this.datePipe.transform(this.commonService.dateFormatChange(dateTransForm[0]), 'yyyy/MM/dd');

    this.notificationForm.patchValue({
      AttachmentPath: data.AttachmentPath,
      Description: data.Description,
      Id: data.Id,
      Link: data.Link,
      MemberScope: data.MemberScope,
      NotificationType: data.NotificationType.toString(),
      ScopeId: data.ScopeId,
      ScopeName: data.ScopeName,
      SrNo: data.SrNo,
      Title: data.Title,
      MemberStr:data.MemberStr,
      NotificationDate:new Date(Date.parse(datefomratChange+" "+dateTransForm[1])),
      BodyId:data.BodyId,
      DistrictId:data.DistrictId,
    })
 
    if (data.ScopeId == 2) {
     this.getDistrict();
     this.notificationForm.controls["DistrictId"].setValue(this.notificationForm.value.DistrictId);
    } else if (data.ScopeId == 3) {
      this.notificationForm.controls["BodyId"].setValidators(Validators.required);
      this.notificationForm.controls["BodyId"].updateValueAndValidity();
      this.notificationForm.controls['BodyId'].clearValidators();
      this.notificationForm.controls["BodyId"].setValue(this.notificationForm.value.BodyId);
    } else if (data.ScopeId == 4) {
      this.getMemberName();
      this.notificationForm.controls["MemberStr"].setValue(this.notificationForm.value.MemberStr);
    }  
  }

  resetNotificationForm(){
    this.NotificationText= "Push";
    this.submitted = false;
    this.paginationNo = 1;
    this.getImgPath = null;
    this.notificationForm.reset();
  }


  deleteImg(){
    this.selectedFile = "";
    this.getImgPath = "";
    this.fileInput.nativeElement.value = '';
    this.IsChangeImage = true;
  }
  
  delNotConfirmation(NewsId:any){
    this.NewsId = NewsId;
    this.deleteConfirmModel();
  }

  deleteConfirmModel() {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'Yes'){
        this.deleteNotifications();
      }
    });
  }

  deleteNotifications(){
    this.callAPIService.setHttp('get', 'Delete_Notification_Web_1_0?NewsId='+this.NewsId+'&CreatedBy='+this.commonService.loggedInUserId(), false, false , false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.toastrService.success(res.data1[0].Msg);
        this.getNotificationData();
        this.resetNotificationForm();
      } else {
        // this.toastrService.error(res.data1[0].Msg)
        this.spinner.hide();
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  pushMotificationStatus(id:any,scopeId:any){
    this.NotificationId = id;
    this.ScopeId = scopeId;
  }

  pushMotification(){
    this.callAPIService.setHttp('get', 'Push_SendNotification_1_0?UserId='+this.commonService.loggedInUserId()+'&NotificationId='+this.NotificationId+'&ScopeId='+this.ScopeId, false, false , false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.toastrService.success(res.data1);
        this.getNotificationData();
      } else {
       // this.toastrService.error('Something went wrong please try again');
        this.spinner.hide();
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getLevel() {
    // this.spinner.show();
    // this.callAPIService.setHttp('get', 'Web_GetLevel_1_0', false, false, false, 'ncpServiceForWeb');
    // this.callAPIService.getHttp().subscribe((res: any) => {
    //   if (res.data == 0) {
    //     this.spinner.hide();
    //     this.allLevels = res.data1;
    //   } else {
    //       //this.toastrService.error("Data is not available");
    //   }
    // } ,(error:any) => {
    //   if (error.status == 500) {
    //     this.router.navigate(['../500'], { relativeTo: this.route });
    //   }
    // })
  }

  getMemberName() {
    this.spinner.show();    
    this.callAPIService.setHttp('get', 'GetMemberddl_Web_1_0?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.memberNameArray = res.data1;
        // if(this.NotificationText == 'update'){
        //   this.notificationForm.controls['MemberStr'].setValue('');
        // }
        
      } else {
          //this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  
  getOrgName() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetBodyOrgCellName_1_0_Committee?UserId='+this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetBodyOrgCellName_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.getBodyOrgCellName = res.data1;
      } else {
          //this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getDistrict() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0_Committee?StateId=' + 1 +'&UserId='+this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); // old API Web_GetDistrict_1_0
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDistrict = res.data1;
      } else {
          this.toastrService.error("Data is not available 2");
      }
    } ,(error:any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }


  gerNotificationscope() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Notificationscope', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.notificationscopeArray = res.data1;
      } else {
        this.spinner.hide();
          //this.toastrService.error("Data is not available");
      }
    } ,(error:any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }


  clearFilter(flag:any){
    if(flag ==  'notifications'){
      this.filterForm.controls['ScopeId'].setValue(0);
    }else  if(flag ==  'search'){
      this.filterForm.controls['searchText'].setValue('');
    }else  if(flag ==  'dateRangePIcker'){
      this.defaultCloseBtn = false;
      this.filterForm.controls['fromTo'].setValue(['','']);
    }
    this.paginationNo = 1;
    this.getNotificationData();
  }

  filterData(flag:any){
    flag == 'range' ?  this.defaultCloseBtn = true :  this.defaultCloseBtn = false; 
    this.paginationNo = 1;
    this.getNotificationData();
  }

  getNotificationData(){
    let getObj:any = this.filterForm.value;
    this.spinner.show();
    let fromDate: any;
    let toDate: any;
    getObj.fromTo[0] != "" ? (fromDate = this.datePipe.transform(getObj.fromTo[0], 'dd/MM/yyyy')) : fromDate = '';
    getObj.fromTo[1] != "" ? (toDate = this.datePipe.transform(getObj.fromTo[1], 'dd/MM/yyyy')) : toDate = '';
    this.callAPIService.setHttp('get', 'GetNotification_Web_1_0?UserId='+this.commonService.loggedInUserId()+'&PageNo='+this.paginationNo+'&FromDate='+fromDate+'&ToDate='+toDate+'&ScopeId='+getObj.ScopeId+'&SearchText='+getObj.searchText, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.notificationArray = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.notificationArray = [];
        this.spinner.hide();
      }
    } ,(error:any) => {
      this.notificationArray = [];
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

 
  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getNotificationData();
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
      this.getNotificationData();
    }
    );
  }

  
  choosePhoto() {
    let clickPhoto: any = document.getElementById('my_file')
    clickPhoto.click();
  }

  readUrl(event: any) {
    let selResult = event.target.value.split('.');
    this.getImgExt = selResult.pop();
    this.getImgExt.toLowerCase();
    if (this.getImgExt == "png" || this.getImgExt == "jpg" || this.getImgExt == "jpeg") {
      this.selectedFile = <File>event.target.files[0];
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.ImgUrl = event.target.result;
          this.getImgPath = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        this.imgName = event.target.files[0].name;
      }
    }
    else {
      this.toastrService.error("Profile image allowed only jpg or png format");
    }
  }

  openInputFile() {
    let clickInputFile = document.getElementById("img-upload");
    clickInputFile?.click();
  }

  checkBoxScheduler(event: any) {
    if (event.target.checked) {
      this.schedulerFlag = true;
      this.IspushedFlag = 2;
    } else {
      this.IspushedFlag = 0;
      this.schedulerFlag = false;
    }
  }

  valiationForScheduler(){
    if (this.schedulerFlag) {
      this.notificationForm.controls["NotificationDate"].setValidators(Validators.required);
      this.notificationForm.controls["NotificationDate"].updateValueAndValidity();
      this.notificationForm.controls['NotificationDate'].clearValidators();
    }else{
      this.notificationForm.controls['NotificationDate'].clearValidators();
      this.notificationForm.controls["NotificationDate"].updateValueAndValidity();
    }
  }
  
}
