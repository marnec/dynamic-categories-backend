import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ItemProperty } from "./entities/item-property.entity";

@Injectable()
export class ItemPropertyRepository extends Repository<ItemProperty> {}