import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Step {
    step: number;
}

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private currentStepSubject: BehaviorSubject<Step> = new BehaviorSubject({} as Step);
    public readonly currentStep: Observable<Step> = this.currentStepSubject.asObservable();

    setCurrentStep(currentStep: Step): void {
        this.currentStepSubject.next(currentStep);
    }
}
