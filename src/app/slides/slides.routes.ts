import { Routes } from '@angular/router';
import { AssumptionsSlideComponent } from './01-assumptions/assumptions-slide.component';
import { UseCaseSlideComponent } from './02-use-case/use-case-slide.component';
import { TemplateFormsSlideComponent } from './03-template-forms/template-forms-slide.component';
import { ReactiveFormsSlideComponent } from './04-reactive-forms/reactive-forms-slide.component';
import { SignalFormsSlideComponent } from './07-signal-forms/signal-forms-slide.component';

export const slidesRoutes: Routes = [
  { path: '', redirectTo: '1', pathMatch: 'full' },
  { path: '1', component: AssumptionsSlideComponent },
  { path: '2', component: UseCaseSlideComponent },
  { path: '3', component: TemplateFormsSlideComponent },
  { path: '4', component: ReactiveFormsSlideComponent },
  { path: '7', component: SignalFormsSlideComponent },
  { path: '**', redirectTo: '1' }
];
