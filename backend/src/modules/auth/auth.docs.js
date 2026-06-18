export const authDocs = {
  paths: {
    "/api/v1/auth/register": {
      "post": {
        "summary": "Register a new regular user",
        "tags": ["Authentication"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name", "email", "password"],
                "properties": {
                  "name": {
                    "type": "string",
                    "example": "Jane Doe",
                    "maxLength": 60
                  },
                  "email": {
                    "type": "string",
                    "format": "email",
                    "example": "jane@example.com"
                  },
                  "password": {
                    "type": "string",
                    "example": "Password123!",
                    "minLength": 8,
                    "maxLength": 16,
                    "description": "8-16 characters, 1 uppercase letter, 1 special character"
                  },
                  "address": {
                    "type": "string",
                    "example": "123 Main St, Springfield"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "User registered successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "message": { "type": "string", "example": "Registration successful" },
                    "data": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "string", "format": "uuid", "example": "d3b07384-d113-4956-a5cc-9c60613271bc" },
                        "name": { "type": "string", "example": "Jane Doe" },
                        "email": { "type": "string", "example": "jane@example.com" },
                        "address": { "type": "string", "example": "123 Main St, Springfield" },
                        "role": { "type": "string", "example": "USER" }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validation error or Email already exists"
          }
        }
      }
    },
    "/api/v1/auth/register-admin": {
      "post": {
        "summary": "Register a new administrator",
        "tags": ["Authentication"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name", "email", "password", "adminSecret"],
                "properties": {
                  "name": {
                    "type": "string",
                    "example": "Admin Name",
                    "maxLength": 60
                  },
                  "email": {
                    "type": "string",
                    "format": "email",
                    "example": "admin@example.com"
                  },
                  "password": {
                    "type": "string",
                    "example": "AdminPass1!",
                    "minLength": 8,
                    "maxLength": 16
                  },
                  "address": {
                    "type": "string",
                    "example": "Admin Headquarters"
                  },
                  "adminSecret": {
                    "type": "string",
                    "example": "super_secret_admin_registration_key"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Admin registered successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "message": { "type": "string", "example": "Admin registration successful" },
                    "data": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "string", "format": "uuid" },
                        "name": { "type": "string", "example": "Admin Name" },
                        "email": { "type": "string", "example": "admin@example.com" },
                        "role": { "type": "string", "example": "ADMIN" }
                      }
                    }
                  }
                }
              }
            }
          },
          "403": {
            "description": "Forbidden - Invalid admin secret key"
          },
          "400": {
            "description": "Validation error or Email already exists"
          }
        }
      }
    },
    "/api/v1/auth/login": {
      "post": {
        "summary": "Login and authenticate user",
        "tags": ["Authentication"],
        "description": "Authenticates user and returns user info. Sets access and refresh token cookies.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["email", "password"],
                "properties": {
                  "email": {
                    "type": "string",
                    "format": "email",
                    "example": "jane@example.com"
                  },
                  "password": {
                    "type": "string",
                    "example": "Password123!"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Login successful. Sets HttpOnly cookies: accessToken, refreshToken.",
            "headers": {
              "Set-Cookie": {
                "description": "Sets accessToken and refreshToken cookies",
                "schema": {
                  "type": "string",
                  "example": "accessToken=...; Path=/; HttpOnly; Secure; SameSite=Strict"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "message": { "type": "string", "example": "Login successful" },
                    "data": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "string", "format": "uuid" },
                        "name": { "type": "string", "example": "Jane Doe" },
                        "email": { "type": "string", "example": "jane@example.com" },
                        "role": { "type": "string", "example": "USER" }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Invalid credentials"
          }
        }
      }
    },
    "/api/v1/auth/refresh-token": {
      "post": {
        "summary": "Refresh Access Token using Rotate mechanism",
        "tags": ["Authentication"],
        "description": "Verifies refreshToken cookie, generates a new accessToken, rotates the refreshToken, and updates cookies/database.",
        "responses": {
          "200": {
            "description": "Token refreshed successfully. Cookies updated.",
            "headers": {
              "Set-Cookie": {
                "description": "Updates accessToken and refreshToken cookies",
                "schema": {
                  "type": "string"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "message": { "type": "string", "example": "Token refreshed successfully" },
                    "data": { "type": "object", "example": {} }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Invalid or missing refresh token"
          }
        }
      }
    },
    "/api/v1/auth/logout": {
      "post": {
        "summary": "Logout current user session",
        "tags": ["Authentication"],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "description": "Removes refresh token from database and clears both accessToken and refreshToken cookies.",
        "responses": {
          "200": {
            "description": "Logged out successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "message": { "type": "string", "example": "Logged out successfully" },
                    "data": { "type": "object", "example": {} }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Missing or invalid access token"
          }
        }
      }
    },
    "/api/v1/auth/change-password": {
      "post": {
        "summary": "Change password for authenticated user",
        "tags": ["Authentication"],
        "security": [
          {
            "cookieAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["oldPassword", "newPassword"],
                "properties": {
                  "oldPassword": {
                    "type": "string",
                    "example": "Password123!"
                  },
                  "newPassword": {
                    "type": "string",
                    "example": "NewPassword123!",
                    "minLength": 8,
                    "maxLength": 16,
                    "description": "8-16 characters, 1 uppercase, 1 special character"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Password updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "message": { "type": "string", "example": "Password updated successfully" },
                    "data": { "type": "object", "example": {} }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Incorrect old password or validation failure"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    }
  }
};
