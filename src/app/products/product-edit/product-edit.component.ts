import { Component, OnInit } from '@angular/core';

import { MessageService } from '../../messages/message.service';

import { Product, ProductResolved } from '../product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  pageTitle = 'Product Edit';
  errorMessage!: string;
  //product!: Product | null;
  private dataIsValid: { [key: string]: boolean } = { }
  private currentProduct!: Product;
  private originalProduct!: Product;

  get isDirty() {
    return JSON.stringify(this.originalProduct) !== JSON.stringify(this.currentProduct)
  }

  get product(): Product {
    return this.currentProduct;
  }

  set product(value: Product) {
    // const productName = this.product.productName || 'New Product';
    // return confirm(`Do you want to loose away yo changes to ${productName}?`)
    this.currentProduct = value;
    this.originalProduct = { ...value }
  }  


  constructor(private productService: ProductService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router) { }

    ngOnInit(): void {
      this.route.data.subscribe(data => {
        const resolvedData: ProductResolved = data['resolvedData'];
        this.onProductRetrieved(resolvedData.product);
        this.errorMessage = <string>resolvedData.error;
      })
    }

  getProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: product => this.onProductRetrieved(product),
      error: err => this.errorMessage = err
    });
  }

  onProductRetrieved(product: Product | null): void {
    this.product = <Product>product;

    if (!this.product) {
      this.pageTitle = 'No product found';
    } else {
      if (this.product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
      if (!this.product || !this.product.id) {
        // Don't delete, it was never saved.
        this.onSaveComplete(`${this.product?.productName} was deleted`);
      } else {
        if (confirm(`Really delete the product: ${this.product.productName}?`)) {
          this.productService.deleteProduct(this.product.id).subscribe({
            next: () => this.onSaveComplete(`${this.product?.productName} was deleted`),
            error: err => this.errorMessage = err
          });
        }
      }
  }

  isValid(path?: string): boolean {
    this.validate()

    if (path && this.dataIsValid) {
      return this.dataIsValid[path]
    }
    return (this.dataIsValid && Object.keys(this.dataIsValid).every(d => this.dataIsValid[d])) === true;
    
  }

  saveProduct(): void {
    if (this.isValid()) {
      if (this.product?.id === 0) {
        this.productService.createProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The new ${this.product?.productName} was saved`),
          error: err => this.errorMessage = err
        });
      } else {
        this.productService.updateProduct(<Product>this.product).subscribe({
          next: () => this.onSaveComplete(`The updated ${this.product?.productName} was saved`),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }
    this.reset();

    // Navigate back to the product list
    this.router.navigate(['/products']);    
  }


  reset(): void {
    // this.dataIsValid = null;
    // this.currentProduct = null;
    // this.originalProduct = null;
  }

  validate(): void {
    // we are doing manual validation across the form fields from the parent component button; because the info and tag tabs are in different components
    // Clear the validation
    this.dataIsValid = {};
    
    //info tab
    if (this.product?.productName && this.product.productName.length > 3 && this.product.productCode) {
      this.dataIsValid['info'] = true;
    } else {
      this.dataIsValid['info'] = false;
    }

    //tags tab
    if (this.product?.category && this.product.category.length > 3) {
      this.dataIsValid['tags'] = true;
    } else {
      this.dataIsValid['tags'] = false;
    }
  }
}

  