import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Item } from "./entities/item.entity";

@Injectable()
export class ItemRepository extends Repository<Item> {}