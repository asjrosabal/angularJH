import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PacienteDetailComponent } from './paciente-detail.component';

describe('Component Tests', () => {
  describe('Paciente Management Detail Component', () => {
    let comp: PacienteDetailComponent;
    let fixture: ComponentFixture<PacienteDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PacienteDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ paciente: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PacienteDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PacienteDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load paciente on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.paciente).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
