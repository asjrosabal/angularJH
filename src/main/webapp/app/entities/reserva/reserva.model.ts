import * as dayjs from 'dayjs';
import { IPaciente } from 'app/entities/paciente/paciente.model';
import { Especialidad } from 'app/entities/enumerations/especialidad.model';

export interface IReserva {
  id?: number;
  fecha?: dayjs.Dayjs | null;
  hora?: dayjs.Dayjs | null;
  especialidad?: Especialidad | null;
  rut?: IPaciente | null;
}

export class Reserva implements IReserva {
  constructor(
    public id?: number,
    public fecha?: dayjs.Dayjs | null,
    public hora?: dayjs.Dayjs | null,
    public especialidad?: Especialidad | null,
    public rut?: IPaciente | null
  ) {}
}

export function getReservaIdentifier(reserva: IReserva): number | undefined {
  return reserva.id;
}
