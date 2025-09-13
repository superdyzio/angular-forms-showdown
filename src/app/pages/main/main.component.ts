import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'afs-main',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {}
