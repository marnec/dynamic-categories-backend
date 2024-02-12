import { PropertyTypes } from 'src/resources/category/entities/property.entity';
import { BaseEntity } from 'src/shared/entity/BaseEntity';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { ItemCategory } from './item-category.entity';

export type Metadata = {
  type: PropertyTypes;
  value: string | number | boolean;
  max?: number;
  min?: number;
  choices?: string[]
};

@Entity({ name: 'item-properties' })
@Unique(['itemCategory', 'name'])
export class ItemProperty extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @Column()
  type: PropertyTypes;

  @Column('jsonb')
  metadata: Metadata;

  @ManyToOne(() => ItemCategory, (category) => category.properties)
  @JoinColumn({ name: 'item-category' })
  itemCategory: ItemCategory;
}
