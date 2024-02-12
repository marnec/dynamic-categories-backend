import { BaseEntity } from 'src/shared/entity/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Property } from './property.entity';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Property, (property) => property.category)
  properties: Property[];
}
