import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { BoxesService } from './boxes.service';
import { AddBoxDto } from './dto/add-box.dto';

@Controller('boxes')
@UseGuards(AuthGuard())
export class BoxesController {
  constructor(private boxesService: BoxesService) {}

  @Get()
  async getBoxes(@GetUser() user: User): Promise<string[]> {
    return this.boxesService.getBoxes(user);
  }

  @Post()
  async addBox(
    @Body(ValidationPipe) addBoxDto: AddBoxDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boxesService.addBox(addBoxDto, user);
  }

  @Delete()
  async deleteBox(
    @Body(ValidationPipe) deleteBoxDto: AddBoxDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boxesService.deleteBox(deleteBoxDto, user);
  }
}
