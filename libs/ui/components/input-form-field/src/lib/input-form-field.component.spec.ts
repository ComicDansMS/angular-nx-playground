import { InputFormFieldComponent } from './input-form-field.component';
import { Component, ComponentRef, DebugElement, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

type InputType = 'text' | 'number' | 'email' | 'password';

// function eventHandling<T>(
//   getComponent: () => InputFormFieldComponent,
//   getFixture: () => ComponentFixture<T>,
//   getInputDebugElement: () => DebugElement,
// ):void {
//   let component: InputFormFieldComponent;
//   let fixture: ComponentFixture<T>;
//   let inputDebugElement: DebugElement
//   let inputElement: HTMLInputElement
//
//   beforeEach(() => {
//     component = getComponent();
//     fixture = getFixture();
//     inputDebugElement = getInputDebugElement();
//     inputElement = inputDebugElement.nativeElement;
//   });
//
//   describe("Event handling", () => {
//     describe("writeValue()", () => {
//       it("should update the value() signal with content when writeValue() is called", () => {
//         component.writeValue('some value');
//         fixture.detectChanges();
//         expect(component.value()).toBe('some value');
//       })
//     })
//
//     describe("handleInput()", () => {
//       it("should update the value() signal with content when handleInput() is called", () => {
//         component.handleInput('some value');
//         fixture.detectChanges();
//         expect(component.value()).toBe('some value');
//       })
//
//       it("should process input, set value signal and call onChange when handleInput() is called", () => {
//         const onChangeSpy = jest.fn();
//         component.registerOnChange(onChangeSpy);
//         inputElement.value = ' leading, trailing and multiple   space ';
//         inputDebugElement.triggerEventHandler('input', { target: inputElement });
//         fixture.detectChanges();
//         expect(component.value()).toBe(' leading, trailing and multiple   space ');
//         expect(onChangeSpy).toHaveBeenCalledWith('leading, trailing and multiple space');
//       })
//     })
//
//     describe("handleBlur()", () => {
//       it("should call onTouched when input element is blurred", () => {
//         const onTouchedSpy = jest.fn()
//         component.registerOnTouched(onTouchedSpy);
//         inputElement.dispatchEvent(new Event('blur'));
//         expect(onTouchedSpy).toHaveBeenCalled();
//         onTouchedSpy.mockReset();
//       });
//
//       it("should set isFocused() signal is false", () => {
//         component.isFocused.set(true);
//         inputElement.dispatchEvent(new Event('blur'));
//         expect(component.isFocused()).toBe(false)
//       })
//
//       it("should call updateErrors()", () => {
//         const updateErrorsSpy = jest.spyOn(component, 'updateErrors');
//         component.control?.setValidators(Validators.required);
//         component.control?.setValue('');
//         inputElement.dispatchEvent(new Event('blur'));
//         expect(updateErrorsSpy).toHaveBeenCalled();
//         updateErrorsSpy.mockRestore();
//       })
//     });
//
//     describe("setDisabledState()", () => {
//       it("should update the isDisabled() signal", () => {
//         component.setDisabledState(true);
//         expect(component.isDisabled()).toBe(true);
//         component.setDisabledState(false);
//         expect(component.isDisabled()).toBe(false);
//       });
//
//       it("should set the 'disabled' attribute on the input element", () => {
//         component.setDisabledState(true);
//         fixture.detectChanges();
//         expect(inputElement.disabled).toBe(true);
//         component.setDisabledState(false);
//         fixture.detectChanges();
//         expect(inputElement.disabled).toBe(false);
//       });
//     });
//
//     describe("handleFocus()", () => {
//       it("should set the isFocused() signal to true", () => {
//         component.isFocused.set(false);
//         fixture.detectChanges();
//         inputElement.dispatchEvent(new Event('focus'));
//         expect(component.isFocused()).toBe(true);
//       });
//     });
//
//     describe("updateErrors()", () => {
//       beforeEach(() => {
//         component.control?.clearValidators();
//         component.control?.setValue('');
//         component.errors.set(null);
//         component.control?.markAsUntouched();
//         component.control?.markAsPristine();
//       });
//
//       it("should populate errors() signal if control is invalid", () => {
//         if (component.control) {
//           component.control.setValidators(Validators.required);
//           component.control.setValue('');
//         } else {
//           throw new Error('Component control not initialised for test. Check getComponent().');
//         }
//
//         component.updateErrors();
//         fixture.detectChanges();
//
//         expect(component.errors()).toEqual({ required: true });
//       });
//
//       it("should clear errors() signal if control is valid", () => {
//         if (component.control) {
//           component.control.setValidators(Validators.required);
//           component.control.setValue('some valid input');
//         } else {
//           throw new Error('Component control not initialised for test. Check getComponent().');
//         }
//
//         component.updateErrors();
//         fixture.detectChanges();
//
//         expect(component.errors()).toBeNull();
//       });
//     })
//   })
// }

// Host component for use with FormControl
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
class TestStandaloneHostComponent {
  label = signal<string>('test label');
  inputId = signal<string>('testInputId');
  inputType = signal<InputType>('text');
  placeholder = signal<string>('');
  customErrorMessages = signal<Record<string, string> | null>(null);
  standaloneControl = new FormControl('standalone value');
}

// Host component for use with FormGroup
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
class TestHostComponent {
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
  describe("When provided with an individual FormControl binding", () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    let inputFormFieldDebugElement: DebugElement;
    let inputFormFieldComponent: InputFormFieldComponent;

    let formFieldWrapperDebugElement: DebugElement;
    let inputDebugElement: DebugElement;
    let labelDebugElement: DebugElement;

    let inputElement: HTMLInputElement;
    let labelElement: HTMLLabelElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, ReactiveFormsModule]
      })

      hostFixture = TestBed.createComponent(TestHostComponent);
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

    it("should be created and linked to the host FormGroup's FormControl", () => {
      expect(inputFormFieldComponent).toBeTruthy();
      expect(inputFormFieldComponent.control).toBe(hostComponent.form.controls.testControl);
    })

    describe("Initialisation", () => {
      it("should create an instance", () => {
        expect(inputFormFieldComponent).toBeDefined();
      })

      it("should initialise internal control", () => {
        expect(inputFormFieldComponent.control).toBeInstanceOf(FormControl);
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

    describe("User interactions", () => {
      describe("User selects input field (focus)", () => {
        beforeEach(() => {
          inputFormFieldComponent.isFocused.set(false);
          inputElement.dispatchEvent(new Event('focus'));
          hostFixture.detectChanges();
        })

        it("should set isFocused() to true when user selects the input field", () => {
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

        it("should update value() signal with the raw input when user types", () => {
          expect(inputFormFieldComponent.value()).toBe(inputValueRaw);
        })

        it("should call onChange() with the trimmed and space-normalized value", () => {
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

        it("should set isFocused() to false when user leaves the input field", () => {
          expect(inputFormFieldComponent.isFocused()).toBe(false)
        })

        it("should remove the focus CSS class when user leaves the input field", () => {
          expect(formFieldWrapperDebugElement.classes['lib-input-form-field--focus']).toBeUndefined();
        })

        it("should call onTouched() when the user leaves the input field", () => {
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

        it("should set errors() when user leaves the input field with a value that fails validation", () => {
          expect(inputFormFieldComponent.errors()).toEqual({ required: true });
        })

        it("should set error CSS class when user leaves an empty field that is required", () => {
          expect(formFieldWrapperDebugElement.classes['lib-input-form-field--error']).toBe(true);
        })

        it("should clear errors() when user leaves with a valid value after being invalid", () => {
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

    // TODO: Events propagate to provided FormControl (shared function)
  })

  describe("Provided with a FormControlName from a FormGroup", () => {
    let hostFixture: ComponentFixture<TestStandaloneHostComponent>;
    let hostComponent: TestStandaloneHostComponent;
    let inputFormFieldComponent: InputFormFieldComponent;
    let inputFormFieldDebugElement: DebugElement;
    let inputDebugElement: DebugElement;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestStandaloneHostComponent, ReactiveFormsModule]
      })

      hostFixture = TestBed.createComponent(TestStandaloneHostComponent);
      hostComponent = hostFixture.componentInstance;

      inputFormFieldDebugElement = hostFixture.debugElement.query(By.directive(InputFormFieldComponent));
      inputDebugElement = hostFixture.debugElement.query(By.css('input'));

      inputFormFieldComponent = inputFormFieldDebugElement.componentInstance;
      inputElement = inputDebugElement.nativeElement;

      hostFixture.detectChanges();
    })

    it("should be created and linked to the host FormGroup's FormControl", () => {
      expect(inputFormFieldComponent).toBeTruthy();
      expect(inputFormFieldComponent.control).toBe(hostComponent.standaloneControl);
    })

    // TODO: Events propagate to provided FormControl (shared function)
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
