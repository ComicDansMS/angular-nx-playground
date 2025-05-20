import { InputComponent } from './input.component';
import { Component, ComponentRef, DebugElement, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

type InputType = 'text' | 'number' | 'email' | 'password';

@Component({
  template: `
    <lib-input
      [label]="label()"
      [id]="id()"
      [type]="inputType()"
      [placeholder]="placeholder()"
      [customErrorMessages]="customErrorMessages()"
      [background]="'white'"
      [formControl]="standaloneControl"
    ></lib-input>
    <lib-input
      [label]="label()"
      [id]="isRequiredFieldInputId()"
      [type]="inputType()"
      [placeholder]="placeholder()"
      [customErrorMessages]="customErrorMessages()"
      [background]="'white'"
      [formControl]="isRequiredStandaloneControl"
    ></lib-input>
  `,
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule]
})
class FormControlHostComponent {
  label = signal<string>('test label');
  id = signal<string>('id');
  isRequiredFieldInputId = signal<string>('isRequiredFieldInputId');
  inputType = signal<InputType>('text');
  placeholder = signal<string>('');
  customErrorMessages = signal<Record<string, string> | null>(null);
  standaloneControl = new FormControl('standalone value');
  isRequiredStandaloneControl = new FormControl(
    'is required standalone value',
    Validators.required
  );
}

@Component({
  template: `
    <form [formGroup]="form">
      <lib-input
        [label]="label()"
        [id]="id()"
        [type]="inputType()"
        [placeholder]="placeholder()"
        [customErrorMessages]="customErrorMessages()"
        [background]="'white'"
        formControlName="testControl"
      ></lib-input>
    </form>
  `,
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule]
})
class FormGroupHostComponent {
  label = signal<string>('test label');
  id = signal<string>('id');
  inputType = signal<InputType>('text');
  placeholder = signal<string>('');
  customErrorMessages = signal<Record<string, string> | null>(null);
  form = new FormGroup({
    testControl: new FormControl('initial value')
  });
}

// TODO: Test background colour of label when passed in a value

describe('InputFormFieldComponent', () => {
  describe('When provided with a standalone FormControl', () => {
    let hostFixture: ComponentFixture<FormControlHostComponent>;
    let hostComponent: FormControlHostComponent;

    let inputFormFieldDebugElement: DebugElement | undefined;
    let inputFormFieldComponent: InputComponent;
    let formFieldWrapperDebugElement: DebugElement;
    let inputDebugElement: DebugElement;
    let labelDebugElement: DebugElement;
    let inputElement: HTMLInputElement;
    let labelElement: HTMLLabelElement;

    let isRequiredInputFormFieldDebugElement: DebugElement | undefined;
    let isRequiredLabelDebugElement: DebugElement;
    let isRequiredLabelElement: HTMLLabelElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormControlHostComponent, ReactiveFormsModule]
      });

      hostFixture = TestBed.createComponent(FormControlHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const allFormFieldDebugElements = hostFixture.debugElement.queryAll(
        By.directive(InputComponent)
      );
      inputFormFieldDebugElement = allFormFieldDebugElements.find(
        (de) => de.componentInstance.id() === hostComponent.id()
      );
      if (!inputFormFieldDebugElement) {
        throw new Error(
          `Could not find InputFormFieldComponent with id: ${hostComponent.id()}`
        );
      }

      inputFormFieldComponent = inputFormFieldDebugElement.componentInstance;
      formFieldWrapperDebugElement = inputFormFieldDebugElement.query(
        By.css('.lib-input')
      );
      inputDebugElement = inputFormFieldDebugElement.query(By.css('input'));
      labelDebugElement = inputFormFieldDebugElement.query(By.css('label'));
      inputElement = inputDebugElement.nativeElement;
      labelElement = labelDebugElement.nativeElement;

      isRequiredInputFormFieldDebugElement = allFormFieldDebugElements.find(
        (de) =>
          de.componentInstance.id() === hostComponent.isRequiredFieldInputId()
      );
      if (!isRequiredInputFormFieldDebugElement) {
        throw new Error(
          `Could not find InputFormFieldComponent with id: ${hostComponent.isRequiredFieldInputId()}`
        );
      }

      isRequiredLabelDebugElement = isRequiredInputFormFieldDebugElement.query(
        By.css('label')
      );
      isRequiredLabelElement = isRequiredLabelDebugElement.nativeElement;
    });

    describe('Initialisation', () => {
      it('should create an instance', () => {
        expect(inputFormFieldComponent).toBeTruthy();
      });

      it('should be linked to the host\'s FormControl', () => {
        expect(inputFormFieldComponent.control).toBe(
          hostComponent.standaloneControl
        );
      });

      it('should set input ID', () => {
        expect(inputElement.id).toBe('id');
      });

      it('should set input type to \'text\' by when specified', () => {
        hostComponent.inputType.set('text');
        hostFixture.detectChanges();
        expect(inputElement.type).toBe('text');
      });

      it('should set input type to \'password\' when specified', () => {
        hostComponent.inputType.set('password');
        hostFixture.detectChanges();
        expect(inputElement.type).toBe('password');
      });

      it('should set input type to \'email\' when specified', () => {
        hostComponent.inputType.set('email');
        hostFixture.detectChanges();
        expect(inputElement.type).toBe('email');
      });

      it('should set input type to \'number\' when specified', () => {
        hostComponent.inputType.set('number');
        hostFixture.detectChanges();
        expect(inputElement.type).toBe('number');
      });

      it('should set label \'for\' attribute', () => {
        expect(labelElement.getAttribute('for')).toBe('id');
      });

      it('should display correct label text', () => {
        if (labelElement.textContent) {
          expect(labelElement.textContent.trim()).toBe('test label');
        } else {
          throw new Error('Label element not found');
        }
      });

      it('should display an asterisk when FormControl has isRequired validator', () => {
        if (isRequiredLabelElement.textContent) {
          expect(isRequiredLabelElement.textContent.trim()).toBe('test label*');
        } else {
          throw new Error('Label element not found');
        }
      });
    });

    describe('User interactions', () => {
      describe('User selects input field', () => {
        beforeEach(() => {
          inputFormFieldComponent.isFocused$.set(false);
          inputElement.dispatchEvent(new Event('focus'));
          hostFixture.detectChanges();
        });

        it('should set isFocused signal to true when user selects the input field', () => {
          expect(inputFormFieldComponent.isFocused$()).toBe(true);
        });

        it('should apply the focus CSS class when user selects the input field', () => {
          expect(
            formFieldWrapperDebugElement.classes['lib-input--focus']
          ).toBe(true);
        });
      });

      describe('User types in input field', () => {
        const inputValueRaw = ' some   value ';
        const inputValueTrimmed = 'some value';

        beforeEach(() => {
          inputElement.value = inputValueRaw;
          inputElement.dispatchEvent(new Event('input'));
          hostFixture.detectChanges();
        });

        it('should update value signal with the raw input when user types', () => {
          expect(inputFormFieldComponent.value()).toBe(inputValueRaw);
        });

        it('should set the FormControl value with the trimmed and space-normalized value', () => {
          expect(hostComponent.standaloneControl.value).toBe(inputValueTrimmed);
        });

        it('should set FormControl dirty true when the user enters text into the input field', () => {
          expect(hostComponent.standaloneControl.dirty).toBe(true);
        });

        it('should make FormControl pristine false when the user enters text into the input field', () => {
          expect(hostComponent.standaloneControl.pristine).toBe(false);
        });

        it('should apply the value CSS class if the input field has a value', () => {
          expect(
            formFieldWrapperDebugElement.classes['lib-input--value']
          ).toBe(true);
        });

        it('should remove the value CSS class if the input field is empty', () => {
          inputElement.value = '';
          inputElement.dispatchEvent(new Event('input'));
          hostFixture.detectChanges();
          expect(
            formFieldWrapperDebugElement.classes['lib-input--value']
          ).toBeUndefined();
        });
      });

      describe('User leaves input field', () => {
        beforeEach(() => {
          inputElement.dispatchEvent(new Event('focus'));
          hostFixture.detectChanges();
          inputElement.dispatchEvent(new Event('blur'));
          hostFixture.detectChanges();
        });

        it('should set isFocused signal to false when user leaves the input field', () => {
          expect(inputFormFieldComponent.isFocused$()).toBe(false);
        });

        it('should remove the focus CSS class when user leaves the input field', () => {
          expect(
            formFieldWrapperDebugElement.classes['lib-input--focus']
          ).toBeUndefined();
        });

        it('should set FormControl touched true when the user leaves the input field', () => {
          expect(hostComponent.standaloneControl.touched).toBe(true);
        });
      });

      describe('User causes an error through an invalid input', () => {
        beforeEach(() => {
          hostComponent.standaloneControl.setValidators(Validators.email);

          inputElement.value = 'not an email address';
          inputElement.dispatchEvent(new Event('input'));
          hostFixture.detectChanges();

          inputElement.dispatchEvent(new Event('blur'));
          hostFixture.detectChanges();
        });

        it('should set errors signal when user leaves the input field with a value that fails validation', () => {
          expect(inputFormFieldComponent.errors()).toEqual({ email: true });
        });

        it('should set FormControl status to invalid when user leaves the input field with a value that fails validation', () => {
          expect(hostComponent.standaloneControl.status).toBe('INVALID');
        });

        it('should update FormControl errors with appropriate errors when user leaves the input field with a value that fails validation', () => {
          expect(hostComponent.standaloneControl.errors).toEqual({
            email: true
          });
        });

        it('should set error CSS class when user leaves the input field with a value that fails validation', () => {
          expect(
            formFieldWrapperDebugElement.classes['lib-input--error']
          ).toBe(true);
        });
      });

      describe('User fixes an invalid input', () => {
        beforeEach(() => {
          hostComponent.standaloneControl.setValidators(Validators.email);

          inputElement.value = 'not an email address';
          inputElement.dispatchEvent(new Event('input'));
          hostFixture.detectChanges();

          inputElement.dispatchEvent(new Event('blur'));
          hostFixture.detectChanges();
        });

        function resolveInputWithValidValue() {
          inputElement.value = 'anEmail@address.com';
          inputElement.dispatchEvent(new Event('input'));
          hostFixture.detectChanges();

          inputElement.dispatchEvent(new Event('blur'));
          hostFixture.detectChanges();
        }

        it('should clear errors signal when user leaves with a valid value after being invalid', () => {
          expect(inputFormFieldComponent.errors()).toEqual({ email: true });

          resolveInputWithValidValue();

          expect(inputFormFieldComponent.errors()).toBeNull();
        });

        it('should set FormControl status to valid when user enters valid text after being invalid', () => {
          expect(hostComponent.standaloneControl.status).toBe('INVALID');

          resolveInputWithValidValue();

          expect(hostComponent.standaloneControl.status).toBe('VALID');
        });

        it('should update FormControl errors with null value when user enters valid text after being invalid', () => {
          expect(hostComponent.standaloneControl.errors).toEqual({
            email: true
          });

          resolveInputWithValidValue();

          expect(hostComponent.standaloneControl.errors).toBeNull();
        });

        it('should clear error CSS class when user leaves with a valid value after being invalid', () => {
          expect(
            formFieldWrapperDebugElement.classes['lib-input--error']
          ).toBe(true);

          resolveInputWithValidValue();

          expect(
            formFieldWrapperDebugElement.classes['lib-input--error']
          ).toBeUndefined();
        });
      });

      describe('User interacts with a disabled input field', () => {
        it('should not be able to interact with the input field when disabled', () => {
          inputElement.focus();
          expect(inputFormFieldComponent.isFocused$()).toBe(true);

          inputElement.blur();
          inputFormFieldComponent.setDisabledState(true);
          hostFixture.detectChanges();

          inputElement.focus();
          hostFixture.detectChanges();

          expect(inputFormFieldComponent.isFocused$()).toBe(false);
        });
      });
    });
  });

  describe('When provided with a FormControl as part of a FormGroup', () => {
    let hostFixture: ComponentFixture<FormGroupHostComponent>;
    let hostComponent: FormGroupHostComponent;
    let inputFormFieldComponent: InputComponent;
    let inputFormFieldDebugElement: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormGroupHostComponent, ReactiveFormsModule]
      });

      hostFixture = TestBed.createComponent(FormGroupHostComponent);
      hostComponent = hostFixture.componentInstance;
      inputFormFieldDebugElement = hostFixture.debugElement.query(
        By.directive(InputComponent)
      );
      inputFormFieldComponent = inputFormFieldDebugElement.componentInstance;
      hostFixture.detectChanges();
    });

    it('should be linked to the host FormGroup\'s FormControl', () => {
      expect(inputFormFieldComponent.control).toBe(
        hostComponent.form.controls.testControl
      );
    });
  });

  describe('No FormControl provided', () => {
    let component: InputComponent;
    let componentRef: ComponentRef<InputComponent>;
    let fixture: ComponentFixture<InputComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InputComponent, ReactiveFormsModule]
      });

      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      componentRef = fixture.componentRef;
      componentRef.setInput('label', 'test label');
      componentRef.setInput('id', 'id');
      componentRef.setInput('background', 'white');
      fixture.detectChanges();
    });

    it('should initialise internal control', () => {
      expect(component.control).toBeInstanceOf(FormControl);
    });
  });
});
