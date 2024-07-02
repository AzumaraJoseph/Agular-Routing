import { Injectable } from "@angular/core";
import { PreloadingStrategy, Route } from "@angular/router";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SelectiveStrategy implements PreloadingStrategy {

    preload(route: Route, load: Function): Observable<any> {
        if (route.data && route.data['preload']) {
            return load();
        }
        return of(null)
    }
    // preloads are best used for feature modules that are regularly visited while they are still lazy loaded like other feature modules
}