// Validation helper functions

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// URL validation
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// MongoDB ObjectId validation
const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

// Password strength validation
const isStrongPassword = (password) => {
  // At least 6 characters
  if (password.length < 6) return false;
  
  // Optional: Add more complex requirements
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumbers = /\d/.test(password);
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return true;
};

// Sanitize string (remove HTML tags and trim)
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim();
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    // Validate each field in schema
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      // Required validation
      if (rules.required && (!value || value.toString().trim() === '')) {
        errors.push({
          field,
          message: rules.requiredMessage || `${field} is required`,
        });
        continue;
      }

      // Skip other validations if field is not required and empty
      if (!value && !rules.required) continue;

      // Type validation
      if (rules.type) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rules.type) {
          errors.push({
            field,
            message: `${field} must be of type ${rules.type}`,
          });
          continue;
        }
      }

      // Email validation
      if (rules.email && !isValidEmail(value)) {
        errors.push({
          field,
          message: rules.emailMessage || 'Please provide a valid email address',
        });
      }

      // URL validation
      if (rules.url && value && !isValidUrl(value)) {
        errors.push({
          field,
          message: rules.urlMessage || `${field} must be a valid URL`,
        });
      }

      // Min length validation
      if (rules.minLength && value.length < rules.minLength) {
        errors.push({
          field,
          message: rules.minLengthMessage || `${field} must be at least ${rules.minLength} characters`,
        });
      }

      // Max length validation
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push({
          field,
          message: rules.maxLengthMessage || `${field} must not exceed ${rules.maxLength} characters`,
        });
      }

      // Min value validation (for numbers)
      if (rules.min !== undefined && value < rules.min) {
        errors.push({
          field,
          message: rules.minMessage || `${field} must be at least ${rules.min}`,
        });
      }

      // Max value validation (for numbers)
      if (rules.max !== undefined && value > rules.max) {
        errors.push({
          field,
          message: rules.maxMessage || `${field} must not exceed ${rules.max}`,
        });
      }

      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({
          field,
          message: rules.enumMessage || `${field} must be one of: ${rules.enum.join(', ')}`,
        });
      }

      // Array validation
      if (rules.array) {
        if (!Array.isArray(value)) {
          errors.push({
            field,
            message: `${field} must be an array`,
          });
        } else {
          // Array min length
          if (rules.arrayMinLength && value.length < rules.arrayMinLength) {
            errors.push({
              field,
              message: `${field} must contain at least ${rules.arrayMinLength} items`,
            });
          }

          // Array max length
          if (rules.arrayMaxLength && value.length > rules.arrayMaxLength) {
            errors.push({
              field,
              message: `${field} must not contain more than ${rules.arrayMaxLength} items`,
            });
          }
        }
      }

      // Custom validation function
      if (rules.custom && typeof rules.custom === 'function') {
        const customError = rules.custom(value, req.body);
        if (customError) {
          errors.push({
            field,
            message: customError,
          });
        }
      }

      // Pattern/Regex validation
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push({
          field,
          message: rules.patternMessage || `${field} format is invalid`,
        });
      }
    }

    // Return errors if any
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Sanitize strings if enabled
    if (schema._sanitize) {
      for (const field of Object.keys(req.body)) {
        if (typeof req.body[field] === 'string') {
          req.body[field] = sanitizeString(req.body[field]);
        }
      }
    }

    next();
  };
};

// Pre-defined validation schemas

// User registration validation
const validateRegistration = validate({
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    type: 'string',
    email: true,
  },
  password: {
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 100,
    custom: (value) => {
      if (!isStrongPassword(value)) {
        return 'Password must be at least 6 characters';
      }
    },
  },
  _sanitize: true,
});

// User login validation
const validateLogin = validate({
  email: {
    required: true,
    type: 'string',
    email: true,
  },
  password: {
    required: true,
    type: 'string',
  },
});

// Project validation
const validateProject = validate({
  title: {
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 100,
  },
  description: {
    required: true,
    type: 'string',
    minLength: 10,
    maxLength: 2000,
  },
  shortDescription: {
    required: true,
    type: 'string',
    minLength: 10,
    maxLength: 200,
  },
  image: {
    required: true,
    type: 'string',
  },
  technologies: {
    required: true,
    array: true,
    arrayMinLength: 1,
  },
  liveUrl: {
    type: 'string',
    url: true,
  },
  githubUrl: {
    type: 'string',
    url: true,
  },
  category: {
    type: 'string',
    enum: ['web', 'mobile', 'desktop', 'other'],
  },
  _sanitize: true,
});

// Skill validation
const validateSkill = validate({
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 50,
  },
  category: {
    required: true,
    type: 'string',
    enum: ['frontend', 'backend', 'database', 'tools', 'other'],
  },
  proficiency: {
    type: 'number',
    min: 0,
    max: 100,
  },
  _sanitize: true,
});

// Message/Contact validation
const validateMessage = validate({
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
  },
  email: {
    required: true,
    type: 'string',
    email: true,
  },
  subject: {
    required: true,
    type: 'string',
    minLength: 5,
    maxLength: 200,
  },
  message: {
    required: true,
    type: 'string',
    minLength: 10,
    maxLength: 2000,
  },
  _sanitize: true,
});

// Experience validation
const validateExperience = validate({
  company: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
  },
  position: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
  },
  description: {
    required: true,
    type: 'string',
    minLength: 10,
    maxLength: 2000,
  },
  startDate: {
    required: true,
    custom: (value) => {
      if (isNaN(Date.parse(value))) {
        return 'Invalid start date format';
      }
    },
  },
  endDate: {
    custom: (value, body) => {
      if (value && body.current) {
        return 'End date should not be provided if position is current';
      }
      if (value && isNaN(Date.parse(value))) {
        return 'Invalid end date format';
      }
      if (value && body.startDate && new Date(value) < new Date(body.startDate)) {
        return 'End date must be after start date';
      }
    },
  },
  _sanitize: true,
});

// Update password validation
const validatePasswordUpdate = validate({
  currentPassword: {
    required: true,
    type: 'string',
  },
  newPassword: {
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 100,
    custom: (value, body) => {
      if (value === body.currentPassword) {
        return 'New password must be different from current password';
      }
      if (!isStrongPassword(value)) {
        return 'Password must be at least 6 characters';
      }
    },
  },
});

// ObjectId validation middleware
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    next();
  };
};

// Export all validators
module.exports = {
  // Main validation function
  validate,

  // Pre-defined validators
  validateRegistration,
  validateLogin,
  validateProject,
  validateSkill,
  validateMessage,
  validateExperience,
  validatePasswordUpdate,
  validateObjectId,

  // Helper functions
  isValidEmail,
  isValidUrl,
  isValidObjectId,
  isStrongPassword,
  sanitizeString,
};