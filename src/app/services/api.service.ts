import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { IAppService } from './app.service.interface';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService<T> implements IAppService<T> {
    
    private env = environment;
    
    constructor(private http: HttpClient) {}
    
    
    post<T>(path: string, data?: any): Observable<T> {
        return this.http.post<T>(this.env.apiURL + path, data);
    }


}
