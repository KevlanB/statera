import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            throw new Error('Chave secreta do Stripe não configurada. Verifique o arquivo .env.');
        }

        this.stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2025-02-24.acacia', // Use a versão mais recente
        });
    }

    async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
    }
    async createCheckout(body: any, successUrl: string, cancelUrl: string) {
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: body.lineItems,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
    }
}