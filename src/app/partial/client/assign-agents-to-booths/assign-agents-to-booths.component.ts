import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallAPIService } from 'src/app/services/call-api.service';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../../dialogs/delete/delete.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-assign-agents-to-booths',
  templateUrl: './assign-agents-to-booths.component.html',
  styleUrls: ['./assign-agents-to-booths.component.css', '../../partial.component.css']
})
export class AssignAgentsToBoothsComponent implements OnInit {

  assAgentToBoothForm!: FormGroup;
  assignAgentForm!: FormGroup;
  submitted = false;
  paginationNo: number = 1;
  pageSize: number = 10;
  total: any;
  btnText = 'Assign Booths';
  filterForm!: FormGroup;
  subject: Subject<any> = new Subject();
  searchFilter = "";
  HighlightRow: any;
  electionNameArray: any;
  clientNameArray: any;
  constituencyNameArray: any;
  AssemblyNameArray: any = [];
  BoothSubeleNonSubEleArray: any;
  insertBoothAgentArray: any;
  globalClientId: any;
  clientAgentWithBoothArray: any;
  index: any;
  searchboothList = '';
  AssemblyBoothArray: any = [];
  getAllClientAgentList: any;
  clientAgentListFlag: boolean = false;
  ClientAgentListddl = [];
  constituencyData = '';
  userId:any;
  ClientId:any;
  assBoothObjData:any;
  checkAssemblyArray: any = [];
  boothDivHide: boolean = false;
  boothListMergeArray: any = [];
  searchAssembly = '';
  assemblyArray: any;
  assemblyCheckBoxCheck!: boolean;
  AssemblyId: any;
  assemblyIdArray: any = [];
  boothListArray: any;
  selBoothId: any;
  assemblyBoothJSON:any;
  ConstituencyId: any;
  ConstituencyIdArray: any = [];
  globalEditObj:any;

  constructor(
    private spinner: NgxSpinnerService,
    private callAPIService: CallAPIService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.AgentToBoothForm();
    this.AgentForm();
    this.defaultFilterForm();
    this.getClientName();
    this.getClientAgentWithBooths();
    this.searchFilters('false');
  }

  AgentToBoothForm() {
    this.assAgentToBoothForm = this.fb.group({
      Id:[0],
      ClientId: [''],
      UserId: [''],
      ElectionId: [''],
      ConstituencyId: [''],
      AssemblyId: [''],
      boothId: [''],
      CreatedBy:[this.commonService.loggedInUserId()]
    })
  }

  clearAgentToBoothForm() {
    this.submitted = false;
    this.AgentForm();
  }

  AgentForm() {
    this.assignAgentForm = this.fb.group({
      Id: [0],
      ClientId: [''],
      FullName: [''],
      FName: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      MName: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      LName: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      Address: ['', Validators.required],
      MobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      IsMemberAddAllow: [''],
      CreatedBy: ['']
    })
  }

  get f() { return this.assignAgentForm.controls };

  clearAggentForm() {
    this.submitted = false;
    this.AgentForm();
  }

  defaultFilterForm() {
    this.filterForm = this.fb.group({
      ClientId: [0],
      Search: [''],
    })
  }

  getClientName() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Get_Client_ddl?UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.clientNameArray = res.data1;
       
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getClientAgentListddl() {
    this.spinner.show();
    this.globalClientId = this.assAgentToBoothForm.value.ClientId;
    this.callAPIService.setHttp('get', 'Web_Client_AgentList_ddl?ClientId='+this.globalClientId+'&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.ClientAgentListddl = res.data1;
        if(this.btnText == 'Update Booths'){
          debugger;
          this.assAgentToBoothForm.controls['UserId'].setValue(this.globalEditObj.UserId);
          this.getElectionName();
        }
      } else {
        this.ClientAgentListddl = [];
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  


  getElectionName() {
    this.spinner.show();
    this.globalClientId = this.assAgentToBoothForm.value.ClientId;

    this.callAPIService.setHttp('get', 'Web_Get_Election_byClientId_ddl?ClientId=' + this.assAgentToBoothForm.value.ClientId + '&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.electionNameArray = res.data1;
        this.getIsSubElectionApplicable();
        this.Client_AgentList();
        if(this.btnText == 'Update Booths'){
          this.assAgentToBoothForm.controls['ElectionId'].setValue(this.globalEditObj.ElectionId);
          this.getConstituencyName();
        }
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getConstituencyName() {
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Get_Constituency_byClientId_ddl?ClientId=' + this.assAgentToBoothForm.value.ClientId + '&UserId=' + this.commonService.loggedInUserId() + '&ElectionId=' + this.assAgentToBoothForm.value.ElectionId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.constituencyNameArray = res.data1;
        if(this.btnText == 'Update Booths'){
          this.assAgentToBoothForm.controls['ConstituencyId'].setValue(this.globalEditObj.ConstituencyId);
          this.getAssemblyName();
        }
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getAssemblyName() {
    this.spinner.show();
    let data = this.assAgentToBoothForm.value;
    this.callAPIService.setHttp('get', 'Web_Get_Assembly_byClientId_ddl?ClientId=' + data.ClientId + '&UserId=' + this.commonService.loggedInUserId() + '&ElectionId=' + data.ElectionId
      + '&ConstituencyId=' + data.ConstituencyId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.assemblyArray = res.data1;
        // this.onCheckAssembly(false,ConstituencyId)
      } else {
        this.AssemblyNameArray = [];
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }


  onCheckChangeAssembly(event: any, assemblyId:any) {
    debugger;
    this.assemblyCheckBoxCheck = event.target.checked;
    this.AssemblyId = assemblyId;
    if (event.target.checked == false) {
      let index = this.assemblyIdArray.indexOf(this.AssemblyId);
      this.assemblyIdArray.splice(index, 1);
  
      let indexBoothArray = this.AssemblyBoothArray.findIndex((x:any)=> x.AssemblyId == this.AssemblyId);
      this.AssemblyBoothArray.splice(indexBoothArray, 1);
      // this.onCheckChangeBooths(event, assemblyId);
      this.boothListMergeArray = this.boothListMergeArray.filter((ele: any) => {
        if (ele.AssemblyId !== Number(this.AssemblyId)) {
          return ele;
        }
      });
      this.boothListMergeArray.length == 0 ?   this.boothDivHide = false : this.boothDivHide = true;
    }
    else {
      this.assemblyIdArray.push(this.AssemblyId);
      this.getBoothSubEleNonSubEle(event,this.AssemblyId);
    };
    // this.GetBoothList(this.AssemblyId);
  }

  getIsSubElectionApplicable() {
    let eleIsSubElectionApplicable: any;
    this.electionNameArray.filter((ele: any) => {
      if (ele.ElectionId == this.assAgentToBoothForm.value.ElectionId) {
        eleIsSubElectionApplicable = ele.IsSubElectionApplicable
      };
    })
    return eleIsSubElectionApplicable;
  }

  getBoothSubEleNonSubEle(event:any,assembleId:any) {
    this.spinner.show();
    let data = this.assAgentToBoothForm.value;
    let url;
    this.getIsSubElectionApplicable() == 1 ? url = 'Web_Get_Booths_by_Subelection_ddl_1_0?' : url = 'Web_Get_Booths_NonSubElection_ddl?';

    this.callAPIService.setHttp('get', url + 'ClientId=' + data.ClientId + '&UserId=' + this.commonService.loggedInUserId() + '&ElectionId=' + data.ElectionId
      + '&ConstituencyId=' + data.ConstituencyId + '&AssemblyId=' + assembleId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.boothDivHide = true;
        this.boothListArray = res.data1;
        this.boothListArray.map((ele: any) => {
          if (this.assemblyCheckBoxCheck) {
            this.boothListMergeArray.unshift(ele);
          }
        });
        if (this.btnText == 'Update Booths') {
          let BoothIdArray = this.selBoothId.split(',');
          this.checkBoxCehckBoothArray(BoothIdArray);
        }
        console.log(this.boothListMergeArray);
      } else {
        this.boothListMergeArray.length == 0 ?  this.boothListMergeArray = [] : '';
        this.spinner.hide();
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.spinner.hide();
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

 
  checkBoxCehckBoothArray(ConstituencyId: any) {
    for (let i = 0; i < ConstituencyId.length; i++) {
      for (let j = 0; j < this.boothListArray.length; j++) {
        if (this.boothListArray[j].Id == Number(ConstituencyId[i])) {
          this.boothListArray[j].checked = true;
        }
      }
    }
  }


  onSubmitAssAgentToBoothForm(){
    this.submitted = true;
    let formData = this.assAgentToBoothForm.value;

    if (this.assAgentToBoothForm.invalid) {
      this.spinner.hide();
    }else if (this.AssemblyBoothArray.length == 0  ||  this.AssemblyBoothArray.length == 0){
      this.toastrService.error("Assembly Or Booth is required");
      return;
    }
      else {
      this.spinner.show();
      this.assemblyBoothJSON = JSON.stringify(this.AssemblyBoothArray);
      console.log(this.AssemblyBoothArray);
      let id;
      formData.Id == "" || formData.Id == null ? id = 0 : id = formData.Id;

      let obj = id + '&UserId=' + formData.UserId + '&ClientId=' + formData.ClientId
        + '&strAssmblyBoothId=' + this.assemblyBoothJSON + '&CreatedBy=' + this.commonService.loggedInUserId();

      this.callAPIService.setHttp('get', 'Web_Insert_Election_AssignBoothToAgentHeader?Id=' + obj, false, false, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.toastrService.success(res.data1[0].Msg);
          this.AssemblyBoothArray = [];
          // this.getAssignedBoothToElection();
          this.spinner.hide();
          this.clearForm();
          this.submitted = false;
          this.btnText = 'Assign Booths';
          // this.getAssembly();
          this.boothListMergeArray = [];
        } else {
          this.spinner.hide();
          this.toastrService.error("Data is not available");
        }
      }, (error: any) => {
        if (error.status == 500) {
          this.router.navigate(['../500'], { relativeTo: this.route });
        }
      })
    }
  }

  clearForm() {
    this.submitted = false;
    // this.btnText = 'Assign Booths'
    this.AgentToBoothForm();
    this.boothListArray = [];
    this.boothDivHide = false;
    this.searchAssembly = '';
    this.searchboothList = '';
    this.getClientAgentWithBooths();
  }

  onCheckChangeBooths(event: any,BoothId:any,ConstituencyId:any,AssemblyId:any,ElectionId:any) {
    if (event.target.checked == false) {
      let index = this.AssemblyBoothArray.map((x: any) => { return x.BoothId; }).indexOf(BoothId);
      this.AssemblyBoothArray.splice(index, 1);
    }
    else {
      this.AssemblyBoothArray.push({ 'BoothId': BoothId,"ConstituencyId":ConstituencyId,'AssemblyId':AssemblyId,'ElectionId':ElectionId });
    }
    console.log(this.AssemblyBoothArray);
  }


  blockUser(userId:any,ClientId:any){
    this.spinner.show();
    let data = this.assAgentToBoothForm.value;
    this.callAPIService.setHttp('get', 'Web_Insert_Election_BlockBoothAgent?UserId='+userId+'&ClientId='+ClientId + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.toastrService.success(res.data1[0].Msg);
        this.getClientAgentWithBooths();
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  insertBoothAgent() {
    this.submitted = true;
    if (this.assignAgentForm.invalid) {
      this.spinner.hide();
      return;
    }
    else {
      this.spinner.show();
      let data = this.assignAgentForm.value;
      data.IsMemberAddAllow == true ? data.IsMemberAddAllow = 1 : data.IsMemberAddAllow = 0 //only assign true = 1 & false = 0
      let FullName = data.FName + " " + data.MName + " " + data.LName;
      data.FullName = FullName;
      this.globalClientId = (this.assAgentToBoothForm.value.ClientId);

      let obj = data.Id + '&FullName=' + data.FullName + '&MobileNo=' + data.MobileNo
        + '&FName=' + data.FName + '&MName=' + data.MName + '&LName=' + data.LName + '&Address=' + data.Address
        + '&IsMemberAddAllow=' + data.IsMemberAddAllow + '&ClientId=' + this.globalClientId + '&CreatedBy=' + this.commonService.loggedInUserId()

      this.callAPIService.setHttp('get', 'Web_Client_InsertBoothAgent?Id=' + obj, false, false, false, 'ncpServiceForWeb');
      this.callAPIService.getHttp().subscribe((res: any) => {
        if (res.data == 0) {
          this.clientAgentListFlag = true;
          this.spinner.hide();
          this.toastrService.success(res.data1[0].Msg);
          this.getClientAgentListddl();
          this.resetAassignAgentForm();
          this.Client_AgentList();
        } else {
          this.spinner.hide();
        }
      }, (error: any) => {
        this.spinner.hide();
        if (error.status == 500) {
          this.router.navigate(['../500'], { relativeTo: this.route });
        }
      })
    }
  }

  resetAassignAgentForm() {
    this.submitted = false;
    this.AgentForm();
  }

  Client_AgentList() {//Client_AgentList
    this.spinner.show();
    let data = this.assAgentToBoothForm.value;
    this.callAPIService.setHttp('get', 'Web_Client_AgentList?ClientId=' + data.ClientId + '&UserId=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.clientAgentListFlag = true;
        this.spinner.hide();
        this.getAllClientAgentList = res.data1;
      } else {
        this.getAllClientAgentList = [];
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  getClientAgentWithBooths() {//Filtred Table Record get
    this.spinner.show();
    let data = this.filterForm.value;
    this.callAPIService.setHttp('get', 'Web_Client_AgentWithBooths?ClientId=' + data.ClientId +
      '&UserId=' + this.commonService.loggedInUserId() + '&Search=' + data.Search + '&nopage=' + this.paginationNo, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.spinner.hide();
        this.clientAgentWithBoothArray = res.data1;
        this.total = res.data2[0].TotalCount;
      } else {
        this.clientAgentWithBoothArray = [];
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }


  clearAggentToBooth(flag: any) {
    if (flag == 'clientName') {
      this.assAgentToBoothForm.controls['ClientId'].setValue(0);
    }else if (flag == 'clientName') {
      this.assAgentToBoothForm.controls['ClientId'].setValue(0);
    } 
    else if (flag == 'electionName') {
      this.assAgentToBoothForm.controls['ElectionId'].setValue(0);
    } else if (flag == 'constituencyName') {
      this.assAgentToBoothForm.controls['ConstituencyId'].setValue(0);
    } else if (flag == 'assemblyName') {
      this.assAgentToBoothForm.controls['AssemblyId'].setValue(0);
    }
    this.paginationNo = 1;
    // this.getConstituency();
  }


  delConfirmation(index: any) { //subElection data remove
    this.index = index;
    this.deleteConfirmModel();
  }

  deleteConfirmModel() {
    const dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        this.getClientAgentWithBooths();
      }
    });
  }

  deleteElectionMasterData() {
    this.callAPIService.setHttp('get', 'Delete_Election?ElectionId=' + this.index + '&CreatedBy=' + this.commonService.loggedInUserId(), false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        this.toastrService.success(res.data1[0].Msg);
        this.getClientAgentWithBooths();
      } else {
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }

  onClickPagintion(pageNo: number) {
    this.paginationNo = pageNo;
    this.getClientAgentWithBooths();
  }

  clearFilter(flag: any) {
    if (flag == 'clientName') {
      this.filterForm.controls['ClientId'].setValue(0);
    } else if (flag == 'search') {
      this.filterForm.controls['Search'].setValue('');
    }
    this.paginationNo = 1;
    this.getClientAgentWithBooths();
  }

  filterData() {
    this.paginationNo = 1;
    this.getClientAgentWithBooths();
  }

  onKeyUpFilter() {
    this.subject.next();
  }

  searchFilters(flag: any) {
    if (flag == 'true') {
      if (this.filterForm.value.Search == "" || this.filterForm.value.Search == null) {
        this.toastrService.error("Please search and try again");
        return
      }
    }
    this.subject
      .pipe(debounceTime(700))
      .subscribe(() => {
        this.searchFilter = this.filterForm.value.Search;
        this.paginationNo = 1;
        this.getClientAgentWithBooths();
      }
      );
  }

  assignedBoothModel(assBoothObj:any){
    this.assBoothObjData = assBoothObj;
  }
  
  patchAssBoothElection(HeaderId: any) {
    debugger;
    this.btnText = 'Update Booths';
    this.spinner.show();
    this.callAPIService.setHttp('get', 'Web_Election_GetBoothToAgentDetails?HeaderId=' + HeaderId, false, false, false, 'ncpServiceForWeb');
    this.callAPIService.getHttp().subscribe((res: any) => {
      if (res.data == 0) {
        console.log(res.data1[0]);
        this.spinner.hide();
        this.editAssignBoothsPatchValue(res.data1[0]);

      } else {
        this.spinner.hide();
        this.toastrService.error("Data is not available");
      }
    }, (error: any) => {
      if (error.status == 500) {
        this.router.navigate(['../500'], { relativeTo: this.route });
      }
    })
  }




  editAssignBoothsPatchValue(objData: any) {
    this.globalEditObj = objData;
    debugger;
    this.boothListMergeArray = [];
    this.ConstituencyId = objData.ConstituencyId;
    this.HighlightRow = objData.Id;
    this.boothDivHide = true;
    this.selBoothId = objData.BoothId;
    this.ConstituencyIdArray = objData.Assembly.split(',');
    this.assemblyCheckBoxCheck = true;
    let assemblyArray = objData.Assembly.split(',');

    // assemblyArray.forEach((ele: any) => {
    //   this.getBoothSubEleNonSubEle(false, ele)
    // });

    this.assAgentToBoothForm.patchValue({
      ClientId: objData.ClientId,
      // Id: objData.Id,
      // ElectionId: objData.ElectionId,
    });
    this.getClientAgentListddl();
    setTimeout(() => { this.editAssemblyBoothArray()}, 1000);
  }

  checkBoxCehckAssemblyArray(ConstituencyId: any) {
    debugger
    for (let i = 0; i < ConstituencyId.length; i++) {
      for (let j = 0; j < this.assemblyArray.length; j++) {
        if (this.assemblyArray[j].ConstituencyNo === ConstituencyId[i]) {
          this.assemblyArray[j].checked = true;
        }
      }
    }
  }

  editAssemblyBoothArray() {
    debugger;
    let boothArray = this.selBoothId.split(',');
    this.boothListMergeArray.find((ele: any) => {
      boothArray.find((el: any) => {
        if (ele.Id == Number(el)) {
          this.AssemblyBoothArray.push({ 'AssemblyId': ele.AssemblyId, 'BoothId': ele.Id });
        }
      })
    });
    console.log(this.AssemblyBoothArray);
  }
}

