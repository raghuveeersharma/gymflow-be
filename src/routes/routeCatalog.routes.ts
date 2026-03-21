import { Router } from 'express';
import { ApiResponse } from '../shared/ApiResponse';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RouteCatalogItem {
  method: HttpMethod;
  path: string;
  authRequired: boolean;
  description: string;
  dummyRequest?: Record<string, unknown>;
  dummyResponse: Record<string, unknown>;
}

const routeCatalog: RouteCatalogItem[] = [
  {
    method: 'GET',
    path: '/api/v1/health',
    authRequired: false,
    description: 'Health check',
    dummyResponse: {
      success: true,
      message: 'Health check OK',
      data: {
        status: 'ok',
        service: 'gymflow-be',
        uptime: 123.45,
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    },
  },
  {
    method: 'POST',
    path: '/api/v1/auth/register',
    authRequired: false,
    description: 'Register user',
    dummyRequest: {
      name: 'Demo User',
      email: 'demo@gymflow.com',
      password: 'secret123',
      gymName: 'Demo Gym',
      phone: '9999999999',
    },
    dummyResponse: {
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          _id: '65f0c0b8f91d1f0a1b2c3d4e',
          name: 'Demo User',
          email: 'demo@gymflow.com',
          gymName: 'Demo Gym',
          phone: '9999999999',
        },
        token: 'jwt-token-here',
      },
    },
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    authRequired: false,
    description: 'Login user',
    dummyRequest: {
      email: 'demo@gymflow.com',
      password: 'secret123',
    },
    dummyResponse: {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: '65f0c0b8f91d1f0a1b2c3d4e',
          name: 'Demo User',
          email: 'demo@gymflow.com',
          gymName: 'Demo Gym',
          phone: '9999999999',
        },
        token: 'jwt-token-here',
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/auth/me',
    authRequired: true,
    description: 'Get current user profile',
    dummyResponse: {
      success: true,
      message: 'User retrieved',
      data: {
        _id: '65f0c0b8f91d1f0a1b2c3d4e',
        name: 'Demo User',
        email: 'demo@gymflow.com',
      },
    },
  },
  {
    method: 'POST',
    path: '/api/v1/auth/logout',
    authRequired: false,
    description: 'Logout user',
    dummyResponse: {
      success: true,
      message: 'Logged out successfully',
      data: null,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/members',
    authRequired: true,
    description: 'List members',
    dummyResponse: {
      success: true,
      message: 'Members retrieved',
      data: [
        {
          _id: '65f0c0b8f91d1f0a1b2c3d4f',
          name: 'Member One',
          phone: '8888888888',
          planId: {
            _id: '65f0c0b8f91d1f0a1b2c3d50',
            name: 'Monthly',
            duration: 30,
            price: 1000,
          },
          joinDate: '2026-01-01T00:00:00.000Z',
          expiryDate: '2026-01-31T00:00:00.000Z',
        },
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  },
  {
    method: 'POST',
    path: '/api/v1/members',
    authRequired: true,
    description: 'Create member',
    dummyRequest: {
      name: 'Member One',
      phone: '8888888888',
      planId: '65f0c0b8f91d1f0a1b2c3d50',
      joinDate: '2026-01-01',
    },
    dummyResponse: {
      success: true,
      message: 'Member created successfully',
      data: {
        _id: '65f0c0b8f91d1f0a1b2c3d4f',
        name: 'Member One',
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/members/:id',
    authRequired: true,
    description: 'Get member by id',
    dummyResponse: {
      success: true,
      message: 'Member retrieved',
      data: {
        _id: '65f0c0b8f91d1f0a1b2c3d4f',
        name: 'Member One',
      },
    },
  },
  {
    method: 'PUT',
    path: '/api/v1/members/:id',
    authRequired: true,
    description: 'Update member',
    dummyRequest: {
      name: 'Updated Member',
      phone: '8888888888',
      planId: '65f0c0b8f91d1f0a1b2c3d50',
    },
    dummyResponse: {
      success: true,
      message: 'Member updated',
      data: {
        _id: '65f0c0b8f91d1f0a1b2c3d4f',
        name: 'Updated Member',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/api/v1/members/:id',
    authRequired: true,
    description: 'Delete member',
    dummyResponse: {
      success: true,
      message: 'Member deleted',
      data: null,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/plans',
    authRequired: true,
    description: 'List plans',
    dummyResponse: {
      success: true,
      message: 'Plans retrieved',
      data: [
        {
          _id: '65f0c0b8f91d1f0a1b2c3d50',
          name: 'Monthly',
          duration: 30,
          price: 1000,
        },
      ],
    },
  },
  {
    method: 'POST',
    path: '/api/v1/plans',
    authRequired: true,
    description: 'Create plan',
    dummyRequest: {
      name: 'Monthly',
      duration: 30,
      price: 1000,
    },
    dummyResponse: {
      success: true,
      message: 'Plan created',
      data: {
        _id: '65f0c0b8f91d1f0a1b2c3d50',
        name: 'Monthly',
      },
    },
  },
  {
    method: 'PUT',
    path: '/api/v1/plans/:id',
    authRequired: true,
    description: 'Update plan',
    dummyRequest: {
      name: 'Quarterly',
      duration: 90,
      price: 2500,
    },
    dummyResponse: {
      success: true,
      message: 'Plan updated',
      data: {
        _id: '65f0c0b8f91d1f0a1b2c3d50',
        name: 'Quarterly',
      },
    },
  },
  {
    method: 'DELETE',
    path: '/api/v1/plans/:id',
    authRequired: true,
    description: 'Delete plan',
    dummyResponse: {
      success: true,
      message: 'Plan deleted',
      data: null,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/payments',
    authRequired: true,
    description: 'List payments',
    dummyResponse: {
      success: true,
      message: 'Payments retrieved',
      data: [
        {
          _id: '65f0c0b8f91d1f0a1b2c3d60',
          memberId: { _id: '65f0c0b8f91d1f0a1b2c3d4f', name: 'Member One', phone: '8888888888' },
          totalAmount: 1000,
          paidAmount: 600,
          dueAmount: 400,
          status: 'partial',
          paymentDate: '2026-01-01T00:00:00.000Z',
        },
      ],
      meta: {
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  },
  {
    method: 'POST',
    path: '/api/v1/payments',
    authRequired: true,
    description: 'Create payment',
    dummyRequest: {
      memberId: '65f0c0b8f91d1f0a1b2c3d4f',
      totalAmount: 1000,
      paidAmount: 600,
      paymentDate: '2026-01-01',
    },
    dummyResponse: {
      success: true,
      message: 'Payment recorded',
      data: {
        _id: '65f0c0b8f91d1f0a1b2c3d60',
        status: 'partial',
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/payments/member/:memberId',
    authRequired: true,
    description: 'Get payments by member',
    dummyResponse: {
      success: true,
      message: 'Member payments retrieved',
      data: [],
    },
  },
  {
    method: 'PUT',
    path: '/api/v1/payments/:id',
    authRequired: true,
    description: 'Update payment',
    dummyRequest: {
      paidAmount: 1000,
      status: 'paid',
    },
    dummyResponse: {
      success: true,
      message: 'Payment updated',
      data: {
        _id: '65f0c0b8f91d1f0a1b2c3d60',
        status: 'paid',
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/dashboard',
    authRequired: true,
    description: 'Dashboard summary',
    dummyResponse: {
      success: true,
      message: 'Dashboard data retrieved',
      data: {
        totalMembers: 100,
        activeMembers: 80,
        expiredMembers: 20,
        monthlyRevenue: 50000,
        expiringSoon: [],
        recentPayments: [],
      },
    },
  },
  {
    method: 'POST',
    path: '/api/v1/attendance',
    authRequired: true,
    description: 'Mark attendance',
    dummyRequest: {
      memberId: '65f0c0b8f91d1f0a1b2c3d4f',
      date: '2026-01-01',
      status: 'present',
    },
    dummyResponse: {
      success: true,
      message: 'Attendance marked',
      data: {
        _id: '65f0c0b8f91d1f0a1b2c3d70',
        memberId: '65f0c0b8f91d1f0a1b2c3d4f',
        status: 'present',
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/attendance',
    authRequired: true,
    description: 'Get attendance by date',
    dummyResponse: {
      success: true,
      message: 'Attendance retrieved',
      data: [],
    },
  },
  {
    method: 'GET',
    path: '/api/v1/attendance/member/:memberId',
    authRequired: true,
    description: 'Get attendance by member',
    dummyResponse: {
      success: true,
      message: 'Member attendance retrieved',
      data: [],
    },
  },
];

const router = Router();

router.get('/routes-preview', (_req, res) => {
  ApiResponse.success(
    res,
    {
      totalRoutes: routeCatalog.length,
      routes: routeCatalog,
      note: 'Dummy response bodies for quick contract checking.',
    },
    'Route catalog retrieved',
  );
});

export const routeCatalogRoutes = router;
