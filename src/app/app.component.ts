import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostBinding,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'corona-worldwide';
  isDark = false;
  hostClass = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private themeService: ThemeService,
  ) {}

  @HostBinding('class') get themeMode() {
    return this.isDark ? 'theme-dark' : 'theme-light';
  }

  ngOnInit() {
    const darkTheme = localStorage.getItem('isDark');
    if (darkTheme === 'true') {
      this.isDark = true;
      this.themeService.switchTheme(this.isDark);
    }
    this.hostClass = this.isDark ? 'theme-dark' : 'theme-light';
    this.renderer.setAttribute(this.document.body, 'class', this.hostClass);
  }

  onThemeSwitched({ checked }: MatSlideToggleChange) {
    this.isDark = checked;
    if (checked) {
      localStorage.setItem('isDark', 'true');
    }
    if (!checked) {
      localStorage.setItem('isDark', 'false');
    }
    this.themeService.switchTheme(this.isDark);
    this.hostClass = this.isDark ? 'theme-dark' : 'theme-light';
    this.renderer.setAttribute(this.document.body, 'class', this.hostClass);
  }
}
