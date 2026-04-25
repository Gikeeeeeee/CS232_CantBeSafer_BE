const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'CantBeSafer API Documentation',
    version: '1.0.0',
    description: 'API endpoints for the CantBeSafer incident reporting system',
    contact: {
      name: 'CantBeSafer Team',
      url: 'https://github.com/Gikeeeeeee/CS232_CantBeSafer_BE'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server (Docker)'
    },
    {
      url: 'http://localhost:3000',
      description: 'Development server (Local)'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from login endpoint'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          user_id: { type: 'integer', description: 'Unique user identifier' },
          username: { type: 'string', description: 'Username' },
          email: { type: 'string', format: 'email', description: 'User email address' },
          role: { type: 'string', enum: ['user', 'admin', 'dev'], description: 'User role' },
          created_at: { type: 'string', format: 'date-time', description: 'Account creation timestamp' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['Username', 'Password'],
        properties: {
          Username: { type: 'string', example: 'john_doe' },
          Password: { type: 'string', format: 'password', example: 'securePassword123' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          AccessToken: { type: 'string', description: 'JWT token for authenticated requests' }
        }
      },
      SignupRequest: {
        type: 'object',
        required: ['Username', 'Password', 'Confirm_pass', 'Email'],
        properties: {
          Username: { type: 'string', example: 'john_doe' },
          Password: { type: 'string', format: 'password', example: 'securePassword123' },
          Confirm_pass: { type: 'string', format: 'password', example: 'securePassword123' },
          Email: { type: 'string', format: 'email', example: 'john@example.com' }
        }
      },
      SignupResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User created successfully' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'integer', description: 'New user ID' }
            }
          }
        }
      },
      Location: {
        type: 'object',
        required: ['latitude', 'longitude'],
        properties: {
          latitude: { type: 'number', format: 'double', example: 13.7563 },
          longitude: { type: 'number', format: 'double', example: 100.5018 }
        }
      },
      ReportRequest: {
        type: 'object',
        required: ['report_title', 'report_description', 'urgency_score', 'latitude', 'longitude'],
        properties: {
          report_title: { type: 'string', example: 'Traffic accident on Rama IV Road' },
          report_description: { type: 'string', example: 'Two vehicles collided causing traffic jam' },
          urgency_score: { type: 'integer', enum: [1, 2, 3], description: '1=Low, 2=Medium, 3=High', example: 2 },
          latitude: { type: 'number', format: 'double', example: 13.7563 },
          longitude: { type: 'number', format: 'double', example: 100.5018 },
          location_name: { type: 'string', description: 'Human-readable location name', example: 'Rama IV Road, Bangkok' },
          radius: { type: 'number', description: 'Alert radius in meters', example: 500 }
        }
      },
      Report: {
        type: 'object',
        properties: {
          report_id: { type: 'integer' },
          report_title: { type: 'string' },
          report_description: { type: 'string' },
          reported_by: { type: 'integer', description: 'User ID of reporter' },
          urgency_score: { type: 'integer', enum: [1, 2, 3] },
          report_status: { type: 'string', enum: ['reported', 'in_progress', 'resolved'] },
          latitude: { type: 'number', format: 'double' },
          longitude: { type: 'number', format: 'double' },
          location_name: { type: 'string' },
          radius: { type: 'number' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      Evidence: {
        type: 'object',
        properties: {
          evidence_id: { type: 'integer' },
          report_id: { type: 'integer' },
          file_url: { type: 'string', description: 'S3 or LocalStack file URL' },
          file_type: { type: 'string', example: 'image/jpeg' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      EvidenceUploadRequest: {
        type: 'object',
        required: ['file', 'report_id'],
        properties: {
          file: { type: 'string', format: 'binary', description: 'Image or video file' },
          report_id: { type: 'string', description: 'ID of the report to attach evidence to' },
          latitude: { type: 'string', description: 'Optional evidence location latitude' },
          longitude: { type: 'string', description: 'Optional evidence location longitude' }
        }
      },
      ActiveMapPoint: {
        type: 'object',
        properties: {
          report_id: { type: 'integer' },
          latitude: { type: 'number', format: 'double' },
          longitude: { type: 'number', format: 'double' },
          report_title: { type: 'string' },
          urgency_score: { type: 'integer', enum: [1, 2, 3] },
          status: { type: 'string', enum: ['reported', 'in_progress', 'resolved'] }
        }
      },
      UpdateStatusRequest: {
        type: 'object',
        required: ['status', 'urgency_score'],
        properties: {
          status: { type: 'string', enum: ['reported', 'in_progress', 'resolved'], example: 'in_progress' },
          urgency_score: { type: 'integer', enum: [1, 2, 3], example: 3 }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          details: { type: 'object' },
          debugInfo: { type: 'object', description: 'Only in development mode' }
        }
      },
      NotificationRequest: {
        type: 'object',
        required: ['email', 'message'],
        properties: {
          email: { type: 'string', format: 'email' },
          message: { type: 'string' },
          subject: { type: 'string', description: 'Optional email subject' },
          report_id: { type: 'integer', description: 'Optional report ID to link notification' }
        }
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' }
        }
      }
    }
  },
  paths: {
    '/': {
      get: {
        tags: ['Health Check'],
        summary: 'API health check',
        description: 'Returns a simple message to verify the API is running',
        responses: {
          '200': {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Niigaa' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        description: 'Authenticate user with username and password to receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          '400': {
            description: 'Invalid username or password',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Invalid username or password' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/signup': {
      post: {
        tags: ['Authentication'],
        summary: 'User registration',
        description: 'Create a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SignupRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SignupResponse' }
              }
            }
          },
          '400': {
            description: 'Invalid request or passwords do not match',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/reports/post': {
      post: {
        tags: ['Reports'],
        summary: 'Create incident report',
        description: 'Submit a new incident report with details and location',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReportRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Report created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    report_id: { type: 'integer' },
                    report_title: { type: 'string' },
                    report_description: { type: 'string' },
                    reported_by: { type: 'integer' },
                    urgency_score: { type: 'integer' },
                    report_status: { type: 'string' },
                    location: { $ref: '#/components/schemas/Location' },
                    radius: { type: 'number' },
                    location_name: { type: 'string' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Invalid request body',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '401': {
            description: 'Unauthorized - missing or invalid token'
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/reports/postevidence': {
      post: {
        tags: ['Reports'],
        summary: 'Upload evidence to report',
        description: 'Attach an image or video file as evidence to an existing report. Supports S3/LocalStack storage.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/EvidenceUploadRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Evidence uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    evidence_id: { type: 'integer' },
                    file_url: { type: 'string' },
                    report_id: { type: 'integer' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Invalid request or missing file/report_id',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '403': {
            description: 'Forbidden - you are not the owner of this report'
          },
          '404': {
            description: 'Report not found'
          },
          '500': {
            description: 'S3/Server upload error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/reports/incidents/{id}/status': {
      patch: {
        tags: ['Reports - Admin'],
        summary: 'Update incident status (Admin only)',
        description: 'Update the status and urgency score of an incident report. Requires admin role.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Report ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateStatusRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Status updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse'
                }
              }
            }
          },
          '400': {
            description: 'Invalid status or urgency_score value',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - missing or invalid token'
          },
          '403': {
            description: 'Forbidden - admin role required'
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/reports/active-map': {
      get: {
        tags: ['Reports - Public'],
        summary: 'Get active incident points (Public)',
        description: 'Retrieve all active incident locations and details. Public endpoint - no authentication required.',
        responses: {
          '200': {
            description: 'Active incidents retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    count: { type: 'integer' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ActiveMapPoint' }
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Spatial query error'
          }
        }
      }
    },
    '/api/reports/admin-active-map': {
      get: {
        tags: ['Reports - Admin'],
        summary: 'Get admin active map (Admin only)',
        description: 'Retrieve active incidents with admin-level details. Requires admin role.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Admin incidents retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    count: { type: 'integer' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ActiveMapPoint' }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - missing or invalid token'
          },
          '403': {
            description: 'Forbidden - admin role required'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/api/test/send-notification': {
      post: {
        tags: ['Testing - Admin'],
        summary: 'Send test notification (Admin only)',
        description: 'Send a test email notification. Useful for testing notification system. Admin only.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'message'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  message: { type: 'string', example: 'This is a test notification' },
                  subject: { type: 'string', example: 'Test Notification' },
                  report_id: { type: 'integer', description: 'Optional report ID' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Notification sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    notification: { type: 'object' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Missing required fields'
          },
          '403': {
            description: 'Forbidden - admin role required'
          },
          '404': {
            description: 'User not found'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    },
    '/api/test/subscribe-topic': {
      post: {
        tags: ['Testing - Admin'],
        summary: 'Subscribe user to SNS topic (Admin only)',
        description: 'Subscribe a user email to SNS topic for notifications. Admin only.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Subscription request sent',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    response: { type: 'object' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Missing email field'
          },
          '403': {
            description: 'Forbidden - admin role required'
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    }
  },
  tags: [
    { name: 'Health Check', description: 'API health endpoints' },
    { name: 'Authentication', description: 'Login and signup endpoints' },
    { name: 'Reports', description: 'Core report management endpoints' },
    { name: 'Reports - Admin', description: 'Admin-only report management' },
    { name: 'Reports - Public', description: 'Public report access endpoints' },
    { name: 'Testing - Admin', description: 'Testing and development endpoints (admin only)' }
  ]
};

export default swaggerSpec;
