jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ReservaService } from '../service/reserva.service';
import { IReserva, Reserva } from '../reserva.model';
import { IPaciente } from 'app/entities/paciente/paciente.model';
import { PacienteService } from 'app/entities/paciente/service/paciente.service';

import { ReservaUpdateComponent } from './reserva-update.component';

describe('Component Tests', () => {
  describe('Reserva Management Update Component', () => {
    let comp: ReservaUpdateComponent;
    let fixture: ComponentFixture<ReservaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let reservaService: ReservaService;
    let pacienteService: PacienteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReservaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ReservaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReservaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      reservaService = TestBed.inject(ReservaService);
      pacienteService = TestBed.inject(PacienteService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Paciente query and add missing value', () => {
        const reserva: IReserva = { id: 456 };
        const rut: IPaciente = { id: 22488 };
        reserva.rut = rut;

        const pacienteCollection: IPaciente[] = [{ id: 24021 }];
        jest.spyOn(pacienteService, 'query').mockReturnValue(of(new HttpResponse({ body: pacienteCollection })));
        const additionalPacientes = [rut];
        const expectedCollection: IPaciente[] = [...additionalPacientes, ...pacienteCollection];
        jest.spyOn(pacienteService, 'addPacienteToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ reserva });
        comp.ngOnInit();

        expect(pacienteService.query).toHaveBeenCalled();
        expect(pacienteService.addPacienteToCollectionIfMissing).toHaveBeenCalledWith(pacienteCollection, ...additionalPacientes);
        expect(comp.pacientesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const reserva: IReserva = { id: 456 };
        const rut: IPaciente = { id: 73090 };
        reserva.rut = rut;

        activatedRoute.data = of({ reserva });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(reserva));
        expect(comp.pacientesSharedCollection).toContain(rut);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Reserva>>();
        const reserva = { id: 123 };
        jest.spyOn(reservaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reserva });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: reserva }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(reservaService.update).toHaveBeenCalledWith(reserva);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Reserva>>();
        const reserva = new Reserva();
        jest.spyOn(reservaService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reserva });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: reserva }));
        saveSubject.complete();

        // THEN
        expect(reservaService.create).toHaveBeenCalledWith(reserva);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Reserva>>();
        const reserva = { id: 123 };
        jest.spyOn(reservaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ reserva });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(reservaService.update).toHaveBeenCalledWith(reserva);
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
