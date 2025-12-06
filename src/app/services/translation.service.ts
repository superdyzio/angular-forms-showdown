import { Injectable, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export type Language = 'pl' | 'en';

interface Translations {
  [key: string]: string | Translations;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: { [lang in Language]: Translations } = {
    pl: {},
    en: {}
  };

  private currentLanguage = signal<Language>('pl');
  
  public readonly currentLang = this.currentLanguage.asReadonly();
  
  public readonly t = computed(() => {
    const lang = this.currentLanguage();
    const translations = this.translations[lang];
    return (key: string, params?: { [key: string]: string | number }): string => {
      const value = this.getNestedValue(translations, key);
      if (typeof value !== 'string') {
        console.warn(`Translation key "${key}" not found for language "${lang}"`);
        return key;
      }
      return this.interpolate(value, params);
    };
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Load translations
    this.loadTranslations();
    
    // Initialize from current route query params
    const urlParams = new URLSearchParams(window.location.search);
    const initialLang = urlParams.get('lang') || 
                       this.route.snapshot.queryParams['lang'] ||
                       this.router.routerState.snapshot.root.queryParams['lang'];
    if (initialLang === 'en' || initialLang === 'pl') {
      this.setLanguage(initialLang);
    }
    
    // Watch for route changes to update language from query params
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('lang') || 
                     this.route.snapshot.queryParams['lang'] ||
                     this.router.routerState.snapshot.root.queryParams['lang'];
        if (lang === 'en' || lang === 'pl') {
          this.setLanguage(lang);
        }
      });
  }

  private loadTranslations() {
    // Polish translations (default)
    this.translations.pl = {
      // Main page
      'main.title': 'Angular Forms Showdown',
      'main.selectForm': 'Wybierz typ formularza do sprawdzenia:',
      'main.whichForm': 'Jaki form wariacie?',
      'main.template.title': 'Template-Driven',
      'main.template.description': 'Te z dyrektywami oraz two-way bindingami',
      'main.reactive.title': 'Reactive Forms',
      'main.reactive.description': 'Te z FormControlami, FormGroupami i RxJSem',
      'main.signal.title': 'Signal-Based',
      'main.signal.description': 'Te nowe błyszczące świeżutkie z sygnałami',
      'main.presentation.title': '📊 Prezentacja',
      'main.presentation.description': 'Pomocnicza prezentacja o Angular forms',
      
      // Common
      'common.backToMain': '← Wróć do głównej',
      'common.profileCompletion': 'Ukończenie profilu',
      'common.basicInformation': 'Podstawowe informacje',
      'common.locationInformation': 'Informacje o lokalizacji',
      'common.addresses': 'Adresy',
      'common.newsletterPreferences': 'Preferencje newslettera',
      'common.registerAccount': 'Zarejestruj konto',
      'common.registrationSuccessful': 'Rejestracja zakończona sukcesem!',
      'common.formStatus': 'Status formularza',
      'common.valid': 'Ważny',
      'common.pristine': 'Nienaruszony',
      'common.touched': 'Dotknięty',
      'common.emailExists': 'Email istnieje',
      'common.emailCheckInProgress': 'Sprawdzanie emaila w toku',
      
      // Form fields
      'form.fullName': 'Imię i nazwisko',
      'form.email': 'Adres email',
      'form.password': 'Hasło',
      'form.confirmPassword': 'Potwierdź hasło',
      'form.country': 'Kraj',
      'form.state': 'Województwo',
      'form.streetAddress': 'Ulica',
      'form.city': 'Miasto',
      'form.zipCode': 'Kod pocztowy',
      'form.type': 'Typ',
      'form.subscribeNewsletter': 'Zapisz się do newslettera',
      'form.newsletterFrequency': 'Częstotliwość newslettera',
      'form.selectFrequency': 'Wybierz częstotliwość',
      'form.addAnotherAddress': '+ Dodaj kolejny adres',
      'form.remove': 'Usuń',
      'form.removeAllAddresses': 'Usuń wszystkie adresy',
      'form.add1kAddresses': 'Dodaj 1k adresów',
      'form.update1kAddresses': 'Aktualizuj 1k adresów',
      
      // Validation messages
      'validation.name.required': 'Imię jest wymagane',
      'validation.name.minlength': 'Imię musi mieć co najmniej 2 znaki',
      'validation.email.required': 'Email jest wymagany',
      'validation.email.invalid': 'Wprowadź poprawny adres email',
      'validation.email.exists': 'Ten email jest już zarejestrowany',
      'validation.email.checking': 'Sprawdzanie dostępności emaila...',
      'validation.email.available': 'Email jest dostępny',
      'validation.email.alreadyTaken': 'Email jest już zajęty',
      'validation.password.required': 'Hasło jest wymagane',
      'validation.password.minlength': 'Hasło musi mieć co najmniej 8 znaków',
      'validation.password.complexity': 'Hasło musi zawierać wielkie litery, małe litery, cyfry i znak specjalny',
      'validation.confirmPassword.required': 'Potwierdź hasło',
      'validation.confirmPassword.mismatch': 'Hasła nie pasują do siebie',
      'validation.country.required': 'Kraj jest wymagany',
      'validation.state.required': 'Województwo jest wymagane dla USA',
      
      // Password strength
      'password.weak': 'Słabe',
      'password.fair': 'Średnie',
      'password.good': 'Dobre',
      'password.strong': 'Silne',
      
      // Options
      'option.selectCountry': 'Wybierz kraj',
      'option.selectState': 'Wybierz województwo',
      'option.unitedStates': 'Stany Zjednoczone',
      'option.unitedKingdom': 'Wielka Brytania',
      'option.canada': 'Kanada',
      'option.australia': 'Australia',
      'option.germany': 'Niemcy',
      'option.california': 'Kalifornia',
      'option.newYork': 'Nowy Jork',
      'option.texas': 'Teksas',
      'option.florida': 'Floryda',
      'option.illinois': 'Illinois',
      'option.home': 'Dom',
      'option.work': 'Praca',
      'option.other': 'Inne',
      'option.daily': 'Codziennie',
      'option.weekly': 'Tygodniowo',
      'option.monthly': 'Miesięcznie',
      
      // Forms
      'forms.template.title': 'Template-Driven Forms - Rejestracja użytkownika',
      'forms.template.description': 'Formularze używające dyrektyw szablonu i dwukierunkowego wiązania z dynamicznymi funkcjami',
      'forms.reactive.title': 'Reactive Forms - Rejestracja użytkownika',
      'forms.reactive.description': 'Formularze używające FormControl, FormGroup, FormArray i wzorców reaktywnych z zaawansowaną walidacją',
      'forms.signal.title': 'Signal Forms - Rejestracja użytkownika',
      'forms.signal.description': 'Formularze używające Reactive Forms z sygnałami Angular do zarządzania stanem i walidacji',
      
      // Slideshow
      'slideshow.title': 'Prezentacja Angular Forms',
      'slideshow.previous': '← Poprzedni',
      'slideshow.next': 'Następny →',
      
      // Slides
      'slide.assumptions.title': 'Założenia',
      'slide.assumptions.knowAngular': 'Znamy Angulara?',
      'slide.assumptions.raiseHand': 'Ręka do góry jeśli tak',
      'slide.assumptions.templateDriven': 'Template-driven forms - te formularze z dyrektywami',
      'slide.assumptions.reactive': 'Reactive forms - te formularze z obserwablami',
      'slide.assumptions.signals': 'Signals - nowy typ reaktywny',
      'slide.assumptions.signalForms': 'Signal-based forms - nowe formularze z signalami',
      'slide.assumptions.goThrough': 'Przejdziemy dzisiaj przez wszystkie trzy podejścia i trochę je porównamy!',
      
      'slide.useCase.title': 'Use Case',
      'slide.useCase.what': 'Czym dokładnie się zajmiemy?',
      'slide.useCase.userRegistration': 'Formularz rejestracji użytkownika',
      'slide.useCase.dynamicAddresses': 'Dynamiczna lista adresów',
      'slide.useCase.syncValidation': 'Walidacja synchroniczna (np. wymagane pola)',
      'slide.useCase.asyncValidation': 'Walidacja asynchroniczna (czy email jest zajęty)',
      'slide.useCase.fieldDependencies': 'Zależności pomiędzy polami',
      'slide.useCase.passwordStrength': 'Sprawdzanie siły hasła',
      'slide.useCase.errorMessages': 'Komunikaty błędów',
      
      'slide.thankYou.title': 'Dziękuję bardzo',
      'slide.thankYou.links': 'Kilka linków'
    };

    // English translations
    this.translations.en = {
      // Main page
      'main.title': 'Angular Forms Showdown',
      'main.selectForm': 'Select form type to check:',
      'main.whichForm': 'Which form variant?',
      'main.template.title': 'Template-Driven',
      'main.template.description': 'Those with directives and two-way bindings',
      'main.reactive.title': 'Reactive Forms',
      'main.reactive.description': 'Those with FormControls, FormGroups and RxJS',
      'main.signal.title': 'Signal-Based',
      'main.signal.description': 'Those new shiny fresh ones with signals',
      'main.presentation.title': '📊 Presentation',
      'main.presentation.description': 'Helper presentation about Angular forms',
      
      // Common
      'common.backToMain': '← Back to Main',
      'common.profileCompletion': 'Profile Completion',
      'common.basicInformation': 'Basic Information',
      'common.locationInformation': 'Location Information',
      'common.addresses': 'Addresses',
      'common.newsletterPreferences': 'Newsletter Preferences',
      'common.registerAccount': 'Register Account',
      'common.registrationSuccessful': 'Registration Successful!',
      'common.formStatus': 'Form Status',
      'common.valid': 'Valid',
      'common.pristine': 'Pristine',
      'common.touched': 'Touched',
      'common.emailExists': 'Email Exists',
      'common.emailCheckInProgress': 'Email Check In Progress',
      
      // Form fields
      'form.fullName': 'Full Name',
      'form.email': 'Email Address',
      'form.password': 'Password',
      'form.confirmPassword': 'Confirm Password',
      'form.country': 'Country',
      'form.state': 'State',
      'form.streetAddress': 'Street Address',
      'form.city': 'City',
      'form.zipCode': 'ZIP Code',
      'form.type': 'Type',
      'form.subscribeNewsletter': 'Subscribe to newsletter',
      'form.newsletterFrequency': 'Newsletter Frequency',
      'form.selectFrequency': 'Select frequency',
      'form.addAnotherAddress': '+ Add Another Address',
      'form.remove': 'Remove',
      'form.removeAllAddresses': 'Remove all addresses',
      'form.add1kAddresses': 'Add 1k addresses',
      'form.update1kAddresses': 'Update 1k addresses',
      
      // Validation messages
      'validation.name.required': 'Name is required',
      'validation.name.minlength': 'Name must be at least 2 characters',
      'validation.email.required': 'Email is required',
      'validation.email.invalid': 'Please enter a valid email',
      'validation.email.exists': 'This email is already registered',
      'validation.email.checking': 'Checking email availability...',
      'validation.email.available': 'Email is available',
      'validation.email.alreadyTaken': 'Email already taken',
      'validation.password.required': 'Password is required',
      'validation.password.minlength': 'Password must be at least 8 characters',
      'validation.password.complexity': 'Password must contain uppercase, lowercase, number, and special character',
      'validation.confirmPassword.required': 'Please confirm your password',
      'validation.confirmPassword.mismatch': 'Passwords do not match',
      'validation.country.required': 'Country is required',
      'validation.state.required': 'State is required for USA',
      
      // Password strength
      'password.weak': 'Weak',
      'password.fair': 'Fair',
      'password.good': 'Good',
      'password.strong': 'Strong',
      
      // Options
      'option.selectCountry': 'Select a country',
      'option.selectState': 'Select a state',
      'option.unitedStates': 'United States',
      'option.unitedKingdom': 'United Kingdom',
      'option.canada': 'Canada',
      'option.australia': 'Australia',
      'option.germany': 'Germany',
      'option.california': 'California',
      'option.newYork': 'New York',
      'option.texas': 'Texas',
      'option.florida': 'Florida',
      'option.illinois': 'Illinois',
      'option.home': 'Home',
      'option.work': 'Work',
      'option.other': 'Other',
      'option.daily': 'Daily',
      'option.weekly': 'Weekly',
      'option.monthly': 'Monthly',
      
      // Forms
      'forms.template.title': 'Template-Driven Forms - User Registration',
      'forms.template.description': 'Forms using template directives and two-way binding with dynamic features',
      'forms.reactive.title': 'Reactive Forms - User Registration',
      'forms.reactive.description': 'Forms using FormControl, FormGroup, FormArray, and reactive patterns with advanced validation',
      'forms.signal.title': 'Signal Forms - User Registration',
      'forms.signal.description': 'Forms using Reactive Forms with Angular signals for state management and validation',
      
      // Slideshow
      'slideshow.title': 'Angular Forms Presentation',
      'slideshow.previous': '← Previous',
      'slideshow.next': 'Next →',
      
      // Slides
      'slide.assumptions.title': 'Assumptions',
      'slide.assumptions.knowAngular': 'Do we know Angular?',
      'slide.assumptions.raiseHand': 'Raise your hand if yes',
      'slide.assumptions.templateDriven': 'Template-driven forms - those forms with directives',
      'slide.assumptions.reactive': 'Reactive forms - those forms with observables',
      'slide.assumptions.signals': 'Signals - new reactive type',
      'slide.assumptions.signalForms': 'Signal-based forms - new forms with signals',
      'slide.assumptions.goThrough': 'We will go through all three approaches today and compare them a bit!',
      
      'slide.useCase.title': 'Use Case',
      'slide.useCase.what': 'What exactly will we work on?',
      'slide.useCase.userRegistration': 'User registration form',
      'slide.useCase.dynamicAddresses': 'Dynamic address list',
      'slide.useCase.syncValidation': 'Synchronous validation (e.g. required fields)',
      'slide.useCase.asyncValidation': 'Asynchronous validation (whether email is taken)',
      'slide.useCase.fieldDependencies': 'Dependencies between fields',
      'slide.useCase.passwordStrength': 'Password strength checking',
      'slide.useCase.errorMessages': 'Error messages',
      
      'slide.thankYou.title': 'Thank you very much',
      'slide.thankYou.links': 'Some links'
    };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private interpolate(template: string, params?: { [key: string]: string | number }): string {
    if (!params) return template;
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  setLanguage(lang: Language) {
    if (this.currentLanguage() === lang) return;
    
    this.currentLanguage.set(lang);
    
    // Update query param without navigation
    const urlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: { lang },
      queryParamsHandling: 'merge'
    });
    
    this.router.navigateByUrl(urlTree, { replaceUrl: true, skipLocationChange: false });
  }

  getLanguage(): Language {
    return this.currentLanguage();
  }
}

