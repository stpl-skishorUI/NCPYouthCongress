import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


//   ngOnInit(): void {
//     this.loggedUserTypeId = this.commonService.loggedInSubUserTypeId();
//     if (this.loggedUserTypeId == 5) {
//       this.loggedDistrictId = this.commonService.districtId()
//       this.districtName = this.commonService.getCommiteeInfo().CommiteeName
//     } else { this.loggedDistrictId = 0; }

//   }

//   clearFilter(flag: any) {
//     this.clearDataFlag = flag;
//     if (flag == 'dateRangePIcker') {
//       this.fromToDate.setValue('');
//       this.fromDate = '';
//       this.toDate = '';
//       this.defaultCloseBtn = false;
//       this.DistrictWiseCommityWorkGraph();
//     } else if (flag == 'CommitteesIn') {
//       this.loggedUserTypeId == 5 ?  this.districtName = this.commonService.getCommiteeInfo().CommiteeName : this.districtName = "Maharashtra State";
//       this.showSvgMap(this.commonService.mapRegions());
//       this.defaultMembersFlag = false;
//       // this.selectedDistrictId = "";
//       this.selDistrict.reset();

//       this.getOrganizationByDistrictId(this.loggedDistrictId);
//       this.selectDistrict(this.loggedDistrictId);
//       this.defaultCloseBtn = false;
//       this.DistrictWiseCommityWorkGraph();
//     }
//   };

//   ngAfterViewInit() {
//     this.getOrganizationByDistrictId(this.loggedDistrictId);
//     this.searchFilters('false');
//     this.DistrictWiseCommityWorkGraph();

//     if (this.DistrictId) {
//       this.showSvgMap(this.commonService.mapRegions());
//       this.selectDistrict(this.DistrictId);
//     } else {
//       this.showSvgMap(this.commonService.mapRegions());
//       // this.selectDistrict(this.loggedDistrictId);
//       this.getOrganizationByDistrictId(this.loggedDistrictId);
//     }

//     // $(document).on('click', 'path', (e: any) => {
//     //   $('path#' + this.selectedDistrictId).css('fill', '#7289da');
//     //   let getClickedId = e.currentTarget;
//     //   let distrctId = $(getClickedId).attr('id');
//     //   this.selectDistrict(distrctId);
//     //   this.getOrganizationByDistrictId(distrctId);
//     // });
//   }

//   showSvgMap(regions_m: any) {
//     if (this.graphInstance) {
//       this.graphInstance.destroy();
//     }
//     this.graphInstance = $("#mapsvg1").mapSvg({
//       width: 550,
//       height: 430,
//       colors: {
//         baseDefault: "#bfddff",
//         background: "#fff",
//         selected: "#7289da",
//         hover: "#7289da",
//         directory: "#bfddff",
//         status: {}
//       },
//       regions: regions_m,
//       viewBox: [0, 0, 763.614, 599.92],
//       cursor: "pointer",
//       zoom: {
//         on: false,
//         limit: [0, 50],
//         delta: 2,
//         buttons: {
//           on: true,
//           location: "left"
//         },
//         mousewheel: true
//       },
//       tooltips: {
//         mode: "title",
//         off: true,
//         priority: "local",
//         position: "bottom"
//       },
//       popovers: {
//         mode: "on",
//         on: false,
//         priority: "local",
//         position: "top",
//         centerOn: false,
//         width: 300,
//         maxWidth: 50,
//         maxHeight: 50,
//         resetViewboxOnClose: false,
//         mobileFullscreen: false
//       },
//       gauge: {
//         on: false,
//         labels: {
//           low: "low",
//           high: "high"
//         },
//         colors: {
//           lowRGB: {
//             r: 211,
//             g: 227,
//             b: 245,
//             a: 1
//           },
//           highRGB: {
//             r: 67,
//             g: 109,
//             b: 154,
//             a: 1
//           },
//           low: "#d3e3f5",
//           high: "#436d9a",
//           diffRGB: {
//             r: -144,
//             g: -118,
//             b: -91,
//             a: 0
//           }
//         },
//         min: 0,
//         max: false
//       },
//       source: "assets/images/maharashtra_districts_texts.svg",
//       // source: "assets/images/divisionwise.svg",
//       title: "Maharashtra-bg_o",
//       responsive: true
//     });
//     // });
//     // this.DistrictId ?  $('path#' + this.DistrictId).css('fill', 'red') :  '';
//   }

//   getOrganizationByDistrictId(id: any) {
//     this.spinner.show();
//     this.getDistrict(id)

//     this.callAPIService.setHttp('get', 'Sp_Web_GetOrganization_byDistrictId_2_0?UserId=' + this.commonService.loggedInUserId() + '&DistrictId=' + id + '&Search=' + this.searchFilter, false, false, false, 'ncpServiceForWeb');
//     this.callAPIService.getHttp().subscribe((res: any) => {
//       if (res.data == 0) {
//         $('path#' + this.selectedDistrictId).css('fill', 'rgb(39 40 72)');
//         this.defaultCloseBtn = true;
//         if (id == 0) {
//           this.defaultCloseBtn = false;
//         }
//         this.defaultCommitteesFlag = true;
//         this.spinner.hide();
//         this.resultCommittees = res.data1;
//         this.selDistrict.setValue(Number(id));
//       } else {
//         this.defaultMembersFlag = false;
//         this.defaultCommitteesFlag = true;
//         this.defaultCloseBtn = true;
//         this.resultCommittees = [];
//         this.selDistrict.setValue('');
//         this.spinner.hide();
//         this.selDistrict.setValue(Number(id));
//       }

//     }, (error: any) => {
//       this.spinner.hide();
//       if (error.status == 500) {
//         this.router.navigate(['../500'], { relativeTo: this.route });
//       }
//     })
//   }

//   addClasscommitteeWise(id: any) {
//     this.allDistrict.length == 1 ? $('.mapsvg-wrap path[id!="' + id + '"]').addClass('notClicked') : '';
//     this.allDistrict.length == 1 ? $('.mapsvg-wrap path[id!="' + id + '"]').css('fill', '#7289da') : '';
//   }

//   selectDistrict(event: any) {
//     this.Search.reset('');
//     this.searchFilter = "";
//     $('path').css('fill', '#7289da');
//     this.selectedDistrictId = event;
//     // this.loggedDistrictId = event;
//     this.DistrictWiseCommityWorkGraph();
//     $('path#' + this.selectedDistrictId).css('fill', 'rgb(114, 137, 218)');
//     this.getOrganizationByDistrictId(this.selectedDistrictId);
//     this.defaultMembersFlag = false;
//   }

//   getDistrict(id: any) {
//     // this.spinner.show();
//     this.callAPIService.setHttp('get', 'Web_GetDistrict_1_0_CommitteeonMap?StateId=' + 1 + '&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb'); //old API  Web_GetDistrict_1_0_Committee
//     this.callAPIService.getHttp().subscribe((res: any) => {
//       if (res.data == 0) {
//         this.spinner.hide();
//         this.allDistrict = res.data1;
//         this.allDistrict.length == 1 ? this.addClasscommitteeWise(this.allDistrict[0].DistrictId) : '';
//         if (this.allDistrict.length == 1) {
//           this.defaultCloseBtn = false;
//           this.allowClear = false;
//         } else {
//           this.defaultCloseBtn = true;
//           this.allowClear = true;
//         }
//         res.data1.find((ele: any) => {
//           if (ele.DistrictId == id) {
//             this.districtName = ele.DistrictName;
//           }
//         });
        
//       } else {
//         // this.toastrService.error("Data is not available 2");
//       }
//     }, (error: any) => {
//       if (error.status == 500) {
//         this.router.navigate(['../../500'], { relativeTo: this.route });
//       }
//     })
//   }


//   committeeNameByOrganizationMember(bodyId: any, committeeName: any) {
//     this.spinner.show();
//     this.globalBodyId = bodyId;
//     this.activeRow = bodyId
//     this.callAPIService.setHttp('get', 'Web_GetOrganizationMember_byBodyId_1_0?UserId=' + this.commonService.loggedInUserId() + '&BodyId=' + bodyId, false, false, false, 'ncpServiceForWeb');
//     this.callAPIService.getHttp().subscribe((res: any) => {
//       if (res.data == 0) {
//         this.defaultMembersFlag = true;
//         this.spinner.hide();
//         this.selCommitteeName = committeeName;
//         this.resultOrganizationMember = res.data1;
//       } else {
//         this.defaultMembersFlag = true;
//         this.resultOrganizationMember = [];
//         this.selCommitteeName = committeeName;
//         this.spinner.hide();
//       }
//     }, (error: any) => {
//       this.spinner.hide();
//       if (error.status == 500) {
//         this.router.navigate(['../500'], { relativeTo: this.route });
//       }
//     })
//   }

//   redToMemberProfile(memberId: any, FullName: any) {
//     let obj = { 'memberId': memberId, 'FullName': FullName }
//     sessionStorage.setItem('memberId', JSON.stringify(obj));
//     this.router.navigate(['../../profile'])
//   }

//   redirectOrgDetails() {
//     let obj = { bodyId: this.globalBodyId, BodyOrgCellName: this.selCommitteeName }
//     sessionStorage.setItem('bodyId', JSON.stringify(obj))
//     this.router.navigate(['../committee/details'], { relativeTo: this.route })
//   }

//   onKeyUpFilter() {
//     this.subject.next();
//   }

//   searchFilters(flag: any) {
//     if (flag == 'true') {
//       if (this.Search.value == "" || this.Search.value == null) {
//         this.toastrService.error("Please search and try again");
//         return
//       }
//     }
//     this.subject
//       .pipe(debounceTime(700))
//       .subscribe(() => {
//         this.loggedUserTypeId == 5 ?  this.districtName = this.commonService.getCommiteeInfo().CommiteeName : this.districtName = "Maharashtra State";
//         this.searchFilter = this.Search.value;
//         // this.districtName = "Maharashtra State";
//         this.getOrganizationByDistrictId(this.loggedDistrictId);
//         this.DistrictWiseCommityWorkGraph();
//       }
//       );
//   }
//   clearFilterByCommitteesName() {
//     this.searchFilter = "";
//     this.Search.reset('');
//     this.loggedUserTypeId == 5 ?  this.districtName = this.commonService.getCommiteeInfo().CommiteeName : this.districtName = "Maharashtra State";
//     this.getOrganizationByDistrictId(this.loggedDistrictId);
//     this.DistrictWiseCommityWorkGraph();
//   }

//   selDateRangeByFilter(getDate: any) {
//     this.defaultCloseBtn = true;
//     this.fromDate = this.datePipe.transform(getDate[0], 'dd/MM/yyyy');
//     this.toDate = this.datePipe.transform(getDate[1], 'dd/MM/yyyy');
//     this.DistrictWiseCommityWorkGraph();
//   }

//   DistrictWiseCommityWorkGraph() {
//     this.spinner.show();
//     let globalDistrictId = this.selectedDistrictId || 0;
//     let obj = this.commonService.loggedInUserId() + '&DistrictId=' + globalDistrictId + '&FromDate=' + this.fromDate + '&ToDate=' + this.toDate+'&Search='+this.Search.value;
//     this.callAPIService.setHttp('get', 'Web_DistrictWiseCommitteeWorkGraph?UserId=' + obj, false, false, false, 'ncpServiceForWeb');
//     this.callAPIService.getHttp().subscribe((res: any) => {
//       if (res.data == 0) {
//         this.spinner.hide();
//         this.DistWiseCommityWGraphArray = res.data1;
//         this.WorkDoneByYuvak();
//       } else {
//         this.DistWiseCommityWGraphArray = [];
//         this.WorkDoneByYuvak();
//         this.spinner.hide();
//       }
//     }, (error: any) => {
//       this.spinner.hide();
//       if (error.status == 500) {
//         this.router.navigate(['../500'], { relativeTo: this.route });
//       }
//     })
//   }

//   WorkDoneByYuvak() {

//     am4core.ready(() => {
//       am4core.useTheme(am4themes_animated);
//       am4core.useTheme(am4themes_material);
//       let chart = am4core.create('WorkDoneByYuvak1', am4charts.XYChart)
//       chart.responsive.enabled = true;

//       chart.colors.list = [
//         // am4core.color("#515ee6"),
//         // am4core.color("#515ee6"),
//         am4core.color("#b959e0"),
//         am4core.color("#b959e0"),
//       ];
//       chart.colors.step = 2;

//       chart.legend = new am4charts.Legend()
//       chart.legend.position = 'top'
//       chart.legend.paddingBottom = 10
//       chart.legend.labels.template.maxWidth = 20

//       let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
//       valueAxis.min = 0;
//       valueAxis.title.text = "Committes Work Done Count";

//       let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
//       xAxis.dataFields.category = 'BodyOrgCellName'
//       xAxis.title.text = "Committes Name";
//       xAxis.renderer.cellStartLocation = 0.1
//       xAxis.renderer.cellEndLocation = 0.9
//       xAxis.renderer.grid.template.location = 0;
//       xAxis.renderer.labels.template.rotation = -35;
//       xAxis.renderer.minGridDistance = 30;
//       //chart.scrollbarX = new am4core.Scrollbar();

//       let label = xAxis.renderer.labels.template;
//       // label.truncate = true;
//       // label.maxWidth = 120;
//       label.tooltipText = "{category}";

//       function createSeries(value: string | undefined, name: string) {
//         let series = chart.series.push(new am4charts.ColumnSeries())
//         series.dataFields.valueY = value
//         series.dataFields.categoryX = 'BodyOrgCellName'
//         series.name = name

//         series.events.on("hidden", arrangeColumns);
//         series.events.on("shown", arrangeColumns);

//         let bullet = series.bullets.push(new am4charts.LabelBullet())
//         bullet.interactionsEnabled = false
//         bullet.dy = 30;
//         bullet.label.text = '{valueY}'
//         bullet.label.fill = am4core.color('#ffffff')
//         return series;
//       }

//       chart.data = this.DistWiseCommityWGraphArray;
//       chart.padding(10, 5, 5, 5);
//       // createSeries('TotalWork', 'Work Done by Committees');
//       createSeries('TotalWork', 'Total Work Done');

//       function arrangeColumns() {

//         var series: any = chart.series.getIndex(0);
//         let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
//         if (series.dataItems.length > 1) {
//           let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
//           let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
//           let delta = ((x1 - x0) / chart.series.length) * w;
//           if (am4core.isNumber(delta)) {
//             let middle = chart.series.length / 2;

//             let newIndex = 0;
//             chart.series.each(function (series) {
//               if (!series.isHidden && !series.isHiding) {
//                 series.dummyData = newIndex;
//                 newIndex++;
//               }
//               else {
//                 series.dummyData = chart.series.indexOf(series);
//               }
//             })
//             let visibleCount = newIndex;
//             let newMiddle = visibleCount / 2;

//             chart.series.each(function (series) {
//               let trueIndex = chart.series.indexOf(series);
//               let newIndex = series.dummyData;

//               let dx = (newIndex - trueIndex + middle - newMiddle) * delta

//               series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
//               series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
//             })
//           }
//         }
//       }
//     });
//     //this.mahaSVGMap();
//   }

//   ngOnDestroy() {
//     // sessionStorage.removeItem('weekRange');
//     sessionStorage.removeItem('DistrictIdWorkThisWeek');
//     if (this.graphInstance) {
//       this.graphInstance.destroy();
//     }
//   }
// }

}
