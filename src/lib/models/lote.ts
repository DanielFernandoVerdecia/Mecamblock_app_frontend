export class Lote {
    id: number;
    producto: string;        
    cantidad: number;
    fechaCreacion: string;
    estado: 'producido' | 'en_espera' | 'rechazado' | 'aceptado';

    constructor(producto: string, cantidad: number) {
        this.id = Date.now();
        this.producto = producto;
        this.cantidad = cantidad;
        this.fechaCreacion = new Date().toISOString();
        this.estado = 'producido';
    }
}

