import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IntroComponent} from './pages/intro/intro.component';
import {IntroRoutingModule} from './intro-routing.module';
import {IonicModule} from '@ionic/angular';

@NgModule({
    declarations: [IntroComponent],
    imports: [CommonModule, IntroRoutingModule, IonicModule.forRoot()],
})
export class IntroModule {}
