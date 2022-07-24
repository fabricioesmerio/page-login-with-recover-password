import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

export class PageBaseComponent {

    loading: boolean = false;

    constructor(
        public toastr: ToastrService
    ) { }

    handleError(error: HttpErrorResponse) {
        this.toastr.error(error.error || error.message);
    }
}