import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntranceComponent } from './pages/entrance/entrance.component';

const routes: Routes = [
  {
    path: '',
    component: EntranceComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntranceRoutingModule {}
