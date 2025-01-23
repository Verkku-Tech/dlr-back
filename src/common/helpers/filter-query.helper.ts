import { Injectable } from '@nestjs/common'
import { isNotEmpty } from 'class-validator'
import { FilterQuery } from 'mongoose'

@Injectable()
export class queryBuilder {
  static loadFilters<T>(parameters: any): FilterQuery<T> {
    const filter: FilterQuery<T> = {}
    Object.entries(parameters).forEach(([key, value]) => {
      if (isNotEmpty(value)) {
        filter[key as keyof T] = {
          $regex: new RegExp(value as string, 'i'),
        } as FilterQuery<T>[keyof T]
      }
    })
    return filter
  }
}
