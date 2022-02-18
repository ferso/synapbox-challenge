import Symbols from 'src/symbols';
import {
  Controller,
  Delete,
  Get,
  Header,
  Patch,
  Post,
  Req,
  Put,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AddItemsService } from 'src/api-tree/application/services/add-item.service';
import { GetAllItemsService } from 'src/api-tree/application/services/get-all-item.service';
import { GetAllItemsResponseDto } from '../../../application/dtos/get-all-items-response.dto';
import { Request } from 'express';
import { AddItemRequest } from 'src/api-tree/application/requests/add-item.request';
import { DeleteItemRequest } from 'src/api-tree/application/requests/delete-item.request';
import { DeleteItemsService } from 'src/api-tree/application/services/delete-item.service';
import { RequestWithRawBody } from 'src/shared/infra/rawBody.middleware';
import { UpdateItemsService } from 'src/api-tree/application/services/update-item.service';
import { UpdateItemRequest } from 'src/api-tree/application/requests/update-item.request';

@Controller('tree')
export class TreeController {
  constructor(private moduleRef: ModuleRef) {}
  @Get()
  @Header('content-type', 'application/json')
  async root(): Promise<any> {
    const getAllItemsService = this.moduleRef.get<GetAllItemsService>(
      Symbols.GetAllItemsService,
    );
    return await getAllItemsService.execute();
  }
  @Post()
  @Header('content-type', 'application/json')
  async add(@Req() req: Request): Promise<any> {
    const addItemsService = this.moduleRef.get<AddItemsService>(
      Symbols.AddItemsService,
    );
    return await addItemsService.execute(
      new AddItemRequest({
        parent: req.body.parent,
        label: req.body.label,
      }),
    );
  }
  @Delete(':id')
  @Header('content-type', 'application/json')
  async delete(@Req() req: Request): Promise<any> {
    const deleteItemsService = this.moduleRef.get<DeleteItemsService>(
      Symbols.DeleteItemsService,
    );
    return await deleteItemsService.execute(
      new DeleteItemRequest({ id: req.params.id }),
    );
  }
  @Put(':id')
  @Header('content-type', 'application/json')
  async update(@Req() req: Request): Promise<any> {
    const updateItemsService = this.moduleRef.get<UpdateItemsService>(
      Symbols.UpdateItemsService,
    );
    return await updateItemsService.execute(
      new UpdateItemRequest({
        id: req.params.id,
        newParent: req.body['current-id'],
      }),
    );
  }
}
