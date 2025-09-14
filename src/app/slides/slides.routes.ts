import { Routes } from '@angular/router';
import { Slide1Component } from './slide1/slide1.component';
import { Slide2Component } from './slide2/slide2.component';
import { Slide3Component } from './slide3/slide3.component';

export const slidesRoutes: Routes = [
  { path: '', redirectTo: '1', pathMatch: 'full' },
  { path: '1', component: Slide1Component },
  { path: '2', component: Slide2Component },
  { path: '3', component: Slide3Component },
  { path: '**', redirectTo: '1' }
];
