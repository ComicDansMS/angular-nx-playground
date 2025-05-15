import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  template: `
    <app-header />
    <router-outlet></router-outlet>
  `,
  imports: [RouterModule, HeaderComponent],
})
export class AppComponent {}
