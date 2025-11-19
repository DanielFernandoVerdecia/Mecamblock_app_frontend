export class StockItem {
    id: number;
    nombre: string;
    categoria?: string;
    cantidad: number;
    fechaCreacion: string;
    fechaModificacion: string | null;


    constructor(nombre: string, cantidad: number, categoria?: string){
        this.id = Date.now();
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.categoria = categoria || '';
        this.fechaCreacion = new Date().toISOString();
        this.fechaModificacion = null;
    }
}