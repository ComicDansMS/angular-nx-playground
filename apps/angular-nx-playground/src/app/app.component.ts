import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeProviderComponent } from '@crm-project/ui/core/theme-provider';

@Component({
  selector: 'app-root',
  template: `
    <lib-theme-provider>
      <router-outlet></router-outlet>
    </lib-theme-provider>
  `,
  imports: [RouterModule, ThemeProviderComponent],
})
export class AppComponent {}
