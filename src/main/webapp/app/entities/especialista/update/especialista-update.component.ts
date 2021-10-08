import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEspecialista, Especialista } from '../especialista.model';
import { EspecialistaService } from '../service/especialista.service';

@Component({
  selector: 'jhi-especialista-update',
  templateUrl: './especialista-update.component.html',
})
export class EspecialistaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nombre: [],
    apellidos: [],
    rut: [],
    fechaNacimiento: [],
    registroMedico: [],
    especialidad: [],
  });

  constructor(protected especialistaService: EspecialistaService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ especialista }) => {
      this.updateForm(especialista);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const especialista = this.createFromForm();
    if (especialista.id !== undefined) {
      this.subscribeToSaveResponse(this.especialistaService.update(especialista));
    } else {
      this.subscribeToSaveResponse(this.especialistaService.create(especialista));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEspecialista>>): void {
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

  protected updateForm(especialista: IEspecialista): void {
    this.editForm.patchValue({
      id: especialista.id,
      nombre: especialista.nombre,
      apellidos: especialista.apellidos,
      rut: especialista.rut,
      fechaNacimiento: especialista.fechaNacimiento,
      registroMedico: especialista.registroMedico,
      especialidad: especialista.especialidad,
    });
  }

  protected createFromForm(): IEspecialista {
    return {
      ...new Especialista(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      apellidos: this.editForm.get(['apellidos'])!.value,
      rut: this.editForm.get(['rut'])!.value,
      fechaNacimiento: this.editForm.get(['fechaNacimiento'])!.value,
      registroMedico: this.editForm.get(['registroMedico'])!.value,
      especialidad: this.editForm.get(['especialidad'])!.value,
    };
  }
}
