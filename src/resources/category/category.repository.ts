import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryRepository extends Repository<Category> {}