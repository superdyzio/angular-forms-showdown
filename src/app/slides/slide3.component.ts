import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'afs-slide3',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="slide-container">
      <h1>Reactive Forms</h1>
      <div class="slide-content">
        <h2>Key Characteristics</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>🎛️ Explicit Control</h3>
            <p>Form state is explicitly managed using FormControl, FormGroup, and FormArray</p>
          </div>
          <div class="feature-card">
            <h3>🔍 Type Safety</h3>
            <p>Better TypeScript support with strongly typed form controls and validation</p>
          </div>
          <div class="feature-card">
            <h3>🧪 Testable</h3>
            <p>Easier to unit test since form logic is in the component, not the template</p>
          </div>
          <div class="feature-card">
            <h3>⚡ Performance</h3>
            <p>More efficient for complex forms with better change detection control</p>
          </div>
        </div>
        <div class="code-example">
          <h3>Example:</h3>
          <pre><code>userForm = new FormGroup(&#123;
  name: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email])
&#125;);

&lt;form [formGroup]="userForm"&gt;
  &lt;input formControlName="name"&gt;
  {{"@if (userForm.get('name')?.invalid) {"}}
    &lt;div&gt;Name is required!&lt;/div&gt;
  {{'}'}}
&lt;/form&gt;</code></pre>
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
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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
export class Slide3Component {}