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

describe('Paciente e2e test', () => {
  const pacientePageUrl = '/paciente';
  const pacientePageUrlPattern = new RegExp('/paciente(\\?.*)?$');
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
    cy.intercept('GET', '/api/pacientes+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/pacientes').as('postEntityRequest');
    cy.intercept('DELETE', '/api/pacientes/*').as('deleteEntityRequest');
  });

  it('should load Pacientes', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('paciente');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Paciente').should('exist');
    cy.url().should('match', pacientePageUrlPattern);
  });

  it('should load details Paciente page', function () {
    cy.visit(pacientePageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('paciente');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', pacientePageUrlPattern);
  });

  it('should load create Paciente page', () => {
    cy.visit(pacientePageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Paciente');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', pacientePageUrlPattern);
  });

  it('should load edit Paciente page', function () {
    cy.visit(pacientePageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('Paciente');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', pacientePageUrlPattern);
  });

  it('should create an instance of Paciente', () => {
    cy.visit(pacientePageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Paciente');

    cy.get(`[data-cy="nombre"]`).type('bypassing synthesizing Mesa').should('have.value', 'bypassing synthesizing Mesa');

    cy.get(`[data-cy="apellidos"]`).type('Guinea-Bisau Granito').should('have.value', 'Guinea-Bisau Granito');

    cy.get(`[data-cy="rut"]`).type('Account Rioja Cataluña').should('have.value', 'Account Rioja Cataluña');

    cy.get(`[data-cy="fechaNacimiento"]`).type('2021-10-08').should('have.value', '2021-10-08');

    cy.setFieldSelectToLastOfEntity('rut');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', pacientePageUrlPattern);
  });

  it('should delete last instance of Paciente', function () {
    cy.visit(pacientePageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('paciente').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', pacientePageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
