import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-static'

const SPEC = {
  openapi: '3.0.0',
  info: {
    title: 'AuthiChain API',
    version: '2.5.0',
    description: 'Blockchain-powered product authentication and verification API. Supports AI classification, product registration, supply chain tracking, QR generation, and DSCSA/METRC compliance for cannabis and pharma verticals.',
    contact: { email: 'authichain@gmail.com', url: 'https://authichain.com' },
    termsOfService: 'https://authichain.com/terms',
    'x-logo': { url: 'https://authichain.com/logo.png' },
  },
  servers: [{ url: 'https://authichain.com', description: 'Production' }],
  security: [{ apiKey: [] }],
  components: {
    securitySchemes: {
      apiKey: { type: 'apiKey', in: 'header', name: 'X-RapidAPI-Key' },
    },
  },
  paths: {
    '/health': {
      get: {
        operationId: 'health',
        summary: 'API Health Check',
        description: 'Returns current API version and status.',
        responses: { '200': { description: 'Healthy response with version' } },
      },
    },
    '/api/v1/verify': {
      post: {
        operationId: 'verifyProduct',
        summary: 'Verify Product Authenticity',
        description: 'Verifies product authenticity using serial number or QR scan data. Returns blockchain record and trust score.',
        security: [{ apiKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['serial'],
                properties: {
                  serial: { type: 'string', example: 'AC-2026-001-CANNABIS', description: 'Serial number or QR scan string' },
                  product: { type: 'string', description: 'Optional product name for context' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Verification result with blockchain record and trust score' } },
      },
    },
    '/api/v1/classify': {
      post: {
        operationId: 'classifyProduct',
        summary: 'AI Product Classification',
        description: 'Classifies a product into AuthiChain industry verticals. Returns compliance requirements and authentication tier.',
        security: [{ apiKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'OG Kush Premium Flower' },
                  category: { type: 'string', example: 'cannabis' },
                  brand: { type: 'string', example: 'GreenLeaf Labs' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'AI classification with industry vertical and confidence score' } },
      },
    },
    '/api/v1/register': {
      post: {
        operationId: 'registerProduct',
        summary: 'Register Product on Blockchain',
        description: 'Registers a product on AuthiChain. Returns a unique AuthiChain ID and TrueMark QR payload for label printing.',
        security: [{ apiKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'category', 'brand', 'sku'],
                properties: {
                  name: { type: 'string' },
                  category: { type: 'string', enum: ['cannabis', 'pharma', 'luxury', 'electronics', 'food'] },
                  brand: { type: 'string' },
                  sku: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Product registered with blockchain ID and QR payload' } },
      },
    },
    '/api/v1/products': {
      get: {
        operationId: 'listProducts',
        summary: 'List Registered Products',
        description: 'Returns products registered under the authenticated account.',
        security: [{ apiKey: [] }],
        parameters: [{ name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by industry vertical' }],
        responses: { '200': { description: 'Array of registered products' } },
      },
    },
    '/api/v1/pricing': {
      get: {
        operationId: 'getPricing',
        summary: 'Get Subscription Tiers',
        description: 'Returns available plans: Free (10 calls/hr), Starter ($299/mo, 500/day), Pro ($799/mo, 5000/day).',
        responses: { '200': { description: 'Pricing tiers with feature details' } },
      },
    },
    '/api/v1/industries': {
      get: {
        operationId: 'getIndustries',
        summary: 'Supported Industry Verticals',
        description: 'Lists all verticals AuthiChain supports: cannabis, pharma, luxury, electronics, fashion, food, automotive, cosmetics, art, collectibles.',
        responses: { '200': { description: 'Industry verticals with compliance frameworks' } },
      },
    },
    '/api/v1/me': {
      get: {
        operationId: 'getAccount',
        summary: 'Get Account Info',
        description: 'Returns authenticated account details, current plan, and remaining credits.',
        security: [{ apiKey: [] }],
        responses: { '200': { description: 'Account details with plan and limits' } },
      },
    },
    '/api/v1/analytics': {
      get: {
        operationId: 'getAnalytics',
        summary: 'Verification Analytics',
        description: 'Returns scan counts, geographic distribution, and authentication success rates.',
        security: [{ apiKey: [] }],
        responses: { '200': { description: 'Analytics dashboard data' } },
      },
    },
    '/api/v1/qr/generate': {
      post: {
        operationId: 'generateQR',
        summary: 'Generate Authenticated QR Code',
        description: 'Generates an AI-artistic scannable QR code linked to AuthiChain verification. Powered by QRON.',
        security: [{ apiKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: { type: 'string', format: 'uri', example: 'https://myproduct.com/verify/123' },
                  style: { type: 'string', enum: ['space', 'cannabis', 'cyberpunk', 'nature', 'abstract', 'retro'], default: 'space' },
                  prompt: { type: 'string', description: 'Custom AI generation prompt' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Generated AI QR image URL and download link' } },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(SPEC, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
