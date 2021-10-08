import * as dayjs from 'dayjs';
import { IHistoria } from 'app/entities/historia/historia.model';
import { IReserva } from 'app/entities/reserva/reserva.model';
import { IEspecialista } from 'app/entities/especialista/especialista.model';

export interface IPaciente {
  id?: number;
  nombre?: string | null;
  apellidos?: string | null;
  rut?: string | null;
  fechaNacimiento?: dayjs.Dayjs | null;
  historias?: IHistoria[] | null;
  reservas?: IReserva[] | null;
  rut?: IEspecialista | null;
}

export class Paciente implements IPaciente {
  constructor(
    public id?: number,
    public nombre?: string | null,
    public apellidos?: string | null,
    public rut?: string | null,
    public fechaNacimiento?: dayjs.Dayjs | null,
    public historias?: IHistoria[] | null,
    public reservas?: IReserva[] | null,
    public rut?: IEspecialista | null
  ) {}
}

export function getPacienteIdentifier(paciente: IPaciente): number | undefined {
  return paciente.id;
}
