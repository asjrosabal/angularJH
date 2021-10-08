import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IReserva, Reserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';
import { IPaciente } from 'app/entities/paciente/paciente.model';
import { PacienteService } from 'app/entities/paciente/service/paciente.service';

@Component({
  selector: 'jhi-reserva-update',
  templateUrl: './reserva-update.component.html',
})
export class ReservaUpdateComponent implements OnInit {
  isSaving = false;

  pacientesSharedCollection: IPaciente[] = [];

  editForm = this.fb.group({
    id: [],
    fecha: [],
    hora: [],
    especialidad: [],
    rut: [],
  });

  constructor(
    protected reservaService: ReservaService,
    protected pacienteService: PacienteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reserva }) => {
      if (reserva.id === undefined) {
        const today = dayjs().startOf('day');
        reserva.hora = today;
      }

      this.updateForm(reserva);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reserva = this.createFromForm();
    if (reserva.id !== undefined) {
      this.subscribeToSaveResponse(this.reservaService.update(reserva));
    } else {
      this.subscribeToSaveResponse(this.reservaService.create(reserva));
    }
  }

  trackPacienteById(index: number, item: IPaciente): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReserva>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(reserva: IReserva): void {
    this.editForm.patchValue({
      id: reserva.id,
      fecha: reserva.fecha,
      hora: reserva.hora ? reserva.hora.format(DATE_TIME_FORMAT) : null,
      especialidad: reserva.especialidad,
      rut: reserva.rut,
    });

    this.pacientesSharedCollection = this.pacienteService.addPacienteToCollectionIfMissing(this.pacientesSharedCollection, reserva.rut);
  }

  protected loadRelationshipsOptions(): void {
    this.pacienteService
      .query()
      .pipe(map((res: HttpResponse<IPaciente[]>) => res.body ?? []))
      .pipe(
        map((pacientes: IPaciente[]) => this.pacienteService.addPacienteToCollectionIfMissing(pacientes, this.editForm.get('rut')!.value))
      )
      .subscribe((pacientes: IPaciente[]) => (this.pacientesSharedCollection = pacientes));
  }

  protected createFromForm(): IReserva {
    return {
      ...new Reserva(),
      id: this.editForm.get(['id'])!.value,
      fecha: this.editForm.get(['fecha'])!.value,
      hora: this.editForm.get(['hora'])!.value ? dayjs(this.editForm.get(['hora'])!.value, DATE_TIME_FORMAT) : undefined,
      especialidad: this.editForm.get(['especialidad'])!.value,
      rut: this.editForm.get(['rut'])!.value,
    };
  }
}
