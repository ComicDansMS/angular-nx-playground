import { Injectable } from '@angular/core';
import { ComponentStyleBase } from '@crm-project/ui/core/component-style-base';

const styles = /* css */ ` 
  .lib-input {
    border: solid 1px #929292;
    width: 200px;
    border-radius: 0.25rem;
    padding: 0.35rem 0.45rem;
  }

  .lib-input:focus {
    outline: none;
    box-shadow: 0px 0px 0px 1px #929292;
  }

  .lib-input::placeholder {
    opacity: 0.4;
  }

  .lib-input--small {
    width: 150px;
  }

  .lib-input--large {
    width: 300px;
  }
`;

@Injectable()
export class InputStyle extends ComponentStyleBase {
  componentStyles = styles;
}
