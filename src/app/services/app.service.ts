import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RegisterModel } from '@modules/register/models/register.model';
import { Login } from '@modules/login/models/login.model';
import { ApiService } from './api.service';
import { ApiRoutesEnum } from '@/utils/apiRoutes.enum';

export interface ResultValidateCode {
    success: boolean,
    message?: string
}

export interface RecoverPasswordInput {
    email: string;
    novaSenha: string
}

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public user: any = null;

    constructor(
        private toastr: ToastrService,
        private apiService: ApiService<any>
    ) { }

    async loginByAuth(args: Login): Promise<{token: string}> {
        try {
            return this.apiService.post<{token: string}>(ApiRoutesEnum.Login, args).toPromise();
        } catch (error) {
            throw error;
        }
    }

    async registerByAuth(args: RegisterModel) {
        try {
            return this.apiService.post(ApiRoutesEnum.User, args).toPromise();
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    forgotPassword(args: { email: string }) {
        try {
            return this.apiService.post(ApiRoutesEnum.ForgotPassword, args).toPromise();
        } catch (error) {
            throw error;
        }
    }

    validateCode(args: { email: string, codigo: string }): Promise<ResultValidateCode> {
        try {
            return this.apiService.post<ResultValidateCode>(ApiRoutesEnum.ValidateCode, args).toPromise();
        } catch (error) {
            throw error;
        }
    }

    recoverPassword(args: RecoverPasswordInput) {
        try {
            return this.apiService.post<number>(ApiRoutesEnum.RecoverPassword, args).toPromise();
        } catch (error) {
            throw error;
        }
    }

    getProfile() { }

    logout() { }
}
