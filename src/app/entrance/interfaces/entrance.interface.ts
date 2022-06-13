/* eslint-disable no-magic-numbers */
export interface Client {
    name: string;
}
export interface Device {
    atm: string;
    client?: string;
    operator?: string;
    observers?: string[];
    state: string;
}
export interface State {
    connected: boolean;
    clients?: Client[];
    devices?: Device[];
}

export interface AtmInfo {
    name: string;
    capability: CapabilitiesAtm;
}

export enum CapabilitiesAtm {
    all = 1,
    onlyMaint = 2,
    onlyClient = 3,
    onlyStatus = 4,
}
