import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';
import { CryptoService } from '@services/crypto.service';
import { PageBaseComponent } from '@/shared/page.base.component';
import { BancoLocal } from '@/shared/indexeddb.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends PageBaseComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'login-box';

    public loginForm: FormGroup;

    constructor(
        private renderer: Renderer2,
        private appService: AppService,
        private router: Router,
        toastr: ToastrService
    ) {
        super(toastr);
    }

    ngOnInit() {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page'
        );
        this.loginForm = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, Validators.required)
        });
    }

    async loginByAuth() {
        try {
            if (this.loginForm.valid) {
                this.loading = true;
                let crypto = new CryptoService();
                let senhaCrypt = crypto.encrypt(this.loginForm.get('password').value)
                let result = await this.appService.loginByAuth({
                    email: this.loginForm.get('email').value,
                    password: senhaCrypt
                });
                if (result) {
                    this.toastr.success('Login efetuado com sucesso!');
                    await this.setToken(result.token);
                    this.router.navigate(['app'])
                }
                else
                    this.toastr.error('Ocorreu um erro!');
            } else {
                this.toastr.error('Formulário inválido!');
            }
        } catch (ex) {
            this.handleError(ex);
        } finally {
            this.loading = false;
        }

    }

    private async setToken(token: string) {
        try {
            await BancoLocal.auth.clear();
            await BancoLocal.auth.add({
                token
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    ngOnDestroy() {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}
