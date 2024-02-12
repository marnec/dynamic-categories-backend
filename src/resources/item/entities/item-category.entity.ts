import { BaseEntity } from 'src/shared/entity/BaseEntity';
import { Column, Entity, Index, OneToMany, Unique } from 'typeorm';
import { ItemProperty } from './item-property.entity';
import { Item } from './item.entity';

@Entity({ name: 'item-categories' })
export class ItemCategory extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @OneToMany(() => ItemProperty, (property) => property.itemCategory)
  properties: ItemProperty[];

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];

  // these two columns are currently not used but would 
  // be useful if the category backoffice allows edit/deletion
  @Column('uuid')
  templateCategory: string

  @Column()
  inSync: boolean
}
