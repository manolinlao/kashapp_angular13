/* eslint-disable id-length */
export interface Atm {
    name: string;
    coordX: number;
    coordY: number;
    width: number;
    height: number;
    zonaCash: ZonaCash;
}

interface ZonaCash {
    x: number;
    y: number;
    w: number;
    h: number;
    o: number;
}

export const mapWidth: number = 400;
export const mapHeight: number = 420;
export const atmMap: Atm[] = [
    {
        name: '84',
        coordX: 86,
        coordY: 29,
        width: 40,
        height: 40,
        zonaCash: {
            x: 135,
            y: 36,
            w: 40,
            h: 40,
            o: 4,
        },
    },
    {
        name: 'SW Rig',
        coordX: 86,
        coordY: 76,
        width: 40,
        height: 40,
        zonaCash: {
            x: 135,
            y: 83,
            w: 40,
            h: 40,
            o: 4,
        },
    },
    {
        name: '27',
        coordX: 86,
        coordY: 138,
        width: 40,
        height: 40,
        zonaCash: {
            x: 135,
            y: 146,
            w: 40,
            h: 40,
            o: 4,
        },
    },
    {
        name: 'emul',
        coordX: 86,
        coordY: 185,
        width: 40,
        height: 40,
        zonaCash: {
            x: 135,
            y: 193,
            w: 40,
            h: 40,
            o: 4,
        },
    },
    {
        name: '83',
        coordX: 231,
        coordY: 66,
        width: 40,
        height: 40,
        zonaCash: {
            x: 223,
            y: 116,
            w: 40,
            h: 40,
            o: 1,
        },
    },
    {
        name: '32423',
        coordX: 47,
        coordY: 299,
        width: 40,
        height: 40,
        zonaCash: {
            x: 55,
            y: 245,
            w: 40,
            h: 40,
            o: 3,
        },
    },
    {
        name: '43234',
        coordX: 94,
        coordY: 299,
        width: 40,
        height: 40,
        zonaCash: {
            x: 100,
            y: 245,
            w: 40,
            h: 40,
            o: 3,
        },
    },
    {
        name: 'S100',
        coordX: 171,
        coordY: 299,
        width: 40,
        height: 40,
        zonaCash: {
            x: 178,
            y: 245,
            w: 40,
            h: 40,
            o: 3,
        },
    },
    {
        name: '24',
        coordX: 218,
        coordY: 299,
        width: 40,
        height: 40,
        zonaCash: {
            x: 225,
            y: 245,
            w: 40,
            h: 40,
            o: 3,
        },
    },
];
