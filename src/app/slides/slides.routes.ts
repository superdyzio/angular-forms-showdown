import { Routes } from '@angular/router';
import { AssumptionsSlideComponent } from './01-assumptions/assumptions-slide.component';
import { UseCaseSlideComponent } from './02-use-case/use-case-slide.component';
import { TemplateFormsSlideComponent } from './03-template-forms/template-forms-slide.component';
import { ReactiveFormsSlideComponent } from './04-reactive-forms/reactive-forms-slide.component';
import { ComparisonSlideComponent } from './05-comparison/comparison-slide.component';
import { SignalsSlideComponent } from './06-signals/signals-slide.component';
import { SignalFormsSlideComponent } from './07-signal-forms/signal-forms-slide.component';
import { SignalFormsApiSlideComponent } from './08-signal-forms-api/signal-forms-api-slide.component';
import { CvaSlideComponent } from './09-cva/cva-slide.component';
import { FeatureMappingSlideComponent } from './10-feature-mapping/feature-mapping-slide.component';
import { DemoSlideComponent } from './11-demo/demo-slide.component';

export const slidesRoutes: Routes = [
  { path: '', redirectTo: '1', pathMatch: 'full' },
  { path: '1', component: AssumptionsSlideComponent },
  { path: '2', component: UseCaseSlideComponent },
  { path: '3', component: TemplateFormsSlideComponent },
  { path: '4', component: ReactiveFormsSlideComponent },
  { path: '5', component: ComparisonSlideComponent },
  { path: '6', component: SignalsSlideComponent },
  { path: '7', component: SignalFormsSlideComponent },
  { path: '8', component: SignalFormsApiSlideComponent },
  { path: '9', component: CvaSlideComponent },
  { path: '10', component: FeatureMappingSlideComponent },
  { path: '11', component: DemoSlideComponent },
  { path: '**', redirectTo: '1' }
];
