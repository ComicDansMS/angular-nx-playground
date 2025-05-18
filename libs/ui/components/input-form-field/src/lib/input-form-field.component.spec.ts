import { InputFormFieldComponent } from './input-form-field.component';
import { Component, ComponentRef, DebugElement, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

type InputType = 'text' | 'number' | 'email' | 'password';

function shouldUpdateExternalFormControl<T>(
  getParentFormControl: () => AbstractControl,
  getFixture: () => ComponentFixture<T>,
  getInputDebugElement: () => DebugElement,
):void {
  let formControl: AbstractControl;
  let fixture: ComponentFixture<T>;
  let inputDebugElement: DebugElement
  let inputElement: HTMLInputElement

  beforeEach(() => {
    formControl = getParentFormControl();
    fixture = getFixture();
    inputDebugElement = getInputDebugElement();
    inputElement = inputDebugElement.nativeElement;
  });

  describe("User input", () => {
    beforeEach(() => {
      inputElement.value = 'some value';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    })

    it("should set the FormControl value when the user enters text into the input field", () => {
      expect(formControl.value).toBe('some value')
    })

    it("should make FormControl dirty when the user enters text into the input field", () => {
      expect(formControl.dirty).toBe(true)
    })

    it("should make FormControl.pristine false when the user enters text into the input field", () => {
      expect(formControl.pristine).toBe(false)
    })

    it("should set FormControl.touched as true when blur event is emitted", () => {
      expect(formControl.touched).toBe(false)

      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(formControl.touched).toBe(true)
    })
  })

  describe("Validators and error state", () => {
    beforeEach(() => {
      formControl.setValidators(Validators.email);

      inputElement.value = 'not an email address';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
    })

    it("should set FormControl.status to invalid when user enters invalid text", () => {
      expect(formControl.status).toBe('INVALID')
    })

    it("should update FormControl.errors with appropriate errors when input is invalid", () => {
      expect(formControl.errors).toEqual({ email: true })
    })

    it("should set FormControl.status to valid when user enters valid text after being invalid", () => {
      expect(formControl.status).toBe('INVALID')

      inputElement.value = 'anEmail@address.com';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(formControl.status).toBe('VALID')
    })

    it("should update FormControl.errors with null value when user enters valid text after being invalid", () => {
      expect(formControl.errors).toEqual({ email: true })

      inputElement.value = 'anEmail@address.com';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      inputElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(formControl.errors).toBeNull()
    })
  })
}

@Component({
  template: `
    <lib-input-form-field
      [label]="label()"
      [inputId]="inputId()"
      [type]="inputType()"
      [placeholder]="placeholder()"
      [customErrorMessages]="customErrorMessages()"
      [formControl]="standaloneControl"
    ></lib-input-form-field>
  `,
  standalone: true,
  imports: [InputFormFieldComponent, ReactiveFormsModule],
})
class FormControlHostComponent {
  label = signal<string>('test label');
  inputId = signal<string>('testInputId');
  inputType = signal<InputType>('text');
  placeholder = signal<string>('');
  customErrorMessages = signal<Record<string, string> | null>(null);
  standaloneControl = new FormControl('standalone value');
}

@Component({
  template: `
    <form [formGroup]="form">
      <lib-input-form-field
        [label]="label()"
        [inputId]="inputId()"
        [type]="inputType()"
        [placeholder]="placeholder()"
        [customErrorMessages]="customErrorMessages()"
        formControlName="testControl"
      ></lib-input-form-field>
    </form>
  `,
  standalone: true,
  imports: [InputFormFieldComponent, ReactiveFormsModule],
})
class FormGroupHostComponent {
  label = signal<string>('test label');
  inputId = signal<string>('testInputId');
  inputType = signal<InputType>('text');
  placeholder = signal<string>('');
  customErrorMessages = signal<Record<string, string> | null>(null);
  form = new FormGroup({
    testControl: new FormControl('initial value'),
  });
}

describe('InputFormFieldComponent', () => {
  describe("When provided with a standalone FormControl", () => {
    let hostFixture: ComponentFixture<FormControlHostComponent>;
    let hostComponent: FormControlHostComponent;

    let inputFormFieldDebugElement: DebugElement;
    let inputFormFieldComponent: InputFormFieldComponent;

    let formFieldWrapperDebugElement: DebugElement;
    let inputDebugElement: DebugElement;
    let labelDebugElement: DebugElement;

    let inputElement: HTMLInputElement;
    let labelElement: HTMLLabelElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormControlHostComponent, ReactiveFormsModule]
      })

      hostFixture = TestBed.createComponent(FormControlHostComponent);
      hostComponent = hostFixture.componentInstance;

      inputFormFieldDebugElement = hostFixture.debugElement.query(By.directive(InputFormFieldComponent));
      inputFormFieldComponent = inputFormFieldDebugElement.componentInstance;

      formFieldWrapperDebugElement = hostFixture.debugElement.query(By.css('.lib-input-form-field'));
      inputDebugElement = hostFixture.debugElement.query(By.css('input'));
      labelDebugElement = hostFixture.debugElement.query(By.css('label'));

      inputElement = inputDebugElement.nativeElement;
      labelElement = labelDebugElement.nativeElement;

      hostFixture.detectChanges();
    })



    describe("Initialisation", () => {
      it("should create an instance", () => {
        expect(inputFormFieldComponent).toBeDefined();
      })

      it("should be created and linked to the host's FormControl", () => {
        expect(inputFormFieldComponent).toBeTruthy();
        expect(inputFormFieldComponent.control).toBe(hostComponent.standaloneControl);
      })

      it("should apply ID to the input and assign the label's 'for' attribute", () => {
        expect(inputElement.id).toBe('testInputId');
        expect(labelElement.getAttribute('for')).toBe('testInputId');
      })
    })

    describe("Label rendering", () => {
      it("should display correct label text", () => {
        if (labelElement.textContent) {
          expect(labelElement.textContent.trim()).toBe('test label');
        } else {
          throw new Error('Label element not found');
        }
      })

      it("should display an asterisk when isRequired signal is true", () => {
        inputFormFieldComponent.isRequired.set(true);
        hostFixture.detectChanges();

        if (labelElement.textContent) {
          expect(labelElement.textContent.trim()).toBe('test label*');
        } else {
          throw new Error('Label element not found');
        }
      })

      it("should not display an asterisk when isRequired signal is false", () => {
        inputFormFieldComponent.isRequired.set(false);
        hostFixture.detectChanges();

        if (labelElement.textContent) {
          expect(labelElement.textContent.trim()).toBe('test label');
        } else {
          throw new Error('Label element not found');
        }
      })
    })

    describe("Input type", () => {
      it("should set input type to 'text' by when specified", () => {
        hostComponent.inputType.set('text')
        hostFixture.detectChanges();
        expect(inputElement.type).toBe('text');
      })

      it("should set input type to 'password' when specified", () => {
        hostComponent.inputType.set('password')
        hostFixture.detectChanges();
        expect(inputElement.type).toBe('password');
      })

      it("should set input type to 'email' when specified", () => {
        hostComponent.inputType.set('email')
        hostFixture.detectChanges();
        expect(inputElement.type).toBe('email');
      })

      it("should set input type to 'number' when specified", () => {
        hostComponent.inputType.set('number')
        hostFixture.detectChanges();
        expect(inputElement.type).toBe('number');
      })
    })

    describe("User interactions - internal state", () => {
      describe("User selects input field (focus)", () => {
        beforeEach(() => {
          inputFormFieldComponent.isFocused.set(false);
          inputElement.dispatchEvent(new Event('focus'));
          hostFixture.detectChanges();
        })

        it("should set isFocused signal to true when user selects the input field", () => {
          expect(inputFormFieldComponent.isFocused()).toBe(true);
        })

        it("should apply the focus CSS class when user selects the input field", () => {
          expect(formFieldWrapperDebugElement.classes['lib-input-form-field--focus']).toBe(true);
        })
      })

      describe("User types in input field (input)", () => {
        const inputValueRaw = ' some   value ';
        const inputValueTrimmed = 'some value';
        let onChangeSpy: jest.Mock;

        beforeEach(() => {
          onChangeSpy = jest.fn();
          inputFormFieldComponent.registerOnChange(onChangeSpy);

          inputElement.value = inputValueRaw;
          inputElement.dispatchEvent(new Event('input'));
          hostFixture.detectChanges();
        })

        it("should update value signal with the raw input when user types", () => {
          expect(inputFormFieldComponent.value()).toBe(inputValueRaw);
        })

        it("should call onChange signal with the trimmed and space-normalized value", () => {
          expect(onChangeSpy).toHaveBeenCalledWith(inputValueTrimmed);
        })

        it("should apply the value CSS class if the input field has a value", () => {
          expect(formFieldWrapperDebugElement.classes['lib-input-form-field--value']).toBe(true);
        })

        it("should remove the value CSS class if the input field is empty", () => {
          inputElement.value = '';
          inputElement.dispatchEvent(new Event('input'));
          hostFixture.detectChanges();
          expect(formFieldWrapperDebugElement.classes['lib-input-form-field--value']).toBeUndefined();
        })
      })

      describe("User leaves input field (blur)", () => {
        let onTouchedSpy: jest.Mock;

        beforeEach(() => {
          onTouchedSpy = jest.fn();
          inputFormFieldComponent.registerOnTouched(onTouchedSpy);

          inputElement.dispatchEvent(new Event('focus'));
          hostFixture.detectChanges();
          inputElement.dispatchEvent(new Event('blur'));
          hostFixture.detectChanges();
        })

        it("should set isFocused signal to false when user leaves the input field", () => {
          expect(inputFormFieldComponent.isFocused()).toBe(false)
        })

        it("should remove the focus CSS class when user leaves the input field", () => {
          expect(formFieldWrapperDebugElement.classes['lib-input-form-field--focus']).toBeUndefined();
        })

        it("should call onTouched signal when the user leaves the input field", () => {
          expect(onTouchedSpy).toHaveBeenCalled()
        })
      })

      describe("Error handling", () => {
        beforeEach(() => {
          inputFormFieldComponent.control?.setValidators(Validators.required);

          inputElement.value = '';
          inputElement.dispatchEvent(new Event('input'));
          hostFixture.detectChanges();

          inputElement.dispatchEvent(new Event('blur'));
          hostFixture.detectChanges();
        })

        it("should set errors signal when user leaves the input field with a value that fails validation", () => {
          expect(inputFormFieldComponent.errors()).toEqual({ required: true });
        })

        it("should set error CSS class when user leaves an empty field that is required", () => {
          expect(formFieldWrapperDebugElement.classes['lib-input-form-field--error']).toBe(true);
        })

        it("should clear errors signal when user leaves with a valid value after being invalid", () => {
          expect(inputFormFieldComponent.errors()).toEqual({ required: true });

          inputElement.value = 'some value';
          inputElement.dispatchEvent(new Event('input'));
          hostFixture.detectChanges();

          inputElement.dispatchEvent(new Event('blur'));
          hostFixture.detectChanges();

          expect(inputFormFieldComponent.errors()).toBeNull();
        })

        it("should clear error CSS class when user leaves with a valid value after being invalid", () => {
          expect(formFieldWrapperDebugElement.classes['lib-input-form-field--error']).toBe(true);

          inputElement.value = 'some value';
          inputElement.dispatchEvent(new Event('input'));
          hostFixture.detectChanges();

          inputElement.dispatchEvent(new Event('blur'));
          hostFixture.detectChanges();

          expect(formFieldWrapperDebugElement.classes['lib-input-form-field--error']).toBeUndefined()
        })
      })

      describe("User interacts with a disabled input field", () => {
        beforeEach(() => {
          inputFormFieldComponent.setDisabledState(true);
          hostFixture.detectChanges();
        });

        it("should have the 'disabled' attribute on the native input element", () => {
          expect(inputElement.disabled).toBe(true);
        });
      });
    })

    shouldUpdateExternalFormControl<FormControlHostComponent>(
      () => hostComponent.standaloneControl,
      () => hostFixture,
      () => inputDebugElement
    )
  })

  describe("When provided with a FormControl as part of a FormGroup", () => {
    let hostFixture: ComponentFixture<FormGroupHostComponent>;
    let hostComponent: FormGroupHostComponent;
    let inputFormFieldComponent: InputFormFieldComponent;
    let inputFormFieldDebugElement: DebugElement;
    let inputDebugElement: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormGroupHostComponent, ReactiveFormsModule]
      })

      hostFixture = TestBed.createComponent(FormGroupHostComponent);
      hostComponent = hostFixture.componentInstance;

      inputFormFieldDebugElement = hostFixture.debugElement.query(By.directive(InputFormFieldComponent));
      inputDebugElement = hostFixture.debugElement.query(By.css('input'));

      inputFormFieldComponent = inputFormFieldDebugElement.componentInstance;

      hostFixture.detectChanges();
    })

    it("should be created and linked to the host FormGroup's FormControl", () => {
      expect(inputFormFieldComponent).toBeTruthy();
      expect(inputFormFieldComponent.control).toBe(hostComponent.form.controls.testControl);
    })

    shouldUpdateExternalFormControl<FormGroupHostComponent>(
      () => hostComponent.form.controls.testControl,
      () => hostFixture,
      () => inputDebugElement
    )
  });

  describe("No FormControl provided", () => {
    let component: InputFormFieldComponent;
    let componentRef: ComponentRef<InputFormFieldComponent>;
    let fixture: ComponentFixture<InputFormFieldComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InputFormFieldComponent, ReactiveFormsModule]
      })

      fixture = TestBed.createComponent(InputFormFieldComponent);
      component = fixture.componentInstance;
      componentRef = fixture.componentRef;
      componentRef.setInput('label', 'test label');
      componentRef.setInput('inputId', 'testInputId');
      fixture.detectChanges();
    })

    it("should initialise internal control", () => {
      expect(component.control).toBeInstanceOf(FormControl);
    })
  })
});
