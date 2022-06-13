import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    typeUser: string = '';
    atmName: string = '';
    userName: string = '';

    setTypeUser(typeUser: string, atmName: string, userName: string | undefined) {
        this.typeUser = typeUser;
        this.atmName = atmName;
        if (userName) {
            this.userName = userName;
        }
    }

    getTypeUser(): string {
        return this.typeUser;
    }
    getAtmName(): string {
        return this.atmName;
    }
    getUserName(): string {
        return this.userName;
    }

    resetTypeUser(): void {
        this.typeUser = '';
        this.atmName = '';
        this.userName = '';
    }
}
