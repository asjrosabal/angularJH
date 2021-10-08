jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IReserva, Reserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';

import { ReservaRoutingResolveService } from './reserva-routing-resolve.service';

describe('Service Tests', () => {
  describe('Reserva routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ReservaRoutingResolveService;
    let service: ReservaService;
    let resultReserva: IReserva | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ReservaRoutingResolveService);
      service = TestBed.inject(ReservaService);
      resultReserva = undefined;
    });

    describe('resolve', () => {
      it('should return IReserva returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReserva = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultReserva).toEqual({ id: 123 });
      });

      it('should return new IReserva if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReserva = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultReserva).toEqual(new Reserva());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Reserva })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultReserva = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultReserva).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
