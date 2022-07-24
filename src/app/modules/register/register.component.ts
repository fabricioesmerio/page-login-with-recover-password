import { PageBaseComponent } from '@/shared/page.base.component';
import {
    Component,
    OnInit,
    Renderer2,
    OnDestroy,
    HostBinding
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '@services/app.service';
import { CryptoService } from '@services/crypto.service';
import { ToastrService } from 'ngx-toastr';
import { RegisterModel } from './models/register.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends PageBaseComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'register-box';

    public registerForm: FormGroup;

    constructor(
        private renderer: Renderer2,
        private router: Router,
        private appService: AppService,
        toastr: ToastrService,
    ) {
        super(toastr);
    }

    ngOnInit() {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'register-page'
        );
        this.registerForm = new FormGroup({
            name: new FormControl(null, Validators.required),
            email: new FormControl(null, Validators.required),
            password: new FormControl(null, [Validators.required]),
            retypePassword: new FormControl(null, [Validators.required])
        });
    }

    async registerByAuth() {
        if (!this.validateForm()) return;

        this.loading = true;

        let crypto = new CryptoService();

        let registerModel = new RegisterModel();
        registerModel.email = this.registerForm.get('email').value;
        registerModel.name = this.registerForm.get('name').value;
        registerModel.password = crypto.encrypt(this.registerForm.get('retypePassword').value);

        try {
            let result = await this.appService.registerByAuth(registerModel);
            if (result) {
                this.toastr.success("Registrado com sucesso.");
                this.router.navigate(['/']);
            } else this.toastr.error("Ocorreu um erro ao criar o registro.");
        } catch (error) {
            this.handleError(error);
        }
        finally {
            this.loading = false;
        }


    }

    private validateForm(): boolean {
        if (this.registerForm.valid) {
            const { password, retypePassword } = this.registerForm.getRawValue();
            if (password == retypePassword) return true;
            this.toastr.error("As senhas não estão idênticas");
            return false;
        }
        this.toastr.error("O formulário está inválido.");
        return false;
    }

    ngOnDestroy() {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'register-page'
        );
    }
}
