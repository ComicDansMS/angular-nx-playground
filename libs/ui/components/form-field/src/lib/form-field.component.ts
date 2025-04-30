import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  OnDestroy,
} from '@angular/core';
import { LibInputDirective } from '@crm-project/ui/components/input';
import { LibLabelDirective } from '@crm-project/ui/components/label';

const labelStyle = /* css */ `
  .lib-form-field--field-container {
    label {
      position: absolute;
      z-index: -1;
      top: 50%;
      transform: translateY(-50%);
      left: 0.75rem;
      letter-spacing: 0.04rem;
      font-size: 1rem;
      transition: all 200ms;
    }
  }

  .lib-form-field--field-container:focus-within,
  .lib-form-field--field-container:has(.lib-input--has-value) {
    label {
      position: absolute;
      z-index: -1;
      top: 0.35rem;
      transform: translateY(0);
      font-size: 0.625rem;
    }
  }
`;

const inputStyle = /* css */ `
  .lib-form-field--field-container {
    input {
      padding: 1.375rem 0.75rem 0.5rem 0.75rem;
      height: 2.8125rem;
    }

    input::placeholder {
      transition: opacity 100ms;
    }
  }

  .lib-form-field--field-container:not(:focus-within) {
    input::placeholder {
      opacity: 0;
    }
  }
`;

@Component({
  selector: 'lib-form-field',
  template: `
    <div class="lib-form-field w-full">
      <div class="lib-form-field--field-container">
        <ng-content></ng-content>
      </div>
      <div class="h-6">
        <!-- <div class="text-red-300 text-[10px] pt-1">An error</div> -->
      </div>
    </div>
  `,
  styles: `
    .lib-form-field--field-container {
      position: relative;
      width: max-content;
      z-index: 1;
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibFormFieldComponent implements AfterContentInit, OnDestroy {
  @ContentChild(LibInputDirective) input!: LibInputDirective;
  @ContentChild(LibLabelDirective) label!: LibLabelDirective;

  styleComponent() {
    if (this.input !== undefined) {
      this.input.loadStyles(inputStyle, 'form-field-input');
    }

    if (this.label !== undefined) {
      this.label.loadStyles(labelStyle, 'form-field-label');
    }
  }

  ngAfterContentInit(): void {
    this.styleComponent();
  }

  ngOnDestroy(): void {
    if (this.input !== undefined) {
      this.input.removeStyles('form-field-input');
    }

    if (this.label !== undefined) {
      this.label.removeStyles('form-field-label');
    }
  }
}
