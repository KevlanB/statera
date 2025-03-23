import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('checkout')
export class CheckoutController {
  @Get('sucesso')
  sucesso(@Res() res: Response) {
    res.send('Pagamento realizado com sucesso!');
  }

  @Get('cancelado')
  cancelado(@Res() res: Response) {
    res.send('Pagamento cancelado.');
  }
}