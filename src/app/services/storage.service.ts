/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Auth } from '../auth/interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private _cashapp_token: Auth;

  constructor(private storage: Storage) {
    console.log('storage.service', 'constructor');
    this.init();
  }

  async init() {
    console.log('storage.service', 'on init');
    const storage = await this.storage.create();
    this._storage = storage;
    this.removeLoginToken();
  }

  async saveLoginToken(token: Auth) {
    this._storage.set('cashapp_token', token);
    this._cashapp_token = { ...token };
  }

  async removeLoginToken() {
    try {
      this._storage.remove('cashapp_token');
      this._cashapp_token = null;
    } catch (err) {
      console.log('storage.service', err);
    }
  }

  getLoginToken(): Auth {
    return this._cashapp_token;
  }
}
