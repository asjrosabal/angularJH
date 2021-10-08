import * as dayjs from 'dayjs';
import { IPaciente } from 'app/entities/paciente/paciente.model';
import { Especialidad } from 'app/entities/enumerations/especialidad.model';

export interface IEspecialista {
  id?: number;
  nombre?: string | null;
  apellidos?: string | null;
  rut?: string | null;
  fechaNacimiento?: dayjs.Dayjs | null;
  registroMedico?: string | null;
  especialidad?: Especialidad | null;
  pacientes?: IPaciente[] | null;
}

export class Especialista implements IEspecialista {
  constructor(
    public id?: number,
    public nombre?: string | null,
    public apellidos?: string | null,
    public rut?: string | null,
    public fechaNacimiento?: dayjs.Dayjs | null,
    public registroMedico?: string | null,
    public especialidad?: Especialidad | null,
    public pacientes?: IPaciente[] | null
  ) {}
}

export function getEspecialistaIdentifier(especialista: IEspecialista): number | undefined {
  return especialista.id;
}
