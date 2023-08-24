import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullPageComponent } from './Components/full-page/full-page.component';

const routes: Routes = [
  {
    path:'/adminui',
    component:FullPageComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
