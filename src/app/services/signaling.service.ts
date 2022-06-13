/* eslint-disable no-trailing-spaces */
/* eslint-disable no-warning-comments */
/* eslint-disable spaced-comment */
/* eslint-disable max-len */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable multiline-comment-style */
/* eslint-disable no-console */
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {State} from '../entrance/interfaces/entrance.interface';
import {TraceService} from './trace.service';

const SIGNALING_SERVER = `${environment.signalingserver}`;
// const SIGNALING_SERVER = 'wss://temporaldfdasfdasf';

@Injectable({
    providedIn: 'root',
})
export class SignalingService {
    ws: WebSocket | null = null;
    subject: Subject<string>;
    subjectKumo: Subject<{[key: string]: any}>;
    subjectState: Subject<State>;
    connected = false;
    atms: string[] = [];
    clients: string[] = [];
    connectedAtm: string | null = null;
    name: string = '';
    atm: string = '';
    observingAtms: string[] = [];

    state: State = {connected: false};

    constructor(private trace: TraceService) {
        this.subject = new Subject();
        this.subjectKumo = new Subject();
        this.subjectState = new Subject();
    }

    init(token: string) {
        this.ws = new WebSocket(`${SIGNALING_SERVER}?token=${token}`);
        this.ws.onopen = () => {
            this.trace.write3('signaling.service', 'Connected WS to   Signaling server[connected]:', SIGNALING_SERVER);

            this.subjectState.next({connected: false});
            this.connected = true;
        };
        this.ws.onclose = () => {
            this.trace.write('signaling.service', 'on close');
            this.connected = false;
        };
        this.ws.onmessage = (msg) => {
            try {
                const result = JSON.parse(msg.data);
                this.trace.write('signaling.service', `message from Signaling server[${result.type}]`, result);

                if (result.type === 'kumo-event') {
                    this.subjectKumo.next(result.event);
                    this.subject.next(JSON.stringify(result.event));
                } else {
                    if (result.type === 'state') {
                        this.state = {
                            connected: true,
                            clients: result.state.clients,
                            devices: result.state.devices,
                        };
                        this.subjectState.next(this.state);
                    }
                    if (
                        result.type === 'new-client-atm' ||
                        result.type === 'new-operator-atm' ||
                        result.type === 'new-observer-atm'
                    ) {
                        this.connectedAtm = result.atm;
                        this.ws?.send(JSON.stringify({type: 'state'}));
                    }

                    if (
                        result.type === 'rm-client' ||
                        result.type === 'rm-atm' ||
                        result.type === 'new-atm' ||
                        result.type === 'new-client' ||
                        result.type === 'rm-operator-atm' ||
                        result.type === 'rm-observer-atm' ||
                        result.type === 'rm-client-atm'
                    ) {
                        //fuerzo recibir el state para propagarlo
                        this.ws?.send(JSON.stringify({type: 'state'}));
                    }

                    this.subject.next(JSON.stringify(result));
                }
            } catch (err) {
                console.error('Llega mensaje no parseable del Signaling server: ', msg);
            }
        };
    }

    close(): void {
        this.trace.write('signaling.service', 'close');
        this.ws?.send(JSON.stringify({type: 'leave'}));
    }

    getState(): State {
        return this.state;
    }

    getSubject() {
        return this.subject;
    }

    getSubjectKumo() {
        return this.subjectKumo;
    }

    getSubjectState() {
        return this.subjectState;
    }

    sendGetActualState(): void {
        this.ws?.send(JSON.stringify({type: 'state'}));
    }

    sendMessage(payload: string): void {
        this.ws?.send(JSON.stringify({type: 'kumo-event', atm: this.atm, name: this.name, event: JSON.parse(payload)}));
    }

    addClient(operator: string): void {
        this.ws?.send(JSON.stringify({type: 'new-client', name: operator}));
    }

    connectWithAtmAsClient(atm: string, name: string): void {
        this.name = name;
        this.atm = atm;
        this.ws?.send(JSON.stringify({type: 'new-client-atm', atm, name}));
    }

    connectWithAtmAsOperator(atm: string, name: string): void {
        this.name = name;
        this.atm = atm;
        this.ws?.send(JSON.stringify({type: 'new-operator-atm', atm, name}));
    }

    connectWithAtmAsObserver(atm: string, name: string): void {
        this.name = name;
        this.atm = atm;
        this.ws?.send(JSON.stringify({type: 'new-observer-atm', atm, name}));
    }

    removeUser(typeUser: string, atm: string, name: string): void {
        this.trace.write3('signaling.service', 'removeUser', `${typeUser}::${atm}::${name}`);

        let command = 'rm-client-atm';

        switch (typeUser) {
            case 'observer':
                command = 'rm-observer-atm';
                break;
            case 'operator':
                command = 'rm-operator-atm';
                break;
            case 'client':
                command = 'rm-client-atm';
                break;
            default:
                break;
        }
        this.ws?.send(JSON.stringify({type: command, atm, name}));
    }

    getAtms(): string[] {
        return this.atms;
    }

    getConnectedAtm(): string | null {
        return this.connectedAtm;
    }
}
