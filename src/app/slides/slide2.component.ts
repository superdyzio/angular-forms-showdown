import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'afs-slide2',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="slide-container">
      <h1>Template-Driven Forms</h1>
      <div class="slide-content">
        <h2>Key Characteristics</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>🔧 Two-way Binding</h3>
            <p>Uses <code>[(ngModel)]</code> for automatic synchronization between form controls and component properties</p>
          </div>
          <div class="feature-card">
            <h3>📝 Template Logic</h3>
            <p>Form validation and logic is defined directly in the template using directives</p>
          </div>
          <div class="feature-card">
            <h3>⚡ Simple Setup</h3>
            <p>Quick to implement for simple forms with minimal boilerplate code</p>
          </div>
          <div class="feature-card">
            <h3>🎯 Form State</h3>
            <p>Angular automatically creates and manages the form state behind the scenes</p>
          </div>
        </div>
        <div class="code-example">
          <h3>Example:</h3>
          <pre><code>&lt;input [(ngModel)]="user.name" 
       name="name" 
       required 
       #name="ngModel"&gt;
&lt;div *ngIf="name.invalid && name.touched"&gt;
  Name is required!
&lt;/div&gt;</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .slide-container {
      padding: 2rem;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }
    
    h1 {
      font-size: 3rem;
      margin-bottom: 2rem;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .slide-content {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: #ffd700;
      text-align: center;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .feature-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 1.5rem;
      text-align: center;
      backdrop-filter: blur(10px);
    }
    
    .feature-card h3 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
      color: #ffd700;
    }
    
    .feature-card p {
      font-size: 1rem;
      line-height: 1.5;
    }
    
    .code-example {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      padding: 1.5rem;
      margin-top: 2rem;
    }
    
    .code-example h3 {
      color: #ffd700;
      margin-bottom: 1rem;
    }
    
    pre {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
    }
    
    code {
      color: #569cd6;
    }
  `]
})
export class Slide2Component {}
