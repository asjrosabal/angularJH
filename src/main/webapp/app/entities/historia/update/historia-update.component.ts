import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IHistoria, Historia } from '../historia.model';
import { HistoriaService } from '../service/historia.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPaciente } from 'app/entities/paciente/paciente.model';
import { PacienteService } from 'app/entities/paciente/service/paciente.service';

@Component({
  selector: 'jhi-historia-update',
  templateUrl: './historia-update.component.html',
})
export class HistoriaUpdateComponent implements OnInit {
  isSaving = false;

  pacientesSharedCollection: IPaciente[] = [];

  editForm = this.fb.group({
    id: [],
    fecha: [],
    diagnostico: [],
    descripcion: [],
    resultadoFile: [],
    rut: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected historiaService: HistoriaService,
    protected pacienteService: PacienteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historia }) => {
      this.updateForm(historia);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('angularApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const historia = this.createFromForm();
    if (historia.id !== undefined) {
      this.subscribeToSaveResponse(this.historiaService.update(historia));
    } else {
      this.subscribeToSaveResponse(this.historiaService.create(historia));
    }
  }

  trackPacienteById(index: number, item: IPaciente): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHistoria>>): void {
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

  protected updateForm(historia: IHistoria): void {
    this.editForm.patchValue({
      id: historia.id,
      fecha: historia.fecha,
      diagnostico: historia.diagnostico,
      descripcion: historia.descripcion,
      resultadoFile: historia.resultadoFile,
      rut: historia.rut,
    });

    this.pacientesSharedCollection = this.pacienteService.addPacienteToCollectionIfMissing(this.pacientesSharedCollection, historia.rut);
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

  protected createFromForm(): IHistoria {
    return {
      ...new Historia(),
      id: this.editForm.get(['id'])!.value,
      fecha: this.editForm.get(['fecha'])!.value,
      diagnostico: this.editForm.get(['diagnostico'])!.value,
      descripcion: this.editForm.get(['descripcion'])!.value,
      resultadoFile: this.editForm.get(['resultadoFile'])!.value,
      rut: this.editForm.get(['rut'])!.value,
    };
  }
}
