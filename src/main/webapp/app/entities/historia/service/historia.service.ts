import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHistoria, getHistoriaIdentifier } from '../historia.model';

export type EntityResponseType = HttpResponse<IHistoria>;
export type EntityArrayResponseType = HttpResponse<IHistoria[]>;

@Injectable({ providedIn: 'root' })
export class HistoriaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/historias');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(historia: IHistoria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historia);
    return this.http
      .post<IHistoria>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(historia: IHistoria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historia);
    return this.http
      .put<IHistoria>(`${this.resourceUrl}/${getHistoriaIdentifier(historia) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(historia: IHistoria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historia);
    return this.http
      .patch<IHistoria>(`${this.resourceUrl}/${getHistoriaIdentifier(historia) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IHistoria>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IHistoria[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHistoriaToCollectionIfMissing(historiaCollection: IHistoria[], ...historiasToCheck: (IHistoria | null | undefined)[]): IHistoria[] {
    const historias: IHistoria[] = historiasToCheck.filter(isPresent);
    if (historias.length > 0) {
      const historiaCollectionIdentifiers = historiaCollection.map(historiaItem => getHistoriaIdentifier(historiaItem)!);
      const historiasToAdd = historias.filter(historiaItem => {
        const historiaIdentifier = getHistoriaIdentifier(historiaItem);
        if (historiaIdentifier == null || historiaCollectionIdentifiers.includes(historiaIdentifier)) {
          return false;
        }
        historiaCollectionIdentifiers.push(historiaIdentifier);
        return true;
      });
      return [...historiasToAdd, ...historiaCollection];
    }
    return historiaCollection;
  }

  protected convertDateFromClient(historia: IHistoria): IHistoria {
    return Object.assign({}, historia, {
      fecha: historia.fecha?.isValid() ? historia.fecha.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fecha = res.body.fecha ? dayjs(res.body.fecha) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((historia: IHistoria) => {
        historia.fecha = historia.fecha ? dayjs(historia.fecha) : undefined;
      });
    }
    return res;
  }
}
