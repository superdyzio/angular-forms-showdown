import { Routes } from '@angular/router';
import { AssumptionsSlideComponent } from './01-assumptions/assumptions-slide.component';
import { UseCaseSlideComponent } from './02-use-case/use-case-slide.component';
import { Slide2Component } from './slide2/slide2.component';
import { Slide3Component } from './slide3/slide3.component';

export const slidesRoutes: Routes = [
  { path: '', redirectTo: '1', pathMatch: 'full' },
  { path: '1', component: AssumptionsSlideComponent },
  { path: '2', component: UseCaseSlideComponent },
  { path: '3', component: Slide2Component },
  { path: '4', component: Slide3Component },
  { path: '**', redirectTo: '1' }
];
