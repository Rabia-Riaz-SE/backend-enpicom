import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DNA {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
  })
  DNA: string;
}
