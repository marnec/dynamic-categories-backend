import { BaseEntity } from 'src/shared/entity/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ItemCategory } from './item-category.entity';

@Entity({ name: 'items' })
export class Item extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => ItemCategory, (category) => category.items)
  @JoinColumn({ name: 'category' })
  category: ItemCategory;
}
