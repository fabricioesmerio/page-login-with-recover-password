import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    loading: boolean = false;
    TIME: number = 1000;

    constructor(
        private router: Router
    ) {
        this.router.events.subscribe((e: RouterEvent) => {
            this.navigationInterceptor(e);
        })
    }


    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.loading = true;
        }
        if (event instanceof NavigationEnd) {
            setTimeout(() => {
                this.loading = false;
            }, this.TIME);
        }
        if (event instanceof NavigationCancel) {
            setTimeout(() => {
                this.loading = false;
            }, this.TIME);
        }
        if (event instanceof NavigationError) {
            setTimeout(() => {
                this.loading = false;
            }, this.TIME);
        }
    }
}
