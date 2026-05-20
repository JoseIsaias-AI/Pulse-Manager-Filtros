import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type StatusAluno = 'ativo' | 'inativo' | 'egresso' | 'desligado' | 'em_acompanhamento';
export type RiscoEvasao = 'baixo' | 'medio' | 'alto';

@Entity('aluno')
@Index(['programa'])
@Index(['categoria'])
@Index(['riscoEvasao'])
@Index(['status'])
export class Aluno {
  @PrimaryGeneratedColumn({ name: 'id_aluno' })
  idAluno!: number;

  @Column({ type: 'varchar', length: 150 })
  nome!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'integer', nullable: true })
  idade!: number | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  genero!: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  ocupacao!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  escolaridade!: string | null;

  @Column({ type: 'varchar', length: 120 })
  programa!: string;

  @Column({ type: 'varchar', length: 60 })
  categoria!: string;

  @Column({ name: 'risco_evasao', type: 'varchar', length: 20 })
  riscoEvasao!: RiscoEvasao;

  @Column({ type: 'integer', default: 0 })
  engajamento!: number;

  @Column({ name: 'data_ingresso', type: 'date' })
  dataIngresso!: string;

  @Column({ type: 'varchar', length: 30, default: 'ativo' })
  status!: StatusAluno;
}
