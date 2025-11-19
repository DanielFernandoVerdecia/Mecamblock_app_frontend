export class Produccion {
    id: number;
    producto: string;
    cantidad: number;
    fechaProduccion: string;
    fechaCreacion: string;
    fechaModificacion: string | null;


    constructor(producto: string, cantidad: number, fechaProduccion?: string) {
        this.id = Date.now();
        this.producto = producto;
        this.cantidad = cantidad;
        this.fechaProduccion = fechaProduccion || new Date().toISOString();
        this.fechaCreacion = new Date().toISOString();
        this.fechaModificacion = null;
    }
}