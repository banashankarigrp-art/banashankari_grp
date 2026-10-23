import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Banashankari Enterprises REST API Suite', () => {
  it('GET /api/v1/health should return ok status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('Banashankari');
  });

  it('GET /api/v1/properties should return published properties with pagination', async () => {
    const res = await request(app).get('/api/v1/properties');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it('POST /api/v1/auth/register should validate required fields', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test User',
      email: 'invalid-email',
      phone: '123',
      password: 'short',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/register should successfully register a customer', async () => {
    const uniqueEmail = `user_${Date.now()}@test.com`;
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Kiran Kumar',
      email: uniqueEmail,
      phone: '+91 9900112233',
      password: 'Password@123',
      confirmPassword: 'Password@123',
      agreeToTerms: true,
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('customer'); // Verify role is customer
    expect(res.body.user.email).toBe(uniqueEmail);
  });

  it('GET /api/v1/admin/analytics should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/v1/admin/analytics');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/enquiries should accept valid customer enquiry', async () => {
    const res = await request(app).post('/api/v1/enquiries').send({
      category: 'general',
      customerName: 'Sanjay Gowda',
      email: 'sanjay.gowda@example.com',
      phone: '+91 9845112233',
      details: {
        message: 'Looking for advice on plots in Banashankari.',
      },
      consent: true,
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.referenceId).toMatch(/^BSE-ENQ-/);
  });
});
