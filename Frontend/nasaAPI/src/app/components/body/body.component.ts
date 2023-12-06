import { Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm} from '@angular/forms';
import { Asteroid } from 'src/app/Models/Asteorids';
import { AskAPIService } from 'src/app/services/ask-api.service';

interface formValue {
  page: number;
}

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit{
  @ViewChild("formDirective") formDirective: NgForm;

  bodyString: string;
  form: FormGroup;

  constructor( private askAPIService: AskAPIService) {}

  ngOnInit(): void {
    this.form = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      page: new FormControl("", [Validators.required, Validators.minLength(0)])
    })
  }

  getAsteroids( page: number) {
    return this.askAPIService.getAsteroids(page);
  }

  reset(formValue: formValue) {
    this.getAsteroids(formValue.page).then( (response) => {
      this.bodyString = response.near_earth_objects[0].toString();
      console.log(response.page)
    })
  }

}
