export class Defecto {
    
    id: number;
    producto: string;
    descripcion: string;
    gravedad: 'baja'|'media'|'alta';
    fechaCreacion: string;
    fechaModificacion: string | null;
    estado: 'abierto'|'en_proceso'|'cerrado';

    constructor(producto: string, descripcion: string, gravedad: 'baja'|'media'|'alta'){
        this.id = Date.now();
        this.producto = producto;
        this.descripcion = descripcion;
        this.gravedad = gravedad;
        this.fechaCreacion = new Date().toISOString();
        this.fechaModificacion = null;
        this.estado = 'abierto';
    }

}