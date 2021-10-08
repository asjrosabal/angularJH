import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IHistoria, Historia } from '../historia.model';

import { HistoriaService } from './historia.service';

describe('Service Tests', () => {
  describe('Historia Service', () => {
    let service: HistoriaService;
    let httpMock: HttpTestingController;
    let elemDefault: IHistoria;
    let expectedResult: IHistoria | IHistoria[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(HistoriaService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        fecha: currentDate,
        diagnostico: 'AAAAAAA',
        descripcion: 'AAAAAAA',
        resultadoFile: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            fecha: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Historia', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            fecha: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fecha: currentDate,
          },
          returnedFromService
        );

        service.create(new Historia()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Historia', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            fecha: currentDate.format(DATE_FORMAT),
            diagnostico: 'BBBBBB',
            descripcion: 'BBBBBB',
            resultadoFile: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fecha: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Historia', () => {
        const patchObject = Object.assign(
          {
            diagnostico: 'BBBBBB',
          },
          new Historia()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            fecha: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Historia', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            fecha: currentDate.format(DATE_FORMAT),
            diagnostico: 'BBBBBB',
            descripcion: 'BBBBBB',
            resultadoFile: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fecha: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Historia', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addHistoriaToCollectionIfMissing', () => {
        it('should add a Historia to an empty array', () => {
          const historia: IHistoria = { id: 123 };
          expectedResult = service.addHistoriaToCollectionIfMissing([], historia);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(historia);
        });

        it('should not add a Historia to an array that contains it', () => {
          const historia: IHistoria = { id: 123 };
          const historiaCollection: IHistoria[] = [
            {
              ...historia,
            },
            { id: 456 },
          ];
          expectedResult = service.addHistoriaToCollectionIfMissing(historiaCollection, historia);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Historia to an array that doesn't contain it", () => {
          const historia: IHistoria = { id: 123 };
          const historiaCollection: IHistoria[] = [{ id: 456 }];
          expectedResult = service.addHistoriaToCollectionIfMissing(historiaCollection, historia);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(historia);
        });

        it('should add only unique Historia to an array', () => {
          const historiaArray: IHistoria[] = [{ id: 123 }, { id: 456 }, { id: 93816 }];
          const historiaCollection: IHistoria[] = [{ id: 123 }];
          expectedResult = service.addHistoriaToCollectionIfMissing(historiaCollection, ...historiaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const historia: IHistoria = { id: 123 };
          const historia2: IHistoria = { id: 456 };
          expectedResult = service.addHistoriaToCollectionIfMissing([], historia, historia2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(historia);
          expect(expectedResult).toContain(historia2);
        });

        it('should accept null and undefined values', () => {
          const historia: IHistoria = { id: 123 };
          expectedResult = service.addHistoriaToCollectionIfMissing([], null, historia, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(historia);
        });

        it('should return initial array if no Historia is added', () => {
          const historiaCollection: IHistoria[] = [{ id: 123 }];
          expectedResult = service.addHistoriaToCollectionIfMissing(historiaCollection, undefined, null);
          expect(expectedResult).toEqual(historiaCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
