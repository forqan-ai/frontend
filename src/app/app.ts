import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RegisterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
