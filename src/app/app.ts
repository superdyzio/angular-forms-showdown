import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'afs-root',
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  ngOnInit() {
    // Wait for translations to be loaded, then initialize language
    this.translate.onLangChange.subscribe(() => {
      this.initializeLanguage();
    });
    
    // Watch for route changes to update language from query params
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateLanguageFromQueryParams();
      });
  }

  private initializeLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 
                 this.route.snapshot.queryParams['lang'] ||
                 this.router.routerState.snapshot.root.queryParams['lang'];
    
    if (lang === 'en' || lang === 'pl') {
      this.setLanguage(lang);
    } else if (!this.translate.currentLang) {
      // Set default if no language is set
      this.translate.use('pl');
    }
  }

  private updateLanguageFromQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 
                 this.route.snapshot.queryParams['lang'] ||
                 this.router.routerState.snapshot.root.queryParams['lang'];
    
    if (lang === 'en' || lang === 'pl') {
      this.setLanguage(lang);
    }
  }

  private setLanguage(lang: 'pl' | 'en') {
    if (this.getCurrentLanguage() === lang) return;
    
    this.translate.use(lang);
    
    // Update query param without navigation
    const urlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: { lang },
      queryParamsHandling: 'merge'
    });
    
    this.router.navigateByUrl(urlTree, { replaceUrl: true, skipLocationChange: false });
  }

  private getCurrentLanguage(): string {
    return this.translate.getCurrentLang() || 'pl';
  }
}
