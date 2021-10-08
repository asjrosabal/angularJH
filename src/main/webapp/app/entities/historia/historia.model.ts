import * as dayjs from 'dayjs';
import { IPaciente } from 'app/entities/paciente/paciente.model';

export interface IHistoria {
  id?: number;
  fecha?: dayjs.Dayjs | null;
  diagnostico?: string | null;
  descripcion?: string | null;
  resultadoFile?: string | null;
  rut?: IPaciente | null;
}

export class Historia implements IHistoria {
  constructor(
    public id?: number,
    public fecha?: dayjs.Dayjs | null,
    public diagnostico?: string | null,
    public descripcion?: string | null,
    public resultadoFile?: string | null,
    public rut?: IPaciente | null
  ) {}
}

export function getHistoriaIdentifier(historia: IHistoria): number | undefined {
  return historia.id;
}
