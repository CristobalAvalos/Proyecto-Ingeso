import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { DetalleBoleta } from './detalle-boleta.entity';
import { Usuario } from '../../usuarios/entities/usuarios.entity';

@Entity('boletas')
export class Boleta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    usuario_id: number;

    @ManyToOne(() => Usuario, { eager: true })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column({ default: 'pendiente' }) // pendiente, pagada, cancelada
    estado: string;

    @CreateDateColumn({ type: 'timestamp' })
    fecha_creacion: Date;

    @Column({ type: 'timestamp', nullable: true })
    fecha_pago: Date;

    @Column({ nullable: true })
    metodo_pago: string; // tarjeta, paypal, etc.

    @OneToMany(() => DetalleBoleta, detalle => detalle.boleta, { cascade: true, eager: true })
    detalles: DetalleBoleta[];
}
