import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeProviderComponent } from '@crm-project/ui/core/theme-provider';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  template: `
    <lib-theme-provider>
      <app-header />
      <router-outlet></router-outlet>
    </lib-theme-provider>
  `,
  imports: [RouterModule, ThemeProviderComponent, HeaderComponent],
})
export class AppComponent {}
