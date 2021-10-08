import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReserva, Reserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';

@Injectable({ providedIn: 'root' })
export class ReservaRoutingResolveService implements Resolve<IReserva> {
  constructor(protected service: ReservaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReserva> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((reserva: HttpResponse<Reserva>) => {
          if (reserva.body) {
            return of(reserva.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Reserva());
  }
}
