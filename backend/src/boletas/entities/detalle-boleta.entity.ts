import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Boleta } from './boleta.entity';
import { Videojuego } from '../../catalogo/entities/videojuego.entity';

@Entity('detalles_boleta')
export class DetalleBoleta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    boleta_id: number;

    @ManyToOne(() => Boleta, boleta => boleta.detalles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'boleta_id' })
    boleta: Boleta;

    @Column({ nullable: true, type: 'int' })
    videojuego_id: number | null;

    @ManyToOne(() => Videojuego, { eager: true, nullable: true })
    @JoinColumn({ name: 'videojuego_id' })
    videojuego: Videojuego;

    @Column()
    nombre_producto: string; // Guardar el nombre por si se elimina el juego

    @Column('decimal', { precision: 10, scale: 2 })
    precio_unitario: number;

    @Column({ default: 1 })
    cantidad: number;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;
}
