import { InputFormFieldComponent } from './input-form-field.component';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, ComponentRef, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  template: `
    <form [formGroup]="form">
      <lib-input-form-field
        label="Test Host Label"
        inputId="testHostInput"
        formControlName="testControl"
        [customErrorMessages]="customErrors"
      ></lib-input-form-field>
    </form>
  `,
  standalone: true,
  imports: [InputFormFieldComponent, ReactiveFormsModule],
})
class TestHostComponent {
  form = new FormGroup({
    testControl: new FormControl('initial value'),
  });
  customErrors: Record<string, string> | undefined;
}

@Component({
  template: `
    <lib-input-form-field
      label="Standalone Label"
      inputId="standaloneInput"
      [formControl]="standaloneControl"
    ></lib-input-form-field>
  `,
  standalone: true,
  imports: [InputFormFieldComponent, ReactiveFormsModule],
})
class TestStandaloneHostComponent {
  standaloneControl = new FormControl('standalone value');
}


describe('InputFormFieldComponent', () => {
  describe('Standalone Initialization and Basic Rendering', () => {
    let component: InputFormFieldComponent;
    let componentRef: ComponentRef<InputFormFieldComponent>;
    let fixture: ComponentFixture<InputFormFieldComponent>;
    let inputElement: DebugElement;
    let labelElement: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InputFormFieldComponent, ReactiveFormsModule],
      });

      fixture = TestBed.createComponent(InputFormFieldComponent);
      component = fixture.componentInstance;
      componentRef = fixture.componentRef;

      componentRef.setInput('label', 'test label');
      componentRef.setInput('inputId', 'testInputId');

      fixture.detectChanges();

      inputElement = fixture.debugElement.query(By.css('input'));
      labelElement = fixture.debugElement.query(By.css('label'));
    });

    it('should create an instance', () => {
      expect(component).toBeDefined();
    });

    it('should apply inputId to input and label', () => {
      expect(inputElement.nativeElement.id).toBe('testInputId');
      expect(labelElement.nativeElement.getAttribute('for')).toBe('testInputId');
    });

    describe('Label rendering', () => {
      it('should display correct label text', () => {
        expect(labelElement.nativeElement.textContent.trim()).toEqual('test label');
      });

      it('should display an asterisk when isRequired is set directly', () => {
        component.isRequired.set(true);
        fixture.detectChanges();
        expect(labelElement.nativeElement.textContent.trim()).toEqual('test label*');
      });

      it('should NOT display an asterisk by default', () => {
        fixture.detectChanges();
        expect(labelElement.nativeElement.textContent.trim()).toEqual('test label');
        expect(component.isRequired()).toBe(false);
      });
    });

    // TODO: Placeholder test needs work/clarification
    // describe('Placeholder', () => {
    //   it('should display placeholder when provided and input is empty and not focused', () => {
    //     componentRef.setInput('placeholder', 'Enter text');
    //     fixture.detectChanges();
    //     expect(inputElement.nativeElement.placeholder).toBe('Enter text');
    //   });
    //
    //   it('should not have a placeholder attribute if not provided', () => {
    //     expect(inputElement.nativeElement.placeholder).toBeFalsy();
    //   });
    // });

    describe('Input Type', () => {
      it('should set input type to "text" by default', () => {
        expect(inputElement.nativeElement.type).toBe('text');
      });

      it('should set input type to "password" when specified', () => {
        componentRef.setInput('type', 'password');
        fixture.detectChanges();
        expect(inputElement.nativeElement.type).toBe('password');
      });

      it('should set input type to "number" when specified', () => {
        componentRef.setInput('type', 'number');
        fixture.detectChanges();
        expect(inputElement.nativeElement.type).toBe('number');
      });

      it('should set input type to "email" when specified', () => {
        componentRef.setInput('type', 'email');
        fixture.detectChanges();
        expect(inputElement.nativeElement.type).toBe('email');
      });
    });

    describe('CSS Classes based on state', () => {
      it('should apply "--value" class when input has value', () => {
        component.value.set('some value');
        fixture.detectChanges();
        const divWrapper = fixture.debugElement.query(By.css('.lib-input-form-field'));
        expect(divWrapper.classes['lib-input-form-field--value']).toBe(true);
      });

      it('should not have "--value" class when input is empty', () => {
        component.value.set('');
        fixture.detectChanges();
        const divWrapper = fixture.debugElement.query(By.css('.lib-input-form-field'));
        expect(divWrapper.classes['lib-input-form-field--value']).toBeUndefined();
      });

      it('should apply "--focus" class when input is focused', () => {
        component.isFocused.set(true);
        fixture.detectChanges();
        const divWrapper = fixture.debugElement.query(By.css('.lib-input-form-field'));
        expect(divWrapper.classes['lib-input-form-field--focus']).toBe(true);
      });

      it('should not have "--focus" class when input is not focused', () => {
        component.isFocused.set(false);
        fixture.detectChanges();
        const divWrapper = fixture.debugElement.query(By.css('.lib-input-form-field'));
        expect(divWrapper.classes['lib-input-form-field--focus']).toBeUndefined();
      });

      it('should apply "--error" class when errors are present', () => {
        component.errors.set({ required: true });
        fixture.detectChanges();
        const divWrapper = fixture.debugElement.query(By.css('.lib-input-form-field'));
        expect(divWrapper.classes['lib-input-form-field--error']).toBe(true);
      });

      it('should not have "--error" class when no errors are present', () => {
        component.errors.set(null);
        fixture.detectChanges();
        const divWrapper = fixture.debugElement.query(By.css('.lib-input-form-field'));
        expect(divWrapper.classes['lib-input-form-field--error']).toBeUndefined();
      });
    });


    describe('User Interaction and Event Handling', () => {
      let onChangeSpy: jest.Mock;
      let onTouchedSpy: jest.Mock;

      beforeEach(() => {
        onChangeSpy = jest.fn();
        onTouchedSpy = jest.fn()
        component.registerOnChange(onChangeSpy);
        component.registerOnTouched(onTouchedSpy);
      });

      it('handleInput should process value and call onChange', () => {
        inputElement.nativeElement.value = '  leading and trailing  ';
        inputElement.triggerEventHandler('input', { target: inputElement.nativeElement });
        fixture.detectChanges();

        expect(component.value()).toBe('  leading and trailing  ');
        expect(onChangeSpy).toHaveBeenCalledWith('leading and trailing');
      });

      it('handleInput should replace multiple spaces and call onChange', () => {
        inputElement.nativeElement.value = 'multiple   spaces';
        inputElement.triggerEventHandler('input', { target: inputElement.nativeElement });
        fixture.detectChanges();

        expect(component.value()).toBe('multiple   spaces');
        expect(onChangeSpy).toHaveBeenCalledWith('multiple spaces');
      });

      it('handleFocus should set isFocused to true', () => {
        component.isFocused.set(false);
        inputElement.triggerEventHandler('focus', {});
        fixture.detectChanges();
        expect(component.isFocused()).toBe(true);
      });

      it('handleBlur should call onTouched, set isFocused to false, and update errors', () => {
        const updateErrorsSpy = jest.spyOn(component, 'updateErrors');
        component.isFocused.set(true);

        component.control = new FormControl('', Validators.required);
        component.control.markAsTouched();

        inputElement.triggerEventHandler('blur', {});
        fixture.detectChanges();

        expect(onTouchedSpy).toHaveBeenCalled();
        expect(component.isFocused()).toBe(false);
        expect(updateErrorsSpy).toHaveBeenCalled();
        expect(component.errors()).toEqual({ required: true });

        updateErrorsSpy.mockRestore();
      });
    });
  });

  describe('Provided with a FormControlName in a FormGroup', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let inputFormFieldComponent: InputFormFieldComponent;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, InputFormFieldComponent, ReactiveFormsModule],
      });

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const inputFormFieldDE = hostFixture.debugElement.query(By.directive(InputFormFieldComponent));
      inputFormFieldComponent = inputFormFieldDE.componentInstance;
      inputElement = hostFixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should be created and linked to the host form control', () => {
      expect(inputFormFieldComponent).toBeTruthy();
      expect(inputFormFieldComponent.control).toBe(hostComponent.form.controls.testControl);
    });

    it('writeValue: should display value from form control', () => {
      hostComponent.form.controls.testControl.setValue('from host control');
      hostFixture.detectChanges();
      expect(inputFormFieldComponent.value()).toBe('from host control');
      expect(inputElement.value).toBe('from host control');
    });

    it('registerOnChange: should update form control when user types', () => {
      inputElement.value = 'user typed value';
      inputElement.dispatchEvent(new Event('input'));

      hostFixture.detectChanges();

      expect(hostComponent.form.controls.testControl.value).toBe('user typed value');
    });

    it('registerOnTouched: should mark form control as touched on blur', () => {
      expect(hostComponent.form.controls.testControl.touched).toBe(false);
      inputElement.dispatchEvent(new Event('blur'));
      hostFixture.detectChanges();
      expect(hostComponent.form.controls.testControl.touched).toBe(true);
    });

    it('setDisabledState: should disable/enable input when form control is disabled/enabled', () => {
      hostComponent.form.controls.testControl.disable();
      hostFixture.detectChanges();
      expect(inputElement.disabled).toBe(true);
      expect(inputFormFieldComponent.isDisabled()).toBe(true);

      hostComponent.form.controls.testControl.enable();
      hostFixture.detectChanges();
      expect(inputElement.disabled).toBe(false);
      expect(inputFormFieldComponent.isDisabled()).toBe(false);
    });


    describe('Validation and Error Handling with HostComponent', () => {
      beforeEach(() => {
        hostComponent.form.controls.testControl.setValidators([Validators.required, Validators.minLength(5)]);
        hostComponent.form.controls.testControl.setValue(''); // Make it invalid due to required
        hostComponent.form.controls.testControl.markAsTouched(); // Errors usually show after touched
        hostFixture.detectChanges(); // Propagate changes to child
        inputFormFieldComponent.updateErrors(); // Explicitly call if not triggered by blur
        hostFixture.detectChanges();
      });

      it('should populate errors signal and apply error class when control is invalid and touched', () => {
        expect(inputFormFieldComponent.errors()).toBeTruthy();
        expect(inputFormFieldComponent.errors()?.['required']).toBe(true);
        const divWrapper = hostFixture.debugElement.query(By.css('.lib-input-form-field'));
        expect(divWrapper.classes['lib-input-form-field--error']).toBe(true);
      });

      it('should pass errors to FormFieldErrorComponent', () => {
        // This is an indirect test. We check if the inputFormFieldComponent's errors signal,
        // which is bound to the child component's [errors] input, is correctly set.
        // A more direct test would involve getting a DebugElement for FormFieldErrorComponent
        // and checking its inputs, but that requires FormFieldErrorComponent to be testable/available.
        expect(inputFormFieldComponent.errors()).toEqual(hostComponent.form.controls.testControl.errors);
      });


      it('should display custom error message if provided and error matches', () => {
        hostComponent.customErrors = { required: 'This is a custom required message.' };
        hostFixture.detectChanges(); // To pass down the new customErrorMessages input
        // inputFormFieldComponent.customErrorMessages.set({ required: 'This is a custom required message.' }) // If input was a signal

        // Re-trigger error update if necessary, or assume change detection handles it.
        // For simplicity, we check if the customErrorMessages prop is set on our component
        expect(inputFormFieldComponent.customErrorMessages()).toEqual({ required: 'This is a custom required message.' });
        // Actual display would be tested in FormFieldErrorComponent's tests.
        // Here, we ensure the prop is correctly passed.
      });


      it('should clear errors signal and remove error class when control becomes valid', () => {
        hostComponent.form.controls.testControl.setValue('valid value');
        hostFixture.detectChanges();
        inputFormFieldComponent.updateErrors();
        hostFixture.detectChanges();

        expect(inputFormFieldComponent.errors()).toBeNull();
        const divWrapper = hostFixture.debugElement.query(By.css('.lib-input-form-field'));
        expect(divWrapper.classes['lib-input-form-field--error']).toBeUndefined()
      });

      it('should update errors when control.events emit for a control matching the pristine and touched filter (e.g. after markAllAsTouched)', fakeAsync(() => {
        const testControl = hostComponent.form.controls.testControl;

        // Arrange: Ensure the control is in a specific state (invalid, pristine, untouched)
        // and the component's errors are reset before the test action.
        testControl.markAsPristine();
        testControl.markAsUntouched();
        inputFormFieldComponent.errors.set(null); // Reset component's view of errors
        hostFixture.detectChanges(); // Apply changes
        tick(); // Settle any microtasks

        // Pre-conditions: Verify the initial state is as expected.
        expect(testControl.invalid).toBe(true); // Control should be invalid (e.g., due to 'required' validator)
        expect(testControl.pristine).toBe(true); // Control is pristine (not modified by user)
        expect(testControl.touched).toBe(false); // Control is untouched (not blurred)
        expect(inputFormFieldComponent.errors()).toBeNull(); // Component should not show errors yet

        // Spy on the component's method that should be called by the event.
        const updateErrorsSpy = jest.spyOn(inputFormFieldComponent, 'updateErrors');

        // Act: Trigger the action that should cause the control.events to emit
        // and be caught by the component's subscription filter.
        hostComponent.form.markAllAsTouched();
        tick(); // Allow asynchronous operations (like observable emissions from control.events) to complete.
        hostFixture.detectChanges(); // Update the component's view based on any signal changes.

        // Assert: Check if the component reacted as expected.
        // 1. Verify the specific method was called (due to the control.events subscription).
        expect(updateErrorsSpy).toHaveBeenCalled();
        // 2. Verify the component's internal error state matches the control's errors.
        expect(inputFormFieldComponent.errors()).toEqual(testControl.errors);
        expect(inputFormFieldComponent.errors()?.['required']).toBe(true); // Specifically check for the 'required' error.

        // 3. Verify the UI reflects the error state (e.g., an error class is applied).
        const divWrapper = hostFixture.debugElement.query(By.css('.lib-input-form-field'));
        expect(divWrapper.classes['lib-input-form-field--error']).toBe(true);

        // Cleanup: Restore the original method.
        updateErrorsSpy.mockRestore();
      }));
    });
  });

  describe('Provided with an individual FormControl', () => {
    let hostFixture: ComponentFixture<TestStandaloneHostComponent>;
    let hostComponent: TestStandaloneHostComponent;
    let inputFormFieldComponent: InputFormFieldComponent;
    let inputElement: HTMLInputElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestStandaloneHostComponent, ReactiveFormsModule],
      });

      hostFixture = TestBed.createComponent(TestStandaloneHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      const inputFormFieldDE = hostFixture.debugElement.query(By.directive(InputFormFieldComponent));
      inputFormFieldComponent = inputFormFieldDE.componentInstance;
      inputElement = hostFixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should be created and linked to the standalone form control', () => {
      expect(inputFormFieldComponent).toBeTruthy();
      expect(inputFormFieldComponent.control).toBe(hostComponent.standaloneControl);
    });

    it('should display initial value from standalone form control', () => {
      expect(inputElement.value).toBe('standalone value');
      expect(inputFormFieldComponent.value()).toBe('standalone value');
    });

    it('should update standalone form control when user types', fakeAsync(() => {
      inputElement.value = 'new standalone type';
      inputElement.dispatchEvent(new Event('input'));
      tick();
      hostFixture.detectChanges();
      expect(hostComponent.standaloneControl.value).toBe('new standalone type');
    }));
  });

  describe('Not provided with a FormControlName or FormControl', () => {
    let component: InputFormFieldComponent;
    let fixture: ComponentFixture<InputFormFieldComponent>;
    let componentRef: ComponentRef<InputFormFieldComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InputFormFieldComponent, ReactiveFormsModule],
      });

      fixture = TestBed.createComponent(InputFormFieldComponent);
      component = fixture.componentInstance;
      componentRef = fixture.componentRef;

      componentRef.setInput('label', 'CVA Fallback Label');
      componentRef.setInput('inputId', 'cvaFallbackInputId');

      fixture.detectChanges();
    });

    it('should initialize a new FormControl if no NgControl is found', () => {
      expect(component.control).toBeInstanceOf(FormControl);
    });

    it('writeValue should update value signal and input element when no NgControl', () => {
      component.writeValue('new value from CVA');
      fixture.detectChanges();
      expect(component.value()).toBe('new value from CVA');

      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(inputElement.value).toBe('new value from CVA');
    });

    it('setDisabledState should update isDisabled signal and input element when no NgControl', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(component.isDisabled()).toBe(true);

      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(inputElement.disabled).toBe(true);

      component.setDisabledState(false);
      fixture.detectChanges();

      expect(component.isDisabled()).toBe(false);
      expect(inputElement.disabled).toBe(false);
    });
  });
});

