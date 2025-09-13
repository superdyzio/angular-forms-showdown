import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { TemplateComponent } from './pages/template/template.component';
import { ReactiveComponent } from './pages/reactive/reactive.component';
import { SignalComponent } from './pages/signal/signal.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'template', component: TemplateComponent },
  { path: 'reactive', component: ReactiveComponent },
  { path: 'signal', component: SignalComponent },
  { path: '**', redirectTo: '' }
];
