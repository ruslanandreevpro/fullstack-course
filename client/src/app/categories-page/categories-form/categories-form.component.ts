import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {MaterialServie} from "../../shared/classes/material.servie";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef
  form: FormGroup
  isNew = true
  image: File
  imagePreview: string | ArrayBuffer = ''
  category: Category

  constructor(private route: ActivatedRoute, private categoriesService: CategoriesService, private router: Router) { }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    // this.route.params.subscribe((params: Params) => {
    //   if (params['id']) {
    //     // Редактируем категорию
    //     this.isNew = false
    //   }
    // })

    this.form.disable()

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            }

            return of(null)
          }
        )
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category
            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            MaterialServie.updateTextInputs()
          }
          this.form.enable()
        },
        error => MaterialServie.toast(error.error.message)
      )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  deleteCategory() {
    const decision = window.confirm(`Подтвердите удаление категории "${this.category.name}"`)

    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          response => MaterialServie.toast(response.message),
          error => MaterialServie.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }

  onSubmit() {
    let obs$
    this.form.disable()
    if (this.isNew) {
      // create
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      // update
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      (category: Category) => {
        this.category = category
        MaterialServie.toast('Изменения сохранены')
        this.form.enable()
      },
      error => {
        MaterialServie.toast(error.error.message)
        this.form.enable()
      }
    )
  }
}
