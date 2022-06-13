import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EntranceComponent } from './pages/entrance/entrance.component';
import { EntranceRoutingModule } from './entrance-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AtmMapComponent } from './components/atm-map/atm-map.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { PrimengModule } from '../primeng/primeng.module';

@NgModule({
  declarations: [EntranceComponent, AtmMapComponent, UserInfoComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    EntranceRoutingModule,
    SharedModule,
    TranslateModule,
    PrimengModule,
  ],
  exports: [EntranceComponent],
})
export class EntranceModule {}
