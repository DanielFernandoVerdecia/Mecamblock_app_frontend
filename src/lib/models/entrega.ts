export class Entrega {
    id: number;
    cliente: string;
    documento?: string; // opcional: ruta/placeholder para foto o documento
    estado: 'pendiente' | 'entregado' | 'finalizado';
    fechaCreacion: string;
    fechaModificacion: string | null;


    constructor(cliente: string, documento?: string) {
        this.id = Date.now();
        this.cliente = cliente;
        this.documento = documento;
        this.estado = 'pendiente';
        this.fechaCreacion = new Date().toISOString();
        this.fechaModificacion = null;
    }
}