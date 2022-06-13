export interface ValidationData {
    result: boolean;
    message: string;
}

export interface Denomination {
    id: number;
    num: number;
}

export interface DenominationSelected {
    id: number;
    selected: number;
}

export interface BillsDistribution {
    id: string;
    algorithm: string;
    name: string;
    bills: Denom[];
}

export interface Denom {
    numBills: number;
    denom: number;
}
