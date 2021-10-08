import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEspecialista, getEspecialistaIdentifier } from '../especialista.model';

export type EntityResponseType = HttpResponse<IEspecialista>;
export type EntityArrayResponseType = HttpResponse<IEspecialista[]>;

@Injectable({ providedIn: 'root' })
export class EspecialistaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/especialistas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(especialista: IEspecialista): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(especialista);
    return this.http
      .post<IEspecialista>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(especialista: IEspecialista): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(especialista);
    return this.http
      .put<IEspecialista>(`${this.resourceUrl}/${getEspecialistaIdentifier(especialista) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(especialista: IEspecialista): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(especialista);
    return this.http
      .patch<IEspecialista>(`${this.resourceUrl}/${getEspecialistaIdentifier(especialista) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEspecialista>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEspecialista[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEspecialistaToCollectionIfMissing(
    especialistaCollection: IEspecialista[],
    ...especialistasToCheck: (IEspecialista | null | undefined)[]
  ): IEspecialista[] {
    const especialistas: IEspecialista[] = especialistasToCheck.filter(isPresent);
    if (especialistas.length > 0) {
      const especialistaCollectionIdentifiers = especialistaCollection.map(
        especialistaItem => getEspecialistaIdentifier(especialistaItem)!
      );
      const especialistasToAdd = especialistas.filter(especialistaItem => {
        const especialistaIdentifier = getEspecialistaIdentifier(especialistaItem);
        if (especialistaIdentifier == null || especialistaCollectionIdentifiers.includes(especialistaIdentifier)) {
          return false;
        }
        especialistaCollectionIdentifiers.push(especialistaIdentifier);
        return true;
      });
      return [...especialistasToAdd, ...especialistaCollection];
    }
    return especialistaCollection;
  }

  protected convertDateFromClient(especialista: IEspecialista): IEspecialista {
    return Object.assign({}, especialista, {
      fechaNacimiento: especialista.fechaNacimiento?.isValid() ? especialista.fechaNacimiento.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaNacimiento = res.body.fechaNacimiento ? dayjs(res.body.fechaNacimiento) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((especialista: IEspecialista) => {
        especialista.fechaNacimiento = especialista.fechaNacimiento ? dayjs(especialista.fechaNacimiento) : undefined;
      });
    }
    return res;
  }
}
