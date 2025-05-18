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

      it("should apply inputId to input and label", () => {
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

    describe("Input value rendering", () => {
      it("should display the value when the value signal is set", () => {
        inputFormFieldComponent.value.set('some value')
        hostFixture.detectChanges();
        expect(inputElement.value).toBe('some value');
      })

      it('should set the placeholder when one is provided', () => {
        hostComponent.placeholder.set('some placeholder')
        hostFixture.detectChanges();
        expect(inputElement.placeholder).toBe('some placeholder');
      });

      it('should not set a placeholder when not provided', () => {
        expect(inputElement.placeholder).toBeFalsy();
      });

      // TODO: Snapshot to assert placeholder behavior
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

    describe("CSS classes based on state", () => {
      it("should apply '--value' class when value() signal has content", () => {
        inputFormFieldComponent.value.set('some value')
        hostFixture.detectChanges();
        expect(formFieldWrapperDebugElement.classes['lib-input-form-field--value']).toBe(true);
      })

      it("should not apply '--value' class when value() signal has no content", () => {
        inputFormFieldComponent.value.set('')
        hostFixture.detectChanges();
        expect(formFieldWrapperDebugElement.classes['lib-input-form-field--value']).toBeUndefined();
      })

      it("should apply '--focus' class when isFocused() signal is true", () => {
        inputFormFieldComponent.isFocused.set(true)
        hostFixture.detectChanges();
        expect(formFieldWrapperDebugElement.classes['lib-input-form-field--focus']).toBe(true);
      })

      it("should not apply '--focus' class when isFocused() signal is false", () => {
        inputFormFieldComponent.isFocused.set(false)
        hostFixture.detectChanges();
        expect(formFieldWrapperDebugElement.classes['lib-input-form-field--focus']).toBeUndefined();
      })

      it("should apply '--error' class when errors() signal is populated", () => {
        inputFormFieldComponent.errors.set({ required: true });
        hostFixture.detectChanges();
        expect(formFieldWrapperDebugElement.classes['lib-input-form-field--error']).toBe(true);
      })

      it("should not apply '--error' class when errors() signal is null", () => {
        inputFormFieldComponent.errors.set(null);
        hostFixture.detectChanges();
        expect(formFieldWrapperDebugElement.classes['lib-input-form-field--error']).toBeUndefined();
      })
    })

    describe("Event handling", () => {
      it("should update the input value when the FormControl value is updated", () => {
        inputFormFieldComponent.writeValue('some value');
        hostFixture.detectChanges();
        expect(inputFormFieldComponent.value()).toBe('some value');
      })



      describe("writeValue()", () => {

        it("should update the value() signal with content when writeValue() is called", () => {
          inputFormFieldComponent.writeValue('some value');
          hostFixture.detectChanges();
          expect(inputFormFieldComponent.value()).toBe('some value');
        })
      })

      describe("handleInput()", () => {
        it("should set the value() signal when handleInput() is called by the input element emitting an input event", () => {
          inputElement.value = 'some value';
          inputDebugElement.triggerEventHandler('input', { target: inputElement });
          hostFixture.detectChanges();
          expect(inputFormFieldComponent.value()).toBe('some value');
        })

        it("should pass trimmed input to onChange() when handleInput() is called by the input element emitting an input event", () => {
          const onChangeSpy = jest.fn();
          inputFormFieldComponent.registerOnChange(onChangeSpy);
          inputElement.value = ' leading, trailing and multiple   space ';
          inputDebugElement.triggerEventHandler('input', { target: inputElement });
          hostFixture.detectChanges();
          expect(onChangeSpy).toHaveBeenCalledWith('leading, trailing and multiple space');
        })
      })

      describe("handleBlur()", () => {
        it("should call onTouched when input element is blurred", () => {
          const onTouchedSpy = jest.fn()
          inputFormFieldComponent.registerOnTouched(onTouchedSpy);
          inputElement.dispatchEvent(new Event('blur'));
          expect(onTouchedSpy).toHaveBeenCalled();
          onTouchedSpy.mockReset();
        });

        it("should set isFocused() signal is false", () => {
          inputFormFieldComponent.isFocused.set(true);
          inputElement.dispatchEvent(new Event('blur'));
          expect(inputFormFieldComponent.isFocused()).toBe(false)
        })

        it("should call updateErrors()", () => {
          const updateErrorsSpy = jest.spyOn(inputFormFieldComponent, 'updateErrors');
          inputFormFieldComponent.control?.setValidators(Validators.required);
          inputFormFieldComponent.control?.setValue('');
          inputElement.dispatchEvent(new Event('blur'));
          expect(updateErrorsSpy).toHaveBeenCalled();
          updateErrorsSpy.mockRestore();
        })
      });

      describe("setDisabledState()", () => {
        it("should update the isDisabled() signal", () => {
          inputFormFieldComponent.setDisabledState(true);
          expect(inputFormFieldComponent.isDisabled()).toBe(true);
          inputFormFieldComponent.setDisabledState(false);
          expect(inputFormFieldComponent.isDisabled()).toBe(false);
        });

        it("should set the 'disabled' attribute on the input element", () => {
          inputFormFieldComponent.setDisabledState(true);
          hostFixture.detectChanges();
          expect(inputElement.disabled).toBe(true);
          inputFormFieldComponent.setDisabledState(false);
          hostFixture.detectChanges();
          expect(inputElement.disabled).toBe(false);
        });
      });

      describe("handleFocus()", () => {
        it("should set the isFocused() signal to true", () => {
          inputFormFieldComponent.isFocused.set(false);
          hostFixture.detectChanges();
          inputElement.dispatchEvent(new Event('focus'));
          expect(inputFormFieldComponent.isFocused()).toBe(true);
        });
      });

      describe("Validation and error state", () => {
        beforeEach(() => {
          inputFormFieldComponent.control?.clearValidators();
          inputFormFieldComponent.control?.setValue('');
          inputFormFieldComponent.errors.set(null);
          inputFormFieldComponent.control?.markAsUntouched();
          inputFormFieldComponent.control?.markAsPristine();
        });

        it("updateErrors() should populate errors() signal if control is invalid", () => {
          if (inputFormFieldComponent.control) {
            inputFormFieldComponent.control.setValidators(Validators.required);
            inputFormFieldComponent.control.setValue('');
          } else {
            throw new Error('Component control not initialised for test');
          }

          inputFormFieldComponent.updateErrors();
          hostFixture.detectChanges();

          expect(inputFormFieldComponent.errors()).toEqual({ required: true });
        });

        it("updateErrors() should clear errors() signal if control is valid", () => {
          if (inputFormFieldComponent.control) {
            inputFormFieldComponent.control.setValidators(Validators.required);
            inputFormFieldComponent.control.setValue('some valid input');
          } else {
            throw new Error('Component control not initialised for test');
          }

          inputFormFieldComponent.updateErrors();
          hostFixture.detectChanges();

          expect(inputFormFieldComponent.errors()).toBeNull();
        });
      });
    })

    // eventHandling<TestHostComponent>(
    //   () => inputFormFieldComponent,
    //   () => hostFixture,
    //   () => inputDebugElement
    // )
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

    it("should update value() when FormControl is updated", () => {
      expect(inputFormFieldComponent.value()).toBe('standalone value');

      inputFormFieldComponent.control?.setValue('some value')
      hostFixture.detectChanges();
      expect(inputFormFieldComponent.value()).toBe('some value');
    })

    it("should update input element's disabled state when FormControl's disabled state changes", () => {
      expect(inputElement.disabled).toBe(false);
      expect(hostComponent.standaloneControl.disabled).toBe(false);

      hostComponent.standaloneControl.disable();
      hostFixture.detectChanges();

      expect(inputElement.disabled).toBe(true);

      hostComponent.standaloneControl.enable();
      hostFixture.detectChanges();

      expect(inputElement.disabled).toBe(false);
    });
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

//====================================================================
// 2. Tests for Validation/Error Handling with an External FormControl
//    (This suite is designed to be run by different integration contexts)
//====================================================================

  /**
   * Describe: Common External FormControl Validation and Error Handling Logic [SHARED SUITE]
   */
  /**
   * Context: Given the component is correctly linked to an external FormControl
   */
// should derive isRequired() signal based on the external FormControl's validators
// should populate the errors() signal from the external FormControl's 'errors' property
// should apply the '--error' CSS class when the external FormControl is invalid and touched
// should clear the errors() signal and the '--error' CSS class when the external FormControl becomes valid
// should correctly reflect the 'customErrorMessages' @Input in its customErrorMessages() signal (for FormFieldErrorComponent)
// should update its errors() signal in response to relevant events from the external FormControl (e.g., statusChanges, or after form-level touch operations like markAllAsTouched)


