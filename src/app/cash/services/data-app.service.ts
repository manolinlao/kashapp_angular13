/* eslint-disable prefer-template */
/* eslint-disable no-useless-concat */
/* eslint-disable no-console */
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Denomination, DenominationSelected, ValidationData} from '../interfaces/app-cash.interface';
import {TraceService} from '../../services/trace.service';

export interface DenomPresented {
    name: string;
    value: number;
}
export interface CurrencyPresented {
    denom: string;
    numBills: number;
}

@Injectable({
    providedIn: 'root',
})
export class DataAppService {
    private maxBillsDispensables: number = 0;
    private importSelected: number = 0;
    private useDenoms: boolean = false;
    private billsByDenom: Denomination[] = [];
    private billsByDenomSelected: DenominationSelected[] = [];
    private algorithm: string = '';
    private denomsPresented: DenomPresented[] = [];
    private currenciesPresented: CurrencyPresented[] = [];

    constructor(private http: HttpClient, private trace: TraceService) {}

    setMaxBillsDispensables(value: number): void {
        this.maxBillsDispensables = value;
    }

    getMaxBillsDispensables(): number {
        return this.maxBillsDispensables;
    }

    setImportSelected(value: number): void {
        this.importSelected = value;
    }

    getImportSelected(): number {
        return this.importSelected;
    }

    getUseDenoms(): boolean {
        return this.useDenoms;
    }

    setUseDenoms(use: boolean) {
        this.useDenoms = use;
    }

    resetBillsByDenom() {
        this.trace.write('data-app.service', 'resetBillsByDenom', false);
        this.billsByDenom = [];
        this.billsByDenomSelected = [];
    }

    setBillsByDenom(denom: number, bills: number) {
        this.trace.write(
            'data-app.service',
            'setBillsByDenom' + '::' + denom.toString() + '::' + bills.toString(),
            false
        );
        if (bills > 0) {
            this.billsByDenom.push({id: denom, num: bills});
            this.billsByDenomSelected.push({id: denom, selected: 0});
        }
    }

    getBillsByDenom(): Denomination[] {
        return this.billsByDenom;
    }

    getBillsByDenomSelected(): DenominationSelected[] {
        return this.billsByDenomSelected;
    }

    setBillsByDenomSelected(selection: DenominationSelected[]): void {
        this.billsByDenomSelected = [...selection];
    }

    validate(value: number): Observable<ValidationData> {
        const params = new HttpParams().set('q', value);

        return this.http.get<ValidationData>('http://localhost:3000/validation_ok', {params});
    }

    getDenoms(): Observable<Denomination[]> {
        return this.http.get<Denomination[]>('http://localhost:3000/denominations');
    }

    setAlgorithm(alg: string) {
        this.algorithm = alg;
    }

    getAlgorithm(): string {
        return this.algorithm;
    }

    setDenomsPresented(denomPresented: DenomPresented[]): void {
        this.denomsPresented = [...denomPresented];
    }
    geDenomsPresented(): DenomPresented[] {
        return this.denomsPresented;
    }

    setCurrenciesPresented(currenciesPresented: CurrencyPresented[]): void {
        this.currenciesPresented = [...currenciesPresented];
    }
    getCurrenciesPresented(): CurrencyPresented[] {
        return this.currenciesPresented;
    }
}
