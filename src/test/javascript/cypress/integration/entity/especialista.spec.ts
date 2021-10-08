import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Especialista e2e test', () => {
  const especialistaPageUrl = '/especialista';
  const especialistaPageUrlPattern = new RegExp('/especialista(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/especialistas+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/especialistas').as('postEntityRequest');
    cy.intercept('DELETE', '/api/especialistas/*').as('deleteEntityRequest');
  });

  it('should load Especialistas', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('especialista');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Especialista').should('exist');
    cy.url().should('match', especialistaPageUrlPattern);
  });

  it('should load details Especialista page', function () {
    cy.visit(especialistaPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('especialista');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', especialistaPageUrlPattern);
  });

  it('should load create Especialista page', () => {
    cy.visit(especialistaPageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Especialista');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', especialistaPageUrlPattern);
  });

  it('should load edit Especialista page', function () {
    cy.visit(especialistaPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('Especialista');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', especialistaPageUrlPattern);
  });

  it('should create an instance of Especialista', () => {
    cy.visit(especialistaPageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Especialista');

    cy.get(`[data-cy="nombre"]`).type('intranet Electrónica').should('have.value', 'intranet Electrónica');

    cy.get(`[data-cy="apellidos"]`).type('Masía Asturias Algodón').should('have.value', 'Masía Asturias Algodón');

    cy.get(`[data-cy="rut"]`).type('synthesize cross-platform').should('have.value', 'synthesize cross-platform');

    cy.get(`[data-cy="fechaNacimiento"]`).type('2021-10-07').should('have.value', '2021-10-07');

    cy.get(`[data-cy="registroMedico"]`).type('Yen Guapo').should('have.value', 'Yen Guapo');

    cy.get(`[data-cy="especialidad"]`).select('MEDICINA_GENERAL');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', especialistaPageUrlPattern);
  });

  it('should delete last instance of Especialista', function () {
    cy.visit(especialistaPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('especialista').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', especialistaPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
