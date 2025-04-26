import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { LibInputDirective } from './input.directive';
import { AbstractStyledDirective } from '@crm-project/ui/core/abstract-styled-directive';
import cssValidator from 'w3c-css-validator';

@Component({
  template: `<input libInput />`,
  imports: [LibInputDirective],
})
class HostComponent {}

describe('LibInputDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let directive: LibInputDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.directive(LibInputDirective));
    directive = debugEl.injector.get(LibInputDirective);
  });

  it('should have correct name property', () => {
    expect(directive.componentName).toBe('input');
  });

  it('should add the .lib-input class to the host element', () => {
    const inputEl: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(inputEl.classList).toContain('lib-input');
  });

  it('should add data-lib-component attribute with the correct name value', () => {
    const inputEl: HTMLElement = fixture.nativeElement.querySelector('input');

    expect(inputEl.getAttribute('data-lib-component')).toBe('input');
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
