import { Controller, Post, Body, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body('priceId') priceId: string,
    @Res() res,
  ) {
    try {
      const session = await this.stripeService.createCheckoutSession(
        priceId,
        'http://localhost:3000/checkout/sucesso', // URL de sucesso
        'http://localhost:3000/checkout/cancelado', // URL de cancelamento
      );

      res.status(303).redirect(session.url); // Redireciona para o checkout do Stripe
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('create-checkout')
async createCheckout(@Body() body: { lineItems: any[], id: number }, @Res() res) {
  try {
    const session = await this.stripeService.createCheckout(
      body,
      `http://localhost:3001/?id=${body.id}&status=success`, // URL de sucesso
      `http://localhost:3001/?id=${body.id}&status=canceled`, // URL de cancelamento
    );

    res.json({ url: session.url }); // Retorna a URL do checkout
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    res.status(500).json({ error: 'Erro ao processar o pagamento' });
  }
}
}