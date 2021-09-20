import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CommonService } from 'src/app/services/common.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivityDetailsComponent } from '../../../dialogs/activity-details/activity-details.component';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css', '../../../partial.component.css']
})
export class OrganizationDetailsComponent implements OnInit {
  bodyMember!: FormGroup;
  globalDistrictId: any;
  allDistrict: any;
  resAllMember: any;
  getTalkaByDistrict: any;
  resultVillageOrCity: any;
  submitted: boolean = false;
  items: string[] = [];
  villageCityLabel = "Village";
  setVillOrCityId = "VillageId";
  setVillOrcityName = "VillageName";
  bodyMemberDetails: any;
  bodyMemberFilterDetails: any;
  allDesignatedMembers: any;
  TotalWorkAndIosCount: any;
  prevDesMembers: any[] = [];
  resBodyMemAct: any;
  resultBodyMemActGraph: any;
  imgStringToArray: any;
  DesignationNameBYBodyId: any;
  bodyId: any;
  resultPrevDesMembers: any;
  getPreDesMembersArray: any[] = [];
  resultBodyMemActDetails: any;
  paginationNo: number = 1;
  total: any;
  pageSize: number = 10;
  resWorkcategory: any;
  filter!: FormGroup;
  globalMemberId: number = 0;
  globalCategoryId: number = 0;
  dataAddEditMember: any;
  @ViewChild('addMemberModal') addMemberModal: any;
  @ViewChild('closeAddMemberModal') closeAddMemberModal: any;
  lat: any = 19.75117687556874;
  lng: any = 75.71630325927731;
  getCommitteeName: any;
  toDate: any = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
  fromDate: any = this.datepipe.transform(new Date(Date.now() + -6 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy');
  zoom: any = 4;
  maxDate: any = new Date();
  addMemberFlag: any;
  selUserpostbodyId: any;
  periodicChart: any;
  defaultCloseBtn: boolean = false;
  comUserdetImg: any;
  designationArray: any[] = [];

  constructor(private fb: FormBuilder, private callAPIService: CallAPIService,
    private router: Router, private route: ActivatedRoute,
    private spinner: NgxSpinnerService, public dateTimeAdapter: DateTimeAdapter<any>,
    private toastrService: ToastrService,
    public location: Location, private datePipe: DatePipe,
    public dialog: MatDialog,
    private commonService: CommonService, public datepipe: DatePipe,) {
    let getsessionStorageData: any = sessionStorage.getItem('bodyId');
    getsessionStorageData = JSON.parse(getsessionStorageData);
    this.bodyId = getsessionStorageData.bodyId;
    this.getCommitteeName = getsessionStorageData.BodyOrgCellName;
    { dateTimeAdapter.setLocale('en-IN') }
  }

  ngOnInit(): void {
    this.defaultFilterForm()
    this.defaultBodyMemForm();
    this.getAllBodyMember();
    this.getBodyMemberFilterDetails(this.bodyId);
    this.getCurrentDesignatedMembers(this.bodyId);
    this.getBodyMemeberActivities(this.bodyId);
    this.getBodyMemeberGraph(this.bodyId);
    this.getWorkcategoryFilterDetails(this.bodyId);
    this.activitiesPerodicGraph(this.bodyId);
  }

  defaultFilterForm() {
    this.filter = this.fb.group({
      memberName: [0],
      workType: [0],
      fromTodate: [['', '']],
    })
  }

  filterForm(text: any, flag: any) {
    if (flag == "member") {
      this.globalMemberId = text;
    } else if (flag == "workType") {
      this.globalCategoryId = text;
    }
    this.getBodyMemeberActivities(this.bodyId);

  }


  defaultBodyMemForm() {
    this.bodyMember = this.fb.group({
      PostfromDate: ['', Validators.required],
      BodyName: [this.getCommitteeName, Validators.required],
      bodyId: ['', Validators.required],
    })
  }

  get f() { return this.bodyMember.controls };

  clearValueDatePicker() {
    this.bodyMember.controls['PostFromDate'].setValue(null)
  }

  filterData() {
    this.paginationNo = 1;
    this.getBodyMemeberActivities(this.bodyId);
    this.getBodyMemeberGraph(this.bodyId);
  }

  clearFilter(flag: any) {
    if (flag == 'member') {
      this.filter.controls['memberName'].setValue(0);
    } else if (flag == 'workType') {
      this.filter.controls['workType'].setValue(0);
    } else if (flag == 'datepicker') {
      this.defaultCloseBtn = false;
      this.filter.controls['fromTodate'].setValue(['', '']);
    }
    this.paginationNo = 1;
    this.getBodyMemeberActivities(this.bodyId);
    this.getBodyMemeberGraph(this.bodyId);
  }

  getAllBodyMember() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetAllMember_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resAllMember = res.data1;
      } else {
        this.toastrService.error("Body member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  getBodyMemberDetails(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetMemberDetails_1_0?MemberId=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.bodyMemberDetails = res.data1[0];
      } else {
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  getBodyMemberFilterDetails(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetBodyMemberList_1_0?BodyId=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.bodyMemberFilterDetails = res.data1;
      } else {
        this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  getWorkcategoryFilterDetails(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Workcategory_1_0', false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resWorkcategory = res.data1;
      } else {
        this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  getCurrentDesignatedMembers(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetCurrentDesignatedMembers_1_0?BodyId=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.allDesignatedMembers = res.data1;
        this.TotalWorkAndIosCount = res.data2[0];
        this.DesignationNameBYBodyId = res.data3;
        console.log(this.DesignationNameBYBodyId );
        this.getPreDesMembersArray = [];
        this.DesignationNameBYBodyId.forEach((ele: any) => {
          this.getPreviousDesignatedMembers(this.bodyId, ele.DesignationId);
        });
      } else {
        // this.spinner.hide();
        // if (res.data == 1) {
        this.toastrService.error("Member is not available");
        // } else {
        //   this.toastrService.error("Please try again something went wrong");
        // }
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../500'], { relativeTo: this.route });
      }
    })
  }

  getUserPostBodyId(id: any) {
    this.selUserpostbodyId = id;
  }

  deleteMember() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Delete_AssignMember_1_0?userpostbodyId=' + this.selUserpostbodyId + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.toastrService.success(res.data1[0].Msg);
        this.getCurrentDesignatedMembers(this.bodyId);

      } else {
        this.spinner.hide();
        this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  getPreviousDesignatedMembers(id: any, DesignationId: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_GetPreviousDesignatedMembers_1_0?BodyId=' + id + '&DesignationId=' + DesignationId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        console.log(this.getPreDesMembersArray)
        this.getPreDesMembersArray.push(res.data1);
        this.getPreDesMembersArray.map((ele:any)=>{
          debugger;
          this.designationArray.push(ele.DesignationName)
        })
        console.log(this.designationArray);
      } else {
        this.spinner.hide();
        // this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  getBodyMemeberActivities(id: any) {
    let filterData = this.filter.value;
    let fromDate: any = "";
    let toDate: any = "";
    this.filter.value.fromTodate[0] != "" ? (fromDate = this.datePipe.transform(this.filter.value.fromTodate[0], 'dd/MM/yyyy')) : fromDate = '';
    this.filter.value.fromTodate[1] != "" ? (toDate = this.datePipe.transform(this.filter.value.fromTodate[1], 'dd/MM/yyyy')) : toDate = '';
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_Activities?MemberId=' + filterData.memberName + '&BodyId=' + id + '&nopage=' + this.paginationNo + '&CategoryId=' + filterData.workType + '&FromDate=' + fromDate + '&ToDate=' + toDate, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resBodyMemAct = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.spinner.hide();
        if (res.data == 1) {
          this.resBodyMemAct = [];
          //this.toastrService.error("Member is not available");
        } else {
          this.toastrService.error("Please try again something went wrong");
        }
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getBodyMemeberActivities(this.bodyId);
  }

  getBodyMemeberGraph(id: any) {
    this.spinner.show();
    let obj= 'MemberId=' + this.filter.value.memberName + '&BodyId=' + id + '&CategoryId=' + this.filter.value.workType + '&FromDate=' + this.filter.value.fromTodate[0] + '&ToDate=' + this.filter.value.fromTodate[1];
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesGraph?' + obj, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.resultBodyMemActGraph = res.data1;
        this.bodyMemeberChartGraph(this.resultBodyMemActGraph);
      } else {
        this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  getBodyMemeberActivitiesDetails(id: any) {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_ActivitiesDetails?WorkId=' + id, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();

        this.resultBodyMemActDetails = res.data1[0];
        // this.comUserdetImg = this.resultBodyMemActDetails.Images.split(',');
        // this.comUserdetImg = this.commonService.imgesDataTransform(this.comUserdetImg, 'array');
        // this.gallery.ref().load(this.comUserdetImg);

        // let latLong = this.resultBodyMemActDetails.ActivityLocation.split(",");
        // this.lat = Number(latLong[0]);
        // this.lng = Number(latLong[1]);
        this.openDialogBodyMemActDetails();
      } else {
        this.toastrService.error("Member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  // chart DIv 
  bodyMemeberChartGraph(data: any) {
    am4core.ready(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create('membersProBarChart', am4charts.XYChart)
      chart.colors.step = 2;
      chart.data = this.resultBodyMemActGraph;

      chart.legend = new am4charts.Legend()
      chart.legend.position = 'top'
      chart.legend.paddingBottom = 10
      chart.legend.labels.template.maxWidth = 20

      let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      xAxis.dataFields.category = 'MemberName'
      xAxis.renderer.cellStartLocation = 0.1
      xAxis.renderer.cellEndLocation = 0.9
      xAxis.renderer.grid.template.location = 0;
      xAxis.renderer.minGridDistance = 30;
      let label = xAxis.renderer.labels.template;
      label.wrap = true;
      label.maxWidth = 90;

      let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.min = 0;

      function createSeries(value: string | undefined, name: string) {
        let series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = value
        series.dataFields.categoryX = 'MemberName'
        series.name = name

        series.events.on("hidden", arrangeColumns);
        series.events.on("shown", arrangeColumns);

        let bullet = series.bullets.push(new am4charts.LabelBullet())
        bullet.interactionsEnabled = false;
        bullet.dy = 30;
        bullet.label.text = '{valueY}'
        bullet.label.fill = am4core.color('#ffffff')
        return series;
      }

      chart.data = data;

      chart.padding(10, 5, 5, 5);
      // createSeries('MemberName', 'Work Done by Committes');
      createSeries('Totalwork', 'Total Work Done');

      function arrangeColumns() {
        var series: any = chart.series.getIndex(0);
        let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
        if (series.dataItems.length > 1) {
          let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
          let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
          let delta = ((x1 - x0) / chart.series.length) * w;
          if (am4core.isNumber(delta)) {
            let middle = chart.series.length / 2;

            let newIndex = 0;
            chart.series.each(function (series) {
              if (!series.isHidden && !series.isHiding) {
                series.dummyData = newIndex;
                newIndex++;
              }
              else {
                series.dummyData = chart.series.indexOf(series);
              }
            })
            let visibleCount = newIndex;
            let newMiddle = visibleCount / 2;

            chart.series.each(function (series) {
              let trueIndex = chart.series.indexOf(series);
              let newIndex = series.dummyData;

              let dx = (newIndex - trueIndex + middle - newMiddle) * delta

              series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
              series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            })
          }
        }
      }
    });
  }

  ngOnDestroy() {
    // sessionStorage.removeItem('bodyId');
  }

  addEditMember(data: any, flag: any) {
    this.addMemberFlag = flag;
    if (data.UserId == "" || data.UserId == "") {
      this.toastrService.error("Please select member and try again");
    }
    else {
      this.dataAddEditMember = data
      let openMemberModal: HTMLElement = this.addMemberModal.nativeElement;
      openMemberModal.click();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.bodyMember.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      let UserPostBodyId: any;
      this.addMemberFlag == 'Add' ? UserPostBodyId = 0 : UserPostBodyId = this.dataAddEditMember.userpostbodyId;
      let fromData = new FormData();
      let postFromDate: any = this.datepipe.transform(this.bodyMember.value.PostfromDate, 'dd/MM/YYYY');
      fromData.append('UserPostBodyId', UserPostBodyId);
      fromData.append('BodyId', this.dataAddEditMember.BodyId);
      fromData.append('DesignationId', this.dataAddEditMember.DesignationId);
      fromData.append('UserId', this.bodyMember.value.bodyId);
      fromData.append('IsMultiple', this.dataAddEditMember.IsMultiple);
      fromData.append('CreatedBy', this.commonService.loggedInUserId());
      fromData.append('PostfromDate', postFromDate);
      this.spinner.show();
      this.callAPIService.setHttp('Post', 'Web_Insert_AssignMember_1_0', false, fromData, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.getCurrentDesignatedMembers(this.bodyId);
          this.submitted = false;
          this.spinner.hide();
          let closeAddMemModal: HTMLElement = this.closeAddMemberModal.nativeElement;
          closeAddMemModal.click();
          this.resultBodyMemActDetails = res.data1[0];
          this.toastrService.success(this.resultBodyMemActDetails.Msg);
          this.bodyMember.reset({ BodyName: this.getCommitteeName });
          this.getBodyMemeberGraph(this.bodyId);
          this.addMemberFlag = null
        } else {
          this.toastrService.error("Member is not available");
        }
      }, (error: any) => {
        if (error.status == 500) {
          this.router.navigate(['../../../500'], { relativeTo: this.route });
        }
      })
    }
  }

  getweekRage(event: any) {
    this.defaultCloseBtn = true;
    this.filter.patchValue({
      FromDate: this.datepipe.transform(event.value[0], 'dd/MM/yyyy'),
      ToDate: this.datepipe.transform(event.value[1], 'dd/MM/yyyy')
    })
    this.getBodyMemeberActivities(this.bodyId);
  }

  activitiesPerodicGraph(id: any) {
    let stringPerodicGraph: any = '?MemberId=' + this.globalMemberId + '&BodyId=' + id + '&CategoryId=' + this.globalCategoryId + '&FromDate=' + this.filter.value.fromTodate[0] + '&ToDate=' + this.filter.value.fromTodate[1];
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_BodyMemeber_Activities_PerodicGraph' + stringPerodicGraph, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.periodicChart = res.data1;
        this.WorkDoneRecentActivityGraph();
      } else {
        this.toastrService.error("Body member is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../../../500'], { relativeTo: this.route });
      }
    })
  }

  WorkDoneRecentActivityGraph() {

    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("recentActivityGraph", am4charts.XYChart);

    // Add data
    chart.data = this.periodicChart;

    chart.colors.list = [
      am4core.color("#80DEEA"),
    ];

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 40;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "TotalWork";
    lineSeries.dataFields.dateX = "MonthName";
    lineSeries.name = "Sales";
    lineSeries.strokeWidth = 3;
    lineSeries.tooltipText = "Totalwork: {valueY}, day change: {valueY.previousChange}";

  }

  redToMemberProfile(memberId: any, FullName: any) {
    let obj = { 'memberId': memberId, 'FullName': FullName }
    sessionStorage.setItem('memberId', JSON.stringify(obj));
    this.router.navigate(['../../../members/profile'])
  }

  openDialogBodyMemActDetails() {
    const dialogRef = this.dialog.open(ActivityDetailsComponent, {
      width: '1024px',
      data:this.resultBodyMemActDetails
    });
  }

}
