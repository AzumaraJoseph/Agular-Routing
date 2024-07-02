import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { ProductService } from './product.service';
import { ProductResolved } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<ProductResolved> {
  constructor(private productService: ProductService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductResolved> {
    // const id = route.paramMap.get('id');
    const id = route.params['id'];

    if (isNaN(+id)) {
      const message = `Product id was not a number: ${id}`;
      console.error(message);
      return of({product: null, error: message});
    }

    return this.productService.getProduct(+id)
    .pipe(
      map(product => ({ product: product })),
      catchError(error => {
      const message = `Retrieval error: ${error}`;
      console.error(message);    
      return of({product: null, error: message});
    }));
  }
}
