export const storesDocs = {
  paths: {
    "/api/v1/admin/stores": {
      "post": {
        "summary": "Create a new store",
        "tags": ["Admin Store Management"],
        "security": [{ "cookieAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name", "email", "address"],
                "properties": {
                  "name": { "type": "string", "example": "Reliance Fresh" },
                  "email": { "type": "string", "format": "email", "example": "reliance@example.com" },
                  "address": { "type": "string", "example": "Mumbai" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Store created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "message": { "type": "string", "example": "Store created successfully" },
                    "data": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "string", "format": "uuid" },
                        "name": { "type": "string" },
                        "email": { "type": "string" },
                        "address": { "type": "string" },
                        "ownerId": { "type": "string", "nullable": true },
                        "createdBy": { "type": "string", "format": "uuid" },
                        "createdAt": { "type": "string" },
                        "updatedAt": { "type": "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": { "description": "Validation error or Email already exists" },
          "401": { "description": "Unauthorized" },
          "403": { "description": "Forbidden - Admins only" }
        }
      },
      "get": {
        "summary": "Retrieve and filter stores",
        "tags": ["Admin Store Management"],
        "security": [{ "cookieAuth": [] }],
        "parameters": [
          { "name": "search", "in": "query", "schema": { "type": "string" }, "description": "Search in name, email, or address" },
          { "name": "ownerAssigned", "in": "query", "schema": { "type": "string", "enum": ["true", "false"] }, "description": "Filter by owner assignment" },
          { "name": "ratingMin", "in": "query", "schema": { "type": "number", "minimum": 1, "maximum": 5 } },
          { "name": "ratingMax", "in": "query", "schema": { "type": "number", "minimum": 1, "maximum": 5 } },
          { "name": "createdAfter", "in": "query", "schema": { "type": "string", "format": "date-time" } },
          { "name": "createdBefore", "in": "query", "schema": { "type": "string", "format": "date-time" } },
          { "name": "sortBy", "in": "query", "schema": { "type": "string", "enum": ["name", "email", "createdAt", "averageRating"], "default": "createdAt" } },
          { "name": "order", "in": "query", "schema": { "type": "string", "enum": ["asc", "desc"], "default": "desc" } },
          { "name": "page", "in": "query", "schema": { "type": "integer", "default": 1 } },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 10 } }
        ],
        "responses": {
          "200": {
            "description": "Stores fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "message": { "type": "string", "example": "Stores fetched successfully" },
                    "data": {
                      "type": "object",
                      "properties": {
                        "stores": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "id": { "type": "string", "format": "uuid" },
                              "name": { "type": "string" },
                              "email": { "type": "string" },
                              "address": { "type": "string" },
                              "createdAt": { "type": "string" },
                              "averageRating": { "type": "number" },
                              "owner": {
                                "type": "object",
                                "nullable": true,
                                "properties": {
                                  "id": { "type": "string", "format": "uuid" },
                                  "name": { "type": "string" },
                                  "email": { "type": "string" }
                                }
                              }
                            }
                          }
                        },
                        "pagination": {
                          "type": "object",
                          "properties": {
                            "page": { "type": "integer" },
                            "limit": { "type": "integer" },
                            "total": { "type": "integer" },
                            "totalPages": { "type": "integer" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/admin/stores/{id}": {
      "get": {
        "summary": "Get store details by ID",
        "tags": ["Admin Store Management"],
        "security": [{ "cookieAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string", "format": "uuid" } }
        ],
        "responses": {
          "200": {
            "description": "Store details fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "message": { "type": "string" },
                    "data": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "string", "format": "uuid" },
                        "name": { "type": "string" },
                        "email": { "type": "string" },
                        "address": { "type": "string" },
                        "createdAt": { "type": "string" },
                        "updatedAt": { "type": "string" },
                        "createdBy": { "type": "string" },
                        "averageRating": { "type": "number" },
                        "totalRatings": { "type": "integer" },
                        "owner": { "type": "object", "nullable": true }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": { "description": "Store not found" }
        }
      },
      "patch": {
        "summary": "Update store details",
        "tags": ["Admin Store Management"],
        "security": [{ "cookieAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string", "format": "uuid" } }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "email": { "type": "string", "format": "email" },
                  "address": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Store updated successfully" },
          "404": { "description": "Store not found" }
        }
      },
      "delete": {
        "summary": "Delete store by ID",
        "tags": ["Admin Store Management"],
        "security": [{ "cookieAuth": [] }],
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string", "format": "uuid" } }
        ],
        "responses": {
          "200": { "description": "Store deleted successfully" },
          "404": { "description": "Store not found" }
        }
      }
    },
    "/api/v1/admin/stores/{storeId}/assign-owner": {
      "patch": {
        "summary": "Assign or replace store owner",
        "tags": ["Admin Store Management"],
        "security": [{ "cookieAuth": [] }],
        "parameters": [
          { "name": "storeId", "in": "path", "required": true, "schema": { "type": "string", "format": "uuid" } }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["ownerId"],
                "properties": {
                  "ownerId": { "type": "string", "format": "uuid", "example": "d3b07384-d113-4956-a5cc-9c60613271bc" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Store owner assigned successfully" },
          "400": { "description": "User is not a STORE_OWNER or validation error" },
          "404": { "description": "Store or User not found" }
        }
      }
    },
    "/api/v1/admin/stores/{storeId}/remove-owner": {
      "patch": {
        "summary": "Remove store owner from store",
        "tags": ["Admin Store Management"],
        "security": [{ "cookieAuth": [] }],
        "parameters": [
          { "name": "storeId", "in": "path", "required": true, "schema": { "type": "string", "format": "uuid" } }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["ownerId"],
                "properties": {
                  "ownerId": { "type": "string", "format": "uuid", "example": "d3b07384-d113-4956-a5cc-9c60613271bc" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Store owner removed successfully" },
          "400": { "description": "Owner not assigned to store or validation error" },
          "404": { "description": "Store not found" }
        }
      }
    },
    "/api/v1/admin/users": {
      "post": {
        "summary": "Admin creates a user (e.g. STORE_OWNER)",
        "tags": ["Admin User Management"],
        "security": [{ "cookieAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name", "email", "password", "role"],
                "properties": {
                  "name": { "type": "string", "example": "John Storeowner" },
                  "email": { "type": "string", "format": "email", "example": "owner@example.com" },
                  "password": { "type": "string", "example": "Password123!" },
                  "address": { "type": "string", "example": "Delhi" },
                  "role": { "type": "string", "enum": ["STORE_OWNER"], "example": "STORE_OWNER" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Store Owner created successfully" },
          "400": { "description": "Validation error or invalid role" }
        }
      }
    },
    "/api/v1/owner/stores/{storeId}/employees": {
      "post": {
        "summary": "Add an employee to the store",
        "tags": ["Owner Employee Management"],
        "security": [{ "cookieAuth": [] }],
        "parameters": [
          { "name": "storeId", "in": "path", "required": true, "schema": { "type": "string", "format": "uuid" } }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name", "email", "password"],
                "properties": {
                  "name": { "type": "string", "example": "Jane Doe" },
                  "email": { "type": "string", "format": "email", "example": "employee@example.com" },
                  "password": { "type": "string", "example": "SecurePass123!" },
                  "address": { "type": "string", "example": "Bangalore" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "Employee added successfully" },
          "400": { "description": "Validation error or Email already registered" },
          "403": { "description": "Forbidden - Store Owners only" },
          "404": { "description": "Store not found" }
        }
      }
    },
    "/api/v1/owner/stores/{storeId}/employees/{employeeId}": {
      "delete": {
        "summary": "Remove an employee from the store",
        "tags": ["Owner Employee Management"],
        "security": [{ "cookieAuth": [] }],
        "parameters": [
          { "name": "storeId", "in": "path", "required": true, "schema": { "type": "string", "format": "uuid" } },
          { "name": "employeeId", "in": "path", "required": true, "schema": { "type": "string", "format": "uuid" } }
        ],
        "responses": {
          "200": { "description": "Employee removed successfully" },
          "400": { "description": "Employee not found in store" },
          "403": { "description": "Forbidden - Store Owners only" },
          "404": { "description": "Store not found" }
        }
      }
    }
  }
};
