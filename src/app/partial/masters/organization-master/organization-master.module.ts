import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationMasterRoutingModule } from './organization-master-routing.module';
import { OrganizationMasterComponent } from './organization-master.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OrganizationMasterComponent
  ],
  imports: [
    CommonModule,
    OrganizationMasterRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class OrganizationMasterModule { }
