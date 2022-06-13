import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IntroComponent} from './pages/intro/intro.component';

const routes: Routes = [
    {
        path: '',
        component: IntroComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IntroRoutingModule {}
