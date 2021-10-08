jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EspecialistaService } from '../service/especialista.service';
import { IEspecialista, Especialista } from '../especialista.model';

import { EspecialistaUpdateComponent } from './especialista-update.component';

describe('Component Tests', () => {
  describe('Especialista Management Update Component', () => {
    let comp: EspecialistaUpdateComponent;
    let fixture: ComponentFixture<EspecialistaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let especialistaService: EspecialistaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EspecialistaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EspecialistaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EspecialistaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      especialistaService = TestBed.inject(EspecialistaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const especialista: IEspecialista = { id: 456 };

        activatedRoute.data = of({ especialista });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(especialista));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Especialista>>();
        const especialista = { id: 123 };
        jest.spyOn(especialistaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ especialista });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: especialista }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(especialistaService.update).toHaveBeenCalledWith(especialista);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Especialista>>();
        const especialista = new Especialista();
        jest.spyOn(especialistaService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ especialista });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: especialista }));
        saveSubject.complete();

        // THEN
        expect(especialistaService.create).toHaveBeenCalledWith(especialista);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Especialista>>();
        const especialista = { id: 123 };
        jest.spyOn(especialistaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ especialista });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(especialistaService.update).toHaveBeenCalledWith(especialista);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
