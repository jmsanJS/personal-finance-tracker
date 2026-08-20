import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: number;
  period: 'forever' | 'per month';
  description: string;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
}

interface Review {
  id: number;
  stars: string;
  quote: string;
  author: string;
  role?: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  features: Feature[] = [
    {
      icon: 'receipt_long',
      title: 'Track every transaction',
      description: 'Log income and expenses in seconds, organized your way.',
    },
    {
      icon: 'category',
      title: 'Custom categories',
      description: 'Group spending however makes sense to you, not a rigid template.',
    },
    {
      icon: 'insights',
      title: 'Visual dashboard',
      description: 'See where your money goes at a glance, in charts built for clarity.',
    },
    {
      icon: 'trending_up',
      title: 'Trends over time',
      description: 'Spot patterns across months, not just single snapshots.',
    },
  ];

  pricingTiers: PricingTier[] = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Everything you need to start tracking your money.',
      features: ['Unlimited transactions', 'Custom categories', 'Visual dashboard'],
      highlighted: false,
      ctaLabel: 'Get Started',
    },
    {
      name: 'Premium',
      price: 3.99,
      period: 'per month',
      description: 'For anyone who wants the full picture, over time.',
      features: [
        'Everything in Free Tier',
        'Monthly trend charts',
        'Unlimited categories',
        'Data export',
      ],
      highlighted: true,
      ctaLabel: 'Upgrade',
    },
    {
      name: 'Lifetime',
      price: 89.99,
      period: 'forever',
      description: 'Pay once, own it forever.',
      features: ['Everything in Premium', 'One-time payment', 'Free updates for life'],
      highlighted: false,
      ctaLabel: 'Get Lifetime Access',
    },
  ];

  reviews: Review[] = [
    {
      id: 1,
      stars: '★★★★★',
      quote:
        'I finally stopped guessing where my paycheck went. Categorizing expenses takes seconds, and the dashboard makes it obvious what to cut back on.',
      author: 'Marta S.',
      role: 'Freelance Designer',
    },
    {
      id: 2,
      stars: '★★★★★',
      quote:
        'Replaced three separate spreadsheets with this in one afternoon. The monthly trends view alone was worth switching for.',
      author: 'David K.',
      role: 'Small Business Owner',
    },
    {
      id: 3,
      stars: '★★★★☆',
      quote:
        "Simple enough that I actually stick with it, which is more than I can say for every budgeting app I've tried before.",
      author: 'Priya R.',
      role: 'Grad Student',
    },
  ];
}
