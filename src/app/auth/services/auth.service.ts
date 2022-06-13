/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-empty */
/* eslint-disable object-shorthand */
/* eslint-disable arrow-body-style */
/* eslint-disable no-undef */
/* eslint-disable no-magic-numbers */
/* eslint-disable multiline-comment-style */
/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../interfaces/auth.interface';
import { Observable, Subject, of } from 'rxjs';
import { TraceService } from '../../services/trace.service';
import { environment } from 'src/environments/environment';
import { StorageService } from '../../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private loginUrl: string = 'https://signaling.fujitsu-xfs4iot.net/login';
  private loginUrl: string = `${environment.httpSignalingServer}/login`;

  private usuario$ = new Subject<Auth | null>();

  private authorizedUser: Auth | undefined;

  get auth() {
    return { ...this.authorizedUser };
  }

  constructor(
    private http: HttpClient,
    private trace: TraceService,
    private storageService: StorageService
  ) {}

  login(user: string, pass: string): Observable<Auth | null> {
    this.trace.write3('auth.service', 'login', `${user}::****`);

    const objUser = {
      user,
      pass,
    };

    const body = JSON.stringify(objUser);

    let userResp: Auth = {
      name: '',
      token: '',
    };

    this.http.post<Auth>(this.loginUrl, body).subscribe({
      next: (resp: any) => {
        this.trace.write3('auth.service', 'response', JSON.stringify(resp));
        try {
          if (resp.login === 'ok') {
            userResp = {
              name: objUser.user,
              token: resp.token,
            };
          }
        } catch (err) {}

        this.usuario$.next(userResp);
      },
      error: (err) => {
        this.trace.write3('auth.service', 'error', JSON.stringify(err));

        this.usuario$.next(userResp);
      },
      complete: () => {},
    });

    return this.usuario$.asObservable();
  }

  setAuthorizedUser(user: Auth) {
    this.trace.write3(
      'auth.service',
      'setAuthorizedUser',
      JSON.stringify(user)
    );
    this.authorizedUser = { ...user };
  }

  verifyAuthentication(): Observable<boolean> {
    const token = this.storageService.getLoginToken();
    if (!token) {
      this.trace.write3('auth.service', 'verifyAuthentication', 'false');
      // la funcion of de rxjs retorna un observable del argumento que se le pasa
      return of(false);
    }

    this.trace.write3('auth.service', 'verifyAuthentication', 'true');

    this.authorizedUser = { ...token };

    return of(true);
  }
}
