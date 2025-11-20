export class ProductionRecord {
    id: number;
    productoNombre: string;  // Relacionado con StockItem.nombre
    cantidad: number;
    fechaProduccion: string; // Fecha seleccionada por el usuario (YYYY-MM-DD)
    fechaRegistro: string;   // Timestamp automático
    fechaModificacion: string | null;

    constructor(productoNombre: string, cantidad: number, fechaProduccion: string) {
        this.id = Date.now();
        this.productoNombre = productoNombre;
        this.cantidad = cantidad;
        this.fechaProduccion = fechaProduccion;
        this.fechaRegistro = new Date().toISOString();
        this.fechaModificacion = null;
    }
}