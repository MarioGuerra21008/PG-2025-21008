/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    
    maybe<E extends HTMLElement = HTMLElement>(selector: string): Chainable<JQuery<E>>;
  }
}
