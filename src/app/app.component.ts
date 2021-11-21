import { Component, HostBinding } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'corona-worldwide';
  private isDark = false;

  @HostBinding('class') get themeMode() {
    return this.isDark ? 'theme-dark' : 'theme-light';
  }

  onThemeSwitched({ checked }: MatSlideToggleChange) {
    this.isDark = checked;
  }
}
