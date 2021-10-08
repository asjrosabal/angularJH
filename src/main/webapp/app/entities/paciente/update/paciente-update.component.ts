import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaciente, Paciente } from '../paciente.model';
import { PacienteService } from '../service/paciente.service';
import { IEspecialista } from 'app/entities/especialista/especialista.model';
import { EspecialistaService } from 'app/entities/especialista/service/especialista.service';

@Component({
  selector: 'jhi-paciente-update',
  templateUrl: './paciente-update.component.html',
})
export class PacienteUpdateComponent implements OnInit {
  isSaving = false;

  especialistasSharedCollection: IEspecialista[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [],
    apellidos: [],
    rut: [],
    fechaNacimiento: [],
    rut: [],
  });

  constructor(
    protected pacienteService: PacienteService,
    protected especialistaService: EspecialistaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paciente }) => {
      this.updateForm(paciente);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paciente = this.createFromForm();
    if (paciente.id !== undefined) {
      this.subscribeToSaveResponse(this.pacienteService.update(paciente));
    } else {
      this.subscribeToSaveResponse(this.pacienteService.create(paciente));
    }
  }

  trackEspecialistaById(index: number, item: IEspecialista): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaciente>>): void {
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

  protected updateForm(paciente: IPaciente): void {
    this.editForm.patchValue({
      id: paciente.id,
      nombre: paciente.nombre,
      apellidos: paciente.apellidos,
      rut: paciente.rut,
      fechaNacimiento: paciente.fechaNacimiento,
      rut: paciente.rut,
    });

    this.especialistasSharedCollection = this.especialistaService.addEspecialistaToCollectionIfMissing(
      this.especialistasSharedCollection,
      paciente.rut
    );
  }

  protected loadRelationshipsOptions(): void {
    this.especialistaService
      .query()
      .pipe(map((res: HttpResponse<IEspecialista[]>) => res.body ?? []))
      .pipe(
        map((especialistas: IEspecialista[]) =>
          this.especialistaService.addEspecialistaToCollectionIfMissing(especialistas, this.editForm.get('rut')!.value)
        )
      )
      .subscribe((especialistas: IEspecialista[]) => (this.especialistasSharedCollection = especialistas));
  }

  protected createFromForm(): IPaciente {
    return {
      ...new Paciente(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      apellidos: this.editForm.get(['apellidos'])!.value,
      rut: this.editForm.get(['rut'])!.value,
      fechaNacimiento: this.editForm.get(['fechaNacimiento'])!.value,
      rut: this.editForm.get(['rut'])!.value,
    };
  }
}
