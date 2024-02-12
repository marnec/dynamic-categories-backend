import { Metadata } from 'src/resources/item/entities/item-property.entity';
import { BaseEntity } from 'src/shared/entity/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Category } from './category.entity';

@Entity({ name: 'properties' })
@Unique(['category', 'name'])
export class Property extends BaseEntity {
  static readonly types = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    constrainedChoice: 'constrainedChoice',
    freeChoice: 'freeChoice'
  } as const;

  @Column()
  name: string;

  @Column()
  type: PropertyTypes;

  @ManyToOne(() => Category, (category) => category.properties)
  @JoinColumn({ name: 'category' })
  category: Category;

  @Column('jsonb')
  metadata: Omit<Metadata, 'value'>;
}
export type PropertyTypes = (typeof Property.types)[keyof typeof Property.types];
