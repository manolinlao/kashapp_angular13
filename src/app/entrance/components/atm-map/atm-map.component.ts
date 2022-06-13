/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-param-reassign */
/* eslint-disable no-implicit-coercion */
/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
/* eslint-disable id-length */
/* eslint-disable arrow-body-style */
/* eslint-disable multiline-comment-style */
/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-magic-numbers */
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  HostListener,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { Subscription, fromEvent } from 'rxjs';
import { TraceService } from '../../../services/trace.service';
import { Atm, atmMap } from '../../map-data/lab000';

import { TranslateService } from '@ngx-translate/core';
import { AtmInfo, CapabilitiesAtm } from '../../interfaces/entrance.interface';

@Component({
  selector: 'app-atm-map',
  templateUrl: './atm-map.component.html',
  providers: [],
})
export class AtmMapComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() atms: AtmInfo[] = [];
  @Output() selectAtm: EventEmitter<string> = new EventEmitter();
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | null;
  private canvasEl!: HTMLCanvasElement;
  canvasSubscription!: Subscription;

  private myAtmMap: Atm[] = [];

  private imageRatio: number = 0;
  private imgWidth: number = 0;
  private img: any;
  private scale: number = 1;
  private imgIconoCash: any;
  private imgIconoStatus: any;
  private imgIconoMop: any;

  displayAtmInfo: boolean = false;

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    try {
      this.canvasEl.width = Math.min(window.innerWidth - 50, this.imgWidth);
      this.canvasEl.height = this.canvasEl.width / this.imageRatio;
      this.scale = this.imgWidth / this.canvasEl.width;
      this.drawMap();
    } catch (err) {
      this.traceService.write3(
        'atm-map',
        'getScreenSize err',
        JSON.stringify(err),
        false
      );
    }
  }

  constructor(
    private traceService: TraceService,
    private translateService: TranslateService
  ) {}
  ngOnInit(): void {
    this.traceService.write('atm-map', 'on init');
    // this.getScreenSize();

    // Para clonar, porque el array es de objetos
    this.myAtmMap = atmMap.map((el) => ({ ...el }));

    // detects orientation of mobile
    window.addEventListener('orientationchange', (event: any) => {
      this.traceService.write('atm-map', 'orientation changed', false);
      this.getScreenSize();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.atms) {
      try {
        this.drawMap();
      } catch (err) {}
    }
  }

  ngAfterViewInit() {
    this.traceService.write('atm-map', 'afterviewinit', false);
    this.traceService.write3('atm-map', 'atms', JSON.stringify(this.atms));

    this.canvasEl = this.canvas.nativeElement;
    this.ctx = this.canvasEl.getContext('2d');

    this.ctx!.lineWidth = 3;
    this.ctx!.lineCap = 'round';
    this.ctx!.strokeStyle = '#000';

    this.imgIconoCash = new Image();
    this.imgIconoCash.src = 'assets/img/iconocash.png';
    this.imgIconoMop = new Image();
    this.imgIconoMop.src = 'assets/img/iconomop.png';
    this.imgIconoStatus = new Image();
    this.imgIconoStatus.src = 'assets/img/iconostatus.png';

    this.img = new Image();

    this.img.onload = () => {
      this.imgWidth = this.img.width;
      this.imageRatio = this.img.width / this.img.height;

      this.canvasEl.width = Math.min(window.innerWidth - 50, this.img.width);
      this.canvasEl.height = this.canvasEl.width / this.imageRatio;

      this.scale = this.img.width / this.canvasEl.width;

      this.drawMap();

      // captura eventos en el canvas
      this.captureEvents(this.canvasEl);
    };
    this.img.src = 'assets/img/lab000.png';
  }

  drawMap() {
    // draw lab000
    this.ctx!.drawImage(
      this.img,
      0,
      0,
      this.canvasEl.width,
      this.canvasEl.height
    );

    for (let ind = 0; ind < this.myAtmMap.length; ind++) {
      this.drawAtm(this.myAtmMap[ind]);
    }
  }

  drawAtm(atm: Atm) {
    // this.ctx!.fillRect(x / this.scale, y / this.scale, w / this.scale, h / this.scale);
    const atmInfo = this.isAtmAvailable(atm.name);

    if (atmInfo) {
      let colorAtm = '#00ff00';
      let iconoImg = this.imgIconoCash;

      switch (atmInfo.capability) {
        case CapabilitiesAtm.all:
          colorAtm = '#00ff00';
          iconoImg = this.imgIconoCash;
          break;
        case CapabilitiesAtm.onlyClient:
          colorAtm = '#872661';
          iconoImg = this.imgIconoCash;
          break;
        case CapabilitiesAtm.onlyMaint:
          colorAtm = '#9e8929';
          iconoImg = this.imgIconoMop;
          break;
        case CapabilitiesAtm.onlyStatus:
          colorAtm = '#0000ff';
          iconoImg = this.imgIconoStatus;
          break;
        default:
          break;
      }
      this.ctx!.fillStyle = colorAtm;
      this.ctx!.fillRect(
        atm.coordX / this.scale,
        atm.coordY / this.scale,
        atm.width / this.scale,
        atm.height / this.scale
      );
      this.ctx!.fillStyle = '#000000';
      if (atmInfo.capability !== CapabilitiesAtm.all) {
        this.ctx!.fillStyle = '#dddddd';
      }
      this.ctx!.drawImage(
        iconoImg,
        atm.zonaCash.x / this.scale + 3,
        atm.zonaCash.y / this.scale + 3
      );
      this.ctx!.fillText(
        atm.name,
        atm.coordX / this.scale + 3,
        atm.coordY / this.scale + 10
      );
    } else {
      this.ctx!.fillStyle = '#dddddd';
      this.ctx!.fillText(
        atm.name,
        atm.coordX / this.scale + 3,
        atm.coordY / this.scale + 10
      );
    }
  }

  isAtmAvailable(atmName: string): AtmInfo | undefined {
    return this.atms.find((atmInfo) => atmInfo.name === atmName);
  }

  getCapability(atmName: string) {}

  captureEvents(canvasEl: HTMLCanvasElement) {
    this.canvasSubscription = fromEvent(canvasEl, 'mousedown').subscribe(
      (res: any) => {
        const rect = this.canvasEl.getBoundingClientRect();

        const atmSelected = this.atmClicked(
          res.clientX - rect.left,
          res.clientY - rect.top
        );

        if (atmSelected !== '') {
          this.traceService.write3('atm-map', 'atmSelected', atmSelected);
          if (this.isAtmAvailable(atmSelected)) {
            this.selectAtm.emit(atmSelected);
          } else {
            this.selectAtm.emit('not_available' + '#' + atmSelected);
          }
        }
      }
    );
  }

  atmClicked(x: number, y: number): string {
    x *= this.scale;
    y *= this.scale;

    for (let ind = 0; ind < this.myAtmMap.length; ind++) {
      if (
        x > this.myAtmMap[ind].coordX &&
        x < this.myAtmMap[ind].coordX + this.myAtmMap[ind].width
      ) {
        if (
          y > this.myAtmMap[ind].coordY &&
          y < this.myAtmMap[ind].coordY + this.myAtmMap[ind].height
        ) {
          return this.myAtmMap[ind].name;
        }
      }
    }

    return '';
  }

  closeAtmInfo() {
    this.displayAtmInfo = false;
  }

  ngOnDestroy() {
    // this will remove event lister when this component is destroyed
    try {
      this.canvasSubscription.unsubscribe();
    } catch (err) {}
  }
}
