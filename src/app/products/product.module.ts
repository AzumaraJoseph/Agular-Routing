import { NgModule } from '@angular/core';

import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ProductEditTagsComponent } from './product-edit/product-edit-tags.component';
import { ProductEditInfoComponent } from './product-edit/product-edit-info.component';
import { ProductResolver } from './product-resolver.resolver';
import { ProductEditGuard } from './product-edit.guard';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([   
      { path: '', component: ProductListComponent },
      // child routes extends the parent route: 'products'. so we dont add the products in front of the id parameters
      { path: ':id', 
      resolve: { resolvedData: ProductResolver },
      component: ProductDetailComponent
      },
      { path: ':id/edit',
        component: ProductEditComponent,
        resolve: { resolvedData: ProductResolver },
        canDeactivate: [ProductEditGuard],
        children: [
          { path: '', redirectTo: 'info', pathMatch: 'full' },
          { path: 'info', component: ProductEditInfoComponent },
          { path: 'tags', component: ProductEditTagsComponent }
        ]
      },
        
    ])
  ],
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductEditComponent,
    ProductEditTagsComponent,
    ProductEditInfoComponent
  ]
})
export class ProductModule { }


