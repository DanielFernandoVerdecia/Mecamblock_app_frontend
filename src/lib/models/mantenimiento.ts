export class Mantenimiento {
    id: number;
    equipo: string;
    observacion: string;
    fechaCreacion: string;
    fechaIntervencion?: string | null;
    responsable?: string | null;


    constructor(equipo: string, observacion: string){
        this.id = Date.now();
        this.equipo = equipo;
        this.observacion = observacion;
        this.fechaCreacion = new Date().toISOString();
        this.fechaIntervencion = null;
        this.responsable = null;
    }
}