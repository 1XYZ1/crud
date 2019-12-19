import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
// Services
import { ProductService } from '../../../services/product.service';
// Product class
import { Product } from 'src/app/models/product';
// Animations
import { ToastrService } from 'ngx-toastr';
// Firebase
import { AngularFireStorage } from '@angular/fire/storage';

 // Form reactivo
 import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  



  constructor(public productService: ProductService, private toastr: ToastrService, private storage: AngularFireStorage) {

  }
  
  uploadPercent: Observable<number>;
  imgUrl: Observable<string>;

  ngOnInit() {
    this.productService.getProducts();
    this.resetForm();
  }

  resetForm(productForm?: NgForm) {

      if (productForm != null) {
        productForm.reset();
        this.productService.selectedProduct = new Product();
      }
   }


   onSubmit(productForm: NgForm) {

    if (productForm.value.$key == null) {
      this.productService.insertProduct(productForm.value)
      this.toastr.success('Successfull operation!!', 'Product Aggregated')

    } else {
      this.productService.updateProduct(productForm.value)
      this.toastr.success('Successfull operation!!', 'Product Updated')

    }
    this.resetForm(productForm);

    
  
    

   }

   onUpload(e) {
     console.log('subir', e.target.files[0]);
     const id = Math.random().toString(36).substring(2);
     const file = e.target.files[0];
     const filePath = `uploads/product_${id}`;
     const ref = this.storage.ref(filePath);
     const task = this.storage.upload(filePath,file);
     this.uploadPercent = task.percentageChanges();
     task.snapshotChanges().pipe(finalize (() => this.imgUrl = ref.getDownloadURL())).subscribe();
   }
}
