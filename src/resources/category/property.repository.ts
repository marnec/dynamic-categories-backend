import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Property } from "./entities/property.entity";

@Injectable()
export class PropertyRepository extends Repository<Property> {}