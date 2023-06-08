import {
  Controller,
  Get,
  Render,
  Request,
  Response,
  Session,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../../guards/jwt.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @UseGuards(AuthGuard)
  @Get()
  @Render('dashboard')
  root(
    @Request() req,
    @Response() res,
    @Session() session: Record<string, any>,
  ) {
    if (req.session.roles != 1) {
      return res.redirect('/home');
    }
    return;
  }
}
