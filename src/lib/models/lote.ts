export class Lote {
    id: number;
    nombre: string;
    cantidad: number;
    fechaCreacion: string;
    estado: 'activo' | 'en_espera' | 'cerrado';

    constructor(nombre: string, cantidad: number) {
        this.id = Date.now();
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.fechaCreacion = new Date().toISOString();
        this.estado = 'activo';
    }
}
