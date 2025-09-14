import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { slidesRoutes } from './slides/slides.routes';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { 
    path: 'slideshow', 
    loadComponent: () => import('./pages/slideshow/slideshow.component').then(m => m.SlideshowComponent),
    children: slidesRoutes
  },
  { 
    path: 'template', 
    loadComponent: () => import('./pages/template/template.component').then(m => m.TemplateComponent)
  },
  { 
    path: 'reactive', 
    loadComponent: () => import('./pages/reactive/reactive.component').then(m => m.ReactiveComponent)
  },
  { 
    path: 'signal', 
    loadComponent: () => import('./pages/signal/signal.component').then(m => m.SignalComponent)
  },
  { path: '**', redirectTo: '' }
];
