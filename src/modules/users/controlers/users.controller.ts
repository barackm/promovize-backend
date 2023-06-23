import { Controller } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UsersRoutes } from 'src/routes/usersRoutes.enum';

@Controller(UsersRoutes.root)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
