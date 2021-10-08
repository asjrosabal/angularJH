import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EspecialistaDetailComponent } from './especialista-detail.component';

describe('Component Tests', () => {
  describe('Especialista Management Detail Component', () => {
    let comp: EspecialistaDetailComponent;
    let fixture: ComponentFixture<EspecialistaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EspecialistaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ especialista: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(EspecialistaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EspecialistaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load especialista on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.especialista).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
