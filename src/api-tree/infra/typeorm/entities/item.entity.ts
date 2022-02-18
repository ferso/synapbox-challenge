import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Index,
  ManyToOne,
  OneToMany,
  TreeChildren,
  TreeParent,
  TreeLevelColumn,
  Tree,
} from 'typeorm';

@Entity('entities')
export class ItemEntity {
  @PrimaryGeneratedColumn({})
  id?: number;

  @ManyToOne(() => ItemEntity, (parent) => parent.children, {
    nullable: true,
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: ItemEntity;

  @OneToMany(() => ItemEntity, (item) => item.parent, {
    nullable: true,
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  children?: ItemEntity[];

  @Column({ nullable: true })
  label?: string;
}
