import { Routes } from '@angular/router';
import { AssumptionsSlideComponent } from './01-assumptions/assumptions-slide.component';
import { UseCaseSlideComponent } from './02-use-case/use-case-slide.component';
import { TemplateFormsSlideComponent } from './03-template-forms/template-forms-slide.component';
import { Slide3Component } from './slide3/slide3.component';

export const slidesRoutes: Routes = [
  { path: '', redirectTo: '1', pathMatch: 'full' },
  { path: '1', component: AssumptionsSlideComponent },
  { path: '2', component: UseCaseSlideComponent },
  { path: '3', component: TemplateFormsSlideComponent },
  { path: '4', component: Slide3Component },
  { path: '**', redirectTo: '1' }
];
