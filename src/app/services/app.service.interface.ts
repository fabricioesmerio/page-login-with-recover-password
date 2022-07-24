import { Observable } from "rxjs";

export interface IAppService<T> {
    post(path: string, data?: any): Observable<T>;
}