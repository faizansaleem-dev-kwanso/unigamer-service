import { OmitType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateReplyDto } from './create-reply.dto';

export class UpdateReplyDto extends OmitType(PartialType(CreateReplyDto), [
  'parent',
] as const) {}
