import {
    Component,
    HostBinding,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from '@services/app.service';
import { PageBaseComponent } from '@/shared/page.base.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class ForgotPasswordComponent extends PageBaseComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'login-box';
    public forgotPasswordForm: FormGroup;

    constructor(
        private renderer: Renderer2,
        private appService: AppService,
        toastr: ToastrService
    ) { 
        super(toastr)
    }

    ngOnInit(): void {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page'
        );
        this.forgotPasswordForm = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.email])
        });
    }

    async forgotPassword(): Promise<void> {
        try {
            if (this.forgotPasswordForm.valid) {
                this.loading = true;
                let result = await this.appService.forgotPassword({
                    email: this.forgotPasswordForm.get('email').value
                });
                if (result)
                    this.toastr.success('Se o email informado estiver correto, em instantes você receberá o código');
            } else {
                this.toastr.error('O email informado não é válido.');
            }
        } catch (error) {
            this.handleError(error);
        } finally {
            this.loading = false;
        }
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}
