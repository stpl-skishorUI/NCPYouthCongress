import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpSupportRoutingModule } from './help-support-routing.module';
import { HelpSupportComponent } from './help-support.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxPaginationModule } from 'ngx-pagination';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';


@NgModule({
  declarations: [
    HelpSupportComponent
  ],
  imports: [
    CommonModule,
    HelpSupportRoutingModule,
    NgxSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    LightboxModule,
    GalleryModule,
  ]
})
export class HelpSupportModule { }
