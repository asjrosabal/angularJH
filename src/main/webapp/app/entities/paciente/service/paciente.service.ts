import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPaciente, getPacienteIdentifier } from '../paciente.model';

export type EntityResponseType = HttpResponse<IPaciente>;
export type EntityArrayResponseType = HttpResponse<IPaciente[]>;

@Injectable({ providedIn: 'root' })
export class PacienteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pacientes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paciente: IPaciente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paciente);
    return this.http
      .post<IPaciente>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(paciente: IPaciente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paciente);
    return this.http
      .put<IPaciente>(`${this.resourceUrl}/${getPacienteIdentifier(paciente) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(paciente: IPaciente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paciente);
    return this.http
      .patch<IPaciente>(`${this.resourceUrl}/${getPacienteIdentifier(paciente) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPaciente>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPaciente[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPacienteToCollectionIfMissing(pacienteCollection: IPaciente[], ...pacientesToCheck: (IPaciente | null | undefined)[]): IPaciente[] {
    const pacientes: IPaciente[] = pacientesToCheck.filter(isPresent);
    if (pacientes.length > 0) {
      const pacienteCollectionIdentifiers = pacienteCollection.map(pacienteItem => getPacienteIdentifier(pacienteItem)!);
      const pacientesToAdd = pacientes.filter(pacienteItem => {
        const pacienteIdentifier = getPacienteIdentifier(pacienteItem);
        if (pacienteIdentifier == null || pacienteCollectionIdentifiers.includes(pacienteIdentifier)) {
          return false;
        }
        pacienteCollectionIdentifiers.push(pacienteIdentifier);
        return true;
      });
      return [...pacientesToAdd, ...pacienteCollection];
    }
    return pacienteCollection;
  }

  protected convertDateFromClient(paciente: IPaciente): IPaciente {
    return Object.assign({}, paciente, {
      fechaNacimiento: paciente.fechaNacimiento?.isValid() ? paciente.fechaNacimiento.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((paciente: IPaciente) => {
        paciente.fechaNacimiento = paciente.fechaNacimiento ? dayjs(paciente.fechaNacimiento) : undefined;
      });
    }
    return res;
  }
}
