import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReserva, getReservaIdentifier } from '../reserva.model';

export type EntityResponseType = HttpResponse<IReserva>;
export type EntityArrayResponseType = HttpResponse<IReserva[]>;

@Injectable({ providedIn: 'root' })
export class ReservaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reservas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reserva: IReserva): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserva);
    return this.http
      .post<IReserva>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(reserva: IReserva): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserva);
    return this.http
      .put<IReserva>(`${this.resourceUrl}/${getReservaIdentifier(reserva) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(reserva: IReserva): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserva);
    return this.http
      .patch<IReserva>(`${this.resourceUrl}/${getReservaIdentifier(reserva) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IReserva>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IReserva[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReservaToCollectionIfMissing(reservaCollection: IReserva[], ...reservasToCheck: (IReserva | null | undefined)[]): IReserva[] {
    const reservas: IReserva[] = reservasToCheck.filter(isPresent);
    if (reservas.length > 0) {
      const reservaCollectionIdentifiers = reservaCollection.map(reservaItem => getReservaIdentifier(reservaItem)!);
      const reservasToAdd = reservas.filter(reservaItem => {
        const reservaIdentifier = getReservaIdentifier(reservaItem);
        if (reservaIdentifier == null || reservaCollectionIdentifiers.includes(reservaIdentifier)) {
          return false;
        }
        reservaCollectionIdentifiers.push(reservaIdentifier);
        return true;
      });
      return [...reservasToAdd, ...reservaCollection];
    }
    return reservaCollection;
  }

  protected convertDateFromClient(reserva: IReserva): IReserva {
    return Object.assign({}, reserva, {
      fecha: reserva.fecha?.isValid() ? reserva.fecha.format(DATE_FORMAT) : undefined,
      hora: reserva.hora?.isValid() ? reserva.hora.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fecha = res.body.fecha ? dayjs(res.body.fecha) : undefined;
      res.body.hora = res.body.hora ? dayjs(res.body.hora) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((reserva: IReserva) => {
        reserva.fecha = reserva.fecha ? dayjs(reserva.fecha) : undefined;
        reserva.hora = reserva.hora ? dayjs(reserva.hora) : undefined;
      });
    }
    return res;
  }
}
