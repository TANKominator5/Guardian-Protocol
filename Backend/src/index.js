import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from 'url';
import path from 'path';

// Import routes
import entityRoutes from "./routes/entityRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Initialize environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS with options
app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log the request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, {
    query: req.query,
    params: req.params,
    body: req.body ? JSON.stringify(req.body).substring(0, 200) + '...' : 'No body'
  });

  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "connect-src 'self' http://localhost:5000 ws://localhost:5000",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'"
  ];
  
  if (process.env.NODE_ENV === 'development') {
    csp.push("connect-src 'self' http://localhost:* ws://localhost:*");
  }
  
  res.setHeader('Content-Security-Policy', csp.join('; '));
  
  // Log response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use("/api/entities", entityRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/analytics", analyticsRoutes);

// API Documentation
const apiDocumentation = {
  name: "Guardian Protocol API",
  version: "1.0.0",
  status: "running",
  baseUrl: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
  endpoints: {
    entities: {
      list: {
        method: "GET",
        path: "/api/entities",
        description: "Search entities by name or other fields",
        queryParams: [
          { name: "query", type: "string", required: false, description: "Search term" },
          { name: "status", type: "string", required: false, description: "Filter by status (ACTIVE, MISSING, AT_RISK, INACTIVE)" },
          { name: "limit", type: "number", required: false, description: "Number of results to return (default: 50)" },
          { name: "offset", type: "number", required: false, description: "Pagination offset (default: 0)" }
        ]
      },
      get: {
        method: "GET",
        path: "/api/entities/:id",
        description: "Get a single entity by ID",
        urlParams: [
          { name: "id", type: "UUID", required: true, description: "Entity's unique identifier" }
        ]
      },
      updateStatus: {
        method: "PUT",
        path: "/api/entities/:id/status",
        description: "Update an entity's status",
        urlParams: [
          { name: "id", type: "UUID", required: true, description: "Entity's unique identifier" }
        ],
        body: {
          status: {
            type: "string",
            required: true,
            enum: ["ACTIVE", "MISSING", "AT_RISK", "INACTIVE"],
            description: "New status for the entity"
          }
        }
      }
    },
    events: {
      create: {
        method: "POST",
        path: "/api/events",
        description: "Log a new event",
        body: {
          entity_id: { type: "UUID", required: true, description: "ID of the entity this event is for" },
          event_type: { type: "string", required: true, description: "Type of event (e.g., SWIPE_ENTRY, WIFI_CONNECT)" },
          source: { type: "string", required: true, description: "Source of the event (e.g., MAIN_GATE, SECURITY_SYSTEM)" },
          location_id: { type: "UUID", required: false, description: "ID of the location where the event occurred" },
          details: { type: "object", required: false, description: "Additional event details" }
        }
      },
      getTimeline: {
        method: "GET",
        path: "/api/events/:entity_id/timeline",
        description: "Get timeline of events for an entity",
        urlParams: [
          { name: "entity_id", type: "UUID", required: true, description: "Entity's unique identifier" }
        ],
        queryParams: [
          { name: "limit", type: "number", required: false, description: "Number of events to return (default: 50)" },
          { name: "offset", type: "number", required: false, description: "Pagination offset (default: 0)" },
          { name: "start_time", type: "ISO timestamp", required: false, description: "Filter events after this time" },
          { name: "end_time", type: "ISO timestamp", required: false, description: "Filter events before this time" }
        ]
      }
    },
    analytics: {
      getScores: {
        method: "GET",
        path: "/api/analytics/scores/:entity_id",
        description: "Get confidence scores for an entity",
        urlParams: [
          { name: "entity_id", type: "UUID", required: true, description: "Entity's unique identifier" }
        ]
      },
      getActivity: {
        method: "GET",
        path: "/api/analytics/activity",
        description: "Get location activity data",
        queryParams: [
          { name: "location_id", type: "UUID", required: false, description: "Filter by location" },
          { name: "start_time", type: "ISO timestamp", required: false, description: "Filter events after this time" },
          { name: "end_time", type: "ISO timestamp", required: false, description: "Filter events before this time" },
          { name: "limit", type: "number", required: false, description: "Number of results to return (default: 100)" }
        ]
      },
      getDailyReport: {
        method: "GET",
        path: "/api/analytics/daily",
        description: "Generate a daily report",
        queryParams: [
          { name: "date", type: "YYYY-MM-DD", required: false, description: "Date for the report (default: today)" }
        ]
      }
    },
    system: {
      health: {
        method: "GET",
        path: "/health",
        description: "Health check endpoint"
      }
    }
  },
  examples: {
    searchEntities: `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/entities?query=John&status=ACTIVE&limit=10`,
    getEntity: `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/entities/123e4567-e89b-12d3-a456-426614174000`,
    getTimeline: `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/events/123e4567-e89b-12d3-a456-426614174000/timeline?limit=5`
  }
};

// Root endpoint - API documentation
app.get("/", (req, res) => {
  res.json({
    ...apiDocumentation,
    documentation: {
      openapi: "3.0.0",
      info: {
        title: "Guardian Protocol API",
        version: "1.0.0",
        description: "API for managing and tracking entities, events, and analytics"
      },
      servers: [
        {
          url: apiDocumentation.baseUrl,
          description: "Current server"
        }
      ]
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 404,
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Base URL: http://localhost:${PORT}/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
