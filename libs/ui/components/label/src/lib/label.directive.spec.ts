import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { LibLabelDirective } from './label.directive';
import { AbstractStyledDirective } from '@ngnx-playground/ui/core/abstract-styled-directive';
import cssValidator from 'w3c-css-validator';

@Component({
  template: `<label libLabel>label</label>`,
  imports: [LibLabelDirective],
})
class HostComponent {}

describe('LibLabelDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let directive: LibLabelDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.directive(LibLabelDirective));
    directive = debugEl.injector.get(LibLabelDirective);
  });

  it('should have correct name property', () => {
    expect(directive.componentName).toBe('label');
  });

  it('should add the .lib-label class to the host element', () => {
    const labelEl: HTMLElement = fixture.nativeElement.querySelector('label');
    expect(labelEl.classList).toContain('lib-label');
  });

  it('should add data-lib-component attribute with the correct name value', () => {
    const labelEl: HTMLElement = fixture.nativeElement.querySelector('label');

    expect(labelEl.getAttribute('data-lib-component')).toBe('label');
  });

  it('should contain valid CSS', async () => {
    const validation = await cssValidator.validateText(
      directive.componentStyles
    );

    if (!validation.valid) {
      const validationErrors = validation.errors
        .map((error) => `Line ${error.line}: ${error.message}`)
        .join('\n');

      throw new Error(`CSS validation errors:\n${validationErrors}`);
    }

    expect(validation.valid).toBe(true);
  });

  it('should call loadStyles on init', () => {
    const loadStylesSpy = jest.spyOn(
      AbstractStyledDirective.prototype,
      'loadStyles'
    );

    directive.ngOnInit();

    expect(loadStylesSpy).toHaveBeenCalledTimes(1);
  });

  it('should call removeStyles on destroy', () => {
    const removeStylesSpy = jest.spyOn(
      AbstractStyledDirective.prototype,
      'removeStyles'
    );

    fixture.destroy();

    expect(removeStylesSpy).toHaveBeenCalledTimes(1);
  });
});
