import { Component, OnInit } from '@angular/core';

import { Product, ProductResolved } from './product';
import { ProductService } from './product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  pageTitle = 'Product Detail';
  product!: Product | null;
  errorMessage!: string;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    //const id = this.route.snapshot.params['id']

    // this.route.paramMap.subscribe(params => {
    //   const id = params.get('id');
    //   this.getProduct(Number(id));
    // })

    const resolvedData: ProductResolved = this.route.snapshot.data['resolvedData'];
    this.errorMessage = <string>resolvedData.error
    this.onProductRetrieved(resolvedData.product);
  }

  getProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: product => this.onProductRetrieved(product),
      error: err => this.errorMessage = err
    });
  }

  onProductRetrieved(product: Product | null): void {
    this.product = product;

    if (this.product) {
      this.pageTitle = `Product Detail: ${this.product.productName}`;
    } else {
      this.pageTitle = 'No product found';
    }
  }
}
