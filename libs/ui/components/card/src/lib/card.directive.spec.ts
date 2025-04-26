import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { LibCardDirective } from './card.directive';
import { AbstractStyledDirective } from '@crm-project/ui/core/abstract-styled-directive';
import cssValidator from 'w3c-css-validator';

@Component({
  template: `<div libCard>card</div>`,
  imports: [LibCardDirective],
})
class HostComponent {}

describe('LibCardDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let directive: LibCardDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.directive(LibCardDirective));
    directive = debugEl.injector.get(LibCardDirective);
  });

  it('should have correct name property', () => {
    expect(directive.componentName).toBe('card');
  });

  it('should add the .lib-card class to the host element', () => {
    const divEl: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(divEl.classList).toContain('lib-card');
  });

  it('should add data-lib-component attribute with the correct name value', () => {
    const divEl: HTMLElement = fixture.nativeElement.querySelector('div');

    expect(divEl.getAttribute('data-lib-component')).toBe('card');
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
