import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuario') // Nombre exacto de la tabla en Neon
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  rol: string; // Aquí guardamos si es 'admin' o 'user'
}