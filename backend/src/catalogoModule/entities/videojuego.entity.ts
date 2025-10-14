import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

//Esta wea es pa mapear la tabla y decirle que columnas tiene

//con el entity le decimos al typeorm qu esta es una clase especial que representa una tabla en la base de datos
@Entity('videojuegos') 
export class Videojuego {
  
  // Clave primaria que se auto-incrementa (SERIAL en PostgreSQL)
  @PrimaryGeneratedColumn()
  id: number;

  // Columna para el nombre del juego
  @Column()
  nombre: string;

  // Columna para la descripción, permitiendo que sea NULL
  @Column({ type: 'text', nullable: true })
  descripcion: string;
  
  // Columna para la ID externa de la API (IGDB)
  @Column('int')
  igdb_id: number; 

  // Columna para el precio (ejemplo de un tipo numérico con decimales)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;
}