import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {IonicModule} from '@ionic/angular';
import {FooterComponent} from './footer/footer.component';
import {LanguageComponent} from './language/language.component';
import {PrimengModule} from '../primeng/primeng.module';
import {LoaderComponent} from './loader/loader.component';

@NgModule({
    declarations: [NavBarComponent, FooterComponent, LanguageComponent, LoaderComponent],
    imports: [CommonModule, IonicModule, PrimengModule],
    exports: [NavBarComponent, FooterComponent, LanguageComponent, LoaderComponent],
})
export class SharedModule {}
