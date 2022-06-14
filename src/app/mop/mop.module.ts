import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrimengModule} from '../primeng/primeng.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {MopMainComponent} from './pages/mop-main/mop-main.component';
import {NonePageComponent} from './pages/none-page/none-page.component';
import {AppMopRoutingModule} from './mop-routing.module';
import {IonicModule} from '@ionic/angular';
import {StatusPageComponent} from './pages/status-page/status-page.component';
import {SetStoragePageComponent} from './pages/set-storage-page/set-storage-page.component';

@NgModule({
    declarations: [MopMainComponent, NonePageComponent, StatusPageComponent, SetStoragePageComponent],
    imports: [
        CommonModule,
        PrimengModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule,
        AppMopRoutingModule,
        IonicModule.forRoot(),
    ],
})
export class MopModule {}
