import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { LibButtonDirective } from './button.directive';
import { AbstractStyledDirective } from '@ngnx-playground/ui/core/abstract-styled-directive';
import cssValidator from 'w3c-css-validator';

@Component({
  template: `<button libButton>Button</button>`,
  imports: [LibButtonDirective],
})
class HostComponent {}

describe('LibButtonDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let directive: LibButtonDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(
      By.directive(LibButtonDirective)
    );
    directive = debugEl.injector.get(LibButtonDirective);
  });

  it('should have correct name property', () => {
    expect(directive.componentName).toBe('button');
  });

  it('should add the .lib-button class to the host element', () => {
    const buttonEl: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    expect(buttonEl.classList).toContain('lib-button');
  });

  it('should add data-lib-component attribute with the correct name value', () => {
    const buttonEl: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    expect(buttonEl.getAttribute('data-lib-component')).toBe('button');
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
