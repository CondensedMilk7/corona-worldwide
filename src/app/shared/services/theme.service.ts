import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  darkTheme = new Subject();
  isDark = false;

  switchTheme(isDark: boolean) {
    this.darkTheme.next(isDark);
  }
}
