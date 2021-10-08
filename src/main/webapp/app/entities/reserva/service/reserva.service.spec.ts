import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Especialidad } from 'app/entities/enumerations/especialidad.model';
import { IReserva, Reserva } from '../reserva.model';

import { ReservaService } from './reserva.service';

describe('Service Tests', () => {
  describe('Reserva Service', () => {
    let service: ReservaService;
    let httpMock: HttpTestingController;
    let elemDefault: IReserva;
    let expectedResult: IReserva | IReserva[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ReservaService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        fecha: currentDate,
        hora: currentDate,
        especialidad: Especialidad.MEDICINA_GENERAL,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            fecha: currentDate.format(DATE_FORMAT),
            hora: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Reserva', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            fecha: currentDate.format(DATE_FORMAT),
            hora: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fecha: currentDate,
            hora: currentDate,
          },
          returnedFromService
        );

        service.create(new Reserva()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Reserva', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            fecha: currentDate.format(DATE_FORMAT),
            hora: currentDate.format(DATE_TIME_FORMAT),
            especialidad: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fecha: currentDate,
            hora: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Reserva', () => {
        const patchObject = Object.assign(
          {
            fecha: currentDate.format(DATE_FORMAT),
            hora: currentDate.format(DATE_TIME_FORMAT),
          },
          new Reserva()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            fecha: currentDate,
            hora: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Reserva', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            fecha: currentDate.format(DATE_FORMAT),
            hora: currentDate.format(DATE_TIME_FORMAT),
            especialidad: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fecha: currentDate,
            hora: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Reserva', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addReservaToCollectionIfMissing', () => {
        it('should add a Reserva to an empty array', () => {
          const reserva: IReserva = { id: 123 };
          expectedResult = service.addReservaToCollectionIfMissing([], reserva);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(reserva);
        });

        it('should not add a Reserva to an array that contains it', () => {
          const reserva: IReserva = { id: 123 };
          const reservaCollection: IReserva[] = [
            {
              ...reserva,
            },
            { id: 456 },
          ];
          expectedResult = service.addReservaToCollectionIfMissing(reservaCollection, reserva);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Reserva to an array that doesn't contain it", () => {
          const reserva: IReserva = { id: 123 };
          const reservaCollection: IReserva[] = [{ id: 456 }];
          expectedResult = service.addReservaToCollectionIfMissing(reservaCollection, reserva);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(reserva);
        });

        it('should add only unique Reserva to an array', () => {
          const reservaArray: IReserva[] = [{ id: 123 }, { id: 456 }, { id: 84968 }];
          const reservaCollection: IReserva[] = [{ id: 123 }];
          expectedResult = service.addReservaToCollectionIfMissing(reservaCollection, ...reservaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const reserva: IReserva = { id: 123 };
          const reserva2: IReserva = { id: 456 };
          expectedResult = service.addReservaToCollectionIfMissing([], reserva, reserva2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(reserva);
          expect(expectedResult).toContain(reserva2);
        });

        it('should accept null and undefined values', () => {
          const reserva: IReserva = { id: 123 };
          expectedResult = service.addReservaToCollectionIfMissing([], null, reserva, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(reserva);
        });

        it('should return initial array if no Reserva is added', () => {
          const reservaCollection: IReserva[] = [{ id: 123 }];
          expectedResult = service.addReservaToCollectionIfMissing(reservaCollection, undefined, null);
          expect(expectedResult).toEqual(reservaCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
