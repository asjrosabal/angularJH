import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEspecialista, Especialista } from '../especialista.model';
import { EspecialistaService } from '../service/especialista.service';

@Injectable({ providedIn: 'root' })
export class EspecialistaRoutingResolveService implements Resolve<IEspecialista> {
  constructor(protected service: EspecialistaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEspecialista> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((especialista: HttpResponse<Especialista>) => {
          if (especialista.body) {
            return of(especialista.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Especialista());
  }
}
