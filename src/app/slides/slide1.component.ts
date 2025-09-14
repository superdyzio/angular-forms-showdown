import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'afs-slide1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="slide-container">
      <h1>Welcome to Angular Forms</h1>
      <div class="slide-content">
        <h2>What are Angular Forms?</h2>
        <p>Angular provides two approaches for handling user input through forms:</p>
        <ul>
          <li><strong>Template-driven forms</strong> - Forms where the logic is defined in the template</li>
          <li><strong>Reactive forms</strong> - Forms where the logic is defined in the component</li>
          <li><strong>Signal-based forms</strong> - The new approach using Angular signals</li>
        </ul>
        <div class="highlight-box">
          <p>Today we'll explore all three approaches and see their differences!</p>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    h1 {
      font-size: 3rem;
      margin-bottom: 2rem;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .slide-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #ffd700;
    }
    
    p {
      font-size: 1.2rem;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    
    ul {
      font-size: 1.1rem;
      line-height: 1.8;
      margin: 1.5rem 0;
    }
    
    li {
      margin-bottom: 0.5rem;
    }
    
    .highlight-box {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid #ffd700;
      border-radius: 10px;
      padding: 1.5rem;
      margin-top: 2rem;
      text-align: center;
    }
    
    .highlight-box p {
      font-size: 1.3rem;
      font-weight: bold;
      margin: 0;
    }
  `]
})
export class Slide1Component {}
