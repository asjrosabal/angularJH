jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PacienteService } from '../service/paciente.service';
import { IPaciente, Paciente } from '../paciente.model';
import { IEspecialista } from 'app/entities/especialista/especialista.model';
import { EspecialistaService } from 'app/entities/especialista/service/especialista.service';

import { PacienteUpdateComponent } from './paciente-update.component';

describe('Component Tests', () => {
  describe('Paciente Management Update Component', () => {
    let comp: PacienteUpdateComponent;
    let fixture: ComponentFixture<PacienteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let pacienteService: PacienteService;
    let especialistaService: EspecialistaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PacienteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PacienteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PacienteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      pacienteService = TestBed.inject(PacienteService);
      especialistaService = TestBed.inject(EspecialistaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Especialista query and add missing value', () => {
        const paciente: IPaciente = { id: 456 };
        const rut: IEspecialista = { id: 53913 };
        paciente.rut = rut;

        const especialistaCollection: IEspecialista[] = [{ id: 65882 }];
        jest.spyOn(especialistaService, 'query').mockReturnValue(of(new HttpResponse({ body: especialistaCollection })));
        const additionalEspecialistas = [rut];
        const expectedCollection: IEspecialista[] = [...additionalEspecialistas, ...especialistaCollection];
        jest.spyOn(especialistaService, 'addEspecialistaToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ paciente });
        comp.ngOnInit();

        expect(especialistaService.query).toHaveBeenCalled();
        expect(especialistaService.addEspecialistaToCollectionIfMissing).toHaveBeenCalledWith(
          especialistaCollection,
          ...additionalEspecialistas
        );
        expect(comp.especialistasSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const paciente: IPaciente = { id: 456 };
        const rut: IEspecialista = { id: 96239 };
        paciente.rut = rut;

        activatedRoute.data = of({ paciente });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(paciente));
        expect(comp.especialistasSharedCollection).toContain(rut);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Paciente>>();
        const paciente = { id: 123 };
        jest.spyOn(pacienteService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ paciente });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: paciente }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(pacienteService.update).toHaveBeenCalledWith(paciente);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Paciente>>();
        const paciente = new Paciente();
        jest.spyOn(pacienteService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ paciente });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: paciente }));
        saveSubject.complete();

        // THEN
        expect(pacienteService.create).toHaveBeenCalledWith(paciente);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Paciente>>();
        const paciente = { id: 123 };
        jest.spyOn(pacienteService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ paciente });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(pacienteService.update).toHaveBeenCalledWith(paciente);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEspecialistaById', () => {
        it('Should return tracked Especialista primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEspecialistaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
