import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../../common/guards/auth.guard'
import { CategoriesService } from './categories.service'
import { AdminGuard } from '../../common/guards/admin.guard'
import { CreateCategoriesBulkDto } from './dto/create-categories-bulk.dto'

@ApiTags('categories')
@ApiBearerAuth()
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() input: CreateCategoryDto) {
    return await this.categoryService.create(input)
  }

  @Get()
  async findAll() {
    return await this.categoryService.find()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne({ _id: id })
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: UpdateCategoryDto) {
    const category = await this.categoryService.update(id, input)
    return category
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.categoryService.delete(id)
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Post('bulk')
  async createBulk(@Body() input: CreateCategoriesBulkDto) {
    return await this.categoryService.createBulk(input.categories)
  }
}
