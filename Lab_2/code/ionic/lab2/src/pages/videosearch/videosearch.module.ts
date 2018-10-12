import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideosearchPage } from './videosearch';

@NgModule({
  declarations: [
    VideosearchPage,
  ],
  imports: [
    IonicPageModule.forChild(VideosearchPage),
  ],
})
export class VideosearchPageModule {}
