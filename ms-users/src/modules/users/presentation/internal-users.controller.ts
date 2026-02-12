import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CheckUserExistsUseCase } from '../application/use-cases/check-user-exists.use-case';
import { InternalJwtAuthGuard } from '../../../shared/auth/internal-jwt-auth.guard';

@Controller('internal/users')
@UseGuards(InternalJwtAuthGuard)
export class InternalUsersController {
  constructor(private readonly checkUserExistsUseCase: CheckUserExistsUseCase) {}

  @Get(':id/exists')
  exists(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.checkUserExistsUseCase.execute(id);
  }
}
