jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { HistoriaService } from '../service/historia.service';
import { IHistoria, Historia } from '../historia.model';
import { IPaciente } from 'app/entities/paciente/paciente.model';
import { PacienteService } from 'app/entities/paciente/service/paciente.service';

import { HistoriaUpdateComponent } from './historia-update.component';

describe('Component Tests', () => {
  describe('Historia Management Update Component', () => {
    let comp: HistoriaUpdateComponent;
    let fixture: ComponentFixture<HistoriaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let historiaService: HistoriaService;
    let pacienteService: PacienteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HistoriaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(HistoriaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HistoriaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      historiaService = TestBed.inject(HistoriaService);
      pacienteService = TestBed.inject(PacienteService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Paciente query and add missing value', () => {
        const historia: IHistoria = { id: 456 };
        const rut: IPaciente = { id: 94557 };
        historia.rut = rut;

        const pacienteCollection: IPaciente[] = [{ id: 92177 }];
        jest.spyOn(pacienteService, 'query').mockReturnValue(of(new HttpResponse({ body: pacienteCollection })));
        const additionalPacientes = [rut];
        const expectedCollection: IPaciente[] = [...additionalPacientes, ...pacienteCollection];
        jest.spyOn(pacienteService, 'addPacienteToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ historia });
        comp.ngOnInit();

        expect(pacienteService.query).toHaveBeenCalled();
        expect(pacienteService.addPacienteToCollectionIfMissing).toHaveBeenCalledWith(pacienteCollection, ...additionalPacientes);
        expect(comp.pacientesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const historia: IHistoria = { id: 456 };
        const rut: IPaciente = { id: 44916 };
        historia.rut = rut;

        activatedRoute.data = of({ historia });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(historia));
        expect(comp.pacientesSharedCollection).toContain(rut);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Historia>>();
        const historia = { id: 123 };
        jest.spyOn(historiaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ historia });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: historia }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(historiaService.update).toHaveBeenCalledWith(historia);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Historia>>();
        const historia = new Historia();
        jest.spyOn(historiaService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ historia });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: historia }));
        saveSubject.complete();

        // THEN
        expect(historiaService.create).toHaveBeenCalledWith(historia);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Historia>>();
        const historia = { id: 123 };
        jest.spyOn(historiaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ historia });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(historiaService.update).toHaveBeenCalledWith(historia);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPacienteById', () => {
        it('Should return tracked Paciente primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPacienteById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
