import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControlConfig, ValidationRules } from '../../interfaces/interfaces';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  @Input() formName :any ;
  @Input() formControlsData !: FormControlConfig[];
  @Output() formSubmit = new EventEmitter<any>();

  constructor(private fb : FormBuilder){

  }

  ngOnInit(){
    this.buildForm();

  }

  buildForm(){
    this.formName = this.fb.group({});
    this.formControlsData.forEach(control => {
      const validators = this.getValidators(control.validation)
      this.formName.addControl(control.id, this.fb.control(''));
    })
  }

  getValidators(validationRules: ValidationRules | undefined) {
    const validators = [];
    if (validationRules) {
      if (validationRules.required) validators.push(Validators.required);
      if (validationRules.minLength) validators.push(Validators.minLength(validationRules.minLength));
      if (validationRules.maxLength) validators.push(Validators.maxLength(validationRules.maxLength));
      if (validationRules.pattern) validators.push(Validators.pattern(validationRules.pattern));
    }
    return validators;
  }

  getErrorMessage(field: FormControlConfig) {
    const control = this.formName.get(field.name);
    if (control && control.touched && control.errors) {
      if (control.errors.required) return field.errortext?.required;
      if (control.errors.minlength) return field.errortext?.minLength;
      if (control.errors.maxlength) return field.errortext?.maxLength;
      if (control.errors.pattern) return field.errortext?.pattern;
    }
    return null;
  }

  onSubmitForm(){
    if(this.formName.valid){
      this.formSubmit.emit(this.formName.value);
    }
  }

}
