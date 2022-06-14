/* eslint-disable no-magic-numbers */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
export interface CashBox {
    id: string;
    highThreshold: number;
    lowThreshold: number;
    allowReject: boolean;
    boxType: string; // in, out, none
    capacity: number;
    status: string; // ok, nok
    serialNumber: string;
    retractType: string; // none
    denominations: CashBoxDenom[];
}

interface CashBoxDenom {
    name: string;
    denom: number;
    currency: string;
    initialBills: Bill;
    currentBills: Bill;
}

interface Bill {
    fit: number;
    unfit: number;
    suspect: number;
    counterfeit: number;
    inked: number;
}
