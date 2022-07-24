import {
    Component,
    HostBinding,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CryptoService } from '@services/crypto.service';
import { PageBaseComponent } from '@/shared/page.base.component';

@Component({
    selector: 'app-recover-password',
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent extends PageBaseComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'login-box';

    public recoverPasswordForm: FormGroup;
    private paramCode: { email: string, codigo: any };

    constructor(
        private renderer: Renderer2,
        private appService: AppService,
        private route: ActivatedRoute,
        private router: Router,
        toastr: ToastrService
    ) {
        super(toastr);
    }

    async ngOnInit() {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page'
        );
        this.recoverPasswordForm = new FormGroup({
            password: new FormControl(null, Validators.required),
            confirmPassword: new FormControl(null, Validators.required)
        });
        let code = this.route.snapshot.paramMap.get('code')
        if (code) {
            this.paramCode = JSON.parse(window.atob(code));            
            await this.validateCode();
        } else {
            this.redirectToLogin();
        }
    }

    private redirectToLogin(error: string = null, type: string = null) {
        this.toastr[type || 'error'](error || 'Código inválido ou não informado.');
        this.router.navigate(['login']);
    }

    async recoverPassword() {
        try {
            if (this.validateForm()) {
                this.loading = true;
                let crypto = new CryptoService();
                const senhaCrypt = crypto.encrypt(this.recoverPasswordForm.get('confirmPassword').value);
                let result = await this.appService.recoverPassword({
                    email: this.paramCode.email,
                    novaSenha: senhaCrypt
                })
                if (result) {
                    this.redirectToLogin('Senha alterada com sucesso.', 'success');
                } else {
                    this.toastr.error('Ocorreu um erro ao tentar alterar a senha.');
                }
            } else {
                this.toastr.error('As senhas informadas não conferem.');
            }
        } catch (errror) {
            this.handleError(errror);
        }
        finally {
            this.loading = false
        }
    }

    private validateForm(): boolean {
        if (this.recoverPasswordForm.valid) {
            return this.recoverPasswordForm.get('password').value == this.recoverPasswordForm.get('confirmPassword').value
        }
        return false;
    }

    private async validateCode() {
        try {
            this.loading = true
            let result = await this.appService.validateCode(this.paramCode);
            if (result.success)
                this.toastr.success('Sucesso!', 'Informe a nova senha')
            else
                this.redirectToLogin(result.message);
        } catch (error) {
            this.handleError(error);
        } finally {
            this.loading = false
        }
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}
