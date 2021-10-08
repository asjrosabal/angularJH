import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReservaDetailComponent } from './reserva-detail.component';

describe('Component Tests', () => {
  describe('Reserva Management Detail Component', () => {
    let comp: ReservaDetailComponent;
    let fixture: ComponentFixture<ReservaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ReservaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ reserva: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ReservaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ReservaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load reserva on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.reserva).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
