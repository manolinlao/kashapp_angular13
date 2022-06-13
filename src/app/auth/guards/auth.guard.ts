/* eslint-disable no-console */
/* eslint-disable multiline-comment-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TraceService } from '../../services/trace.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private trace: TraceService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.verifyAuthentication().pipe(
      tap((isAuthenticaded) => {
        this.trace.write('GUARD activate', 'true');
        if (!isAuthenticaded) {
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.verifyAuthentication().pipe(
      tap((isAuthenticaded) => {
        this.trace.write('GUARD service', 'false');
        if (!isAuthenticaded) {
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
}
