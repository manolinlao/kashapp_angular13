/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TraceService } from './trace.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLangSubject: Subject<string> = new Subject();
  public readonly currentLang: Observable<string> =
    this.currentLangSubject.asObservable();

  constructor(private trace: TraceService) {}

  setCurrentLang(lang: string): void {
    this.trace.write('language.service', lang);
    this.currentLangSubject.next(lang);
  }
}
