import { PartialType } from '@nestjs/mapped-types';
import { CreateManoDeObraDto } from './create-mano-de-obra.dto';

export class UpdateManoDeObraDto extends PartialType(CreateManoDeObraDto) {}
