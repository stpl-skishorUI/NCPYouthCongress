import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbacksRoutingModule } from './feedbacks-routing.module';
import { FeedbacksComponent } from './feedbacks.component';
import { NgxSelectModule } from 'ngx-select-ex';


@NgModule({
  declarations: [
    FeedbacksComponent
  ],
  imports: [
    CommonModule,
    FeedbacksRoutingModule,
    NgxSelectModule
  ]
})
export class FeedbacksModule { }
