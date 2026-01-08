const jwt = require('jsonwebtoken');

// Generate JWT Token
exports.generateToken = (id, options = {}) => {
  const payload = { id };
  
  const defaultOptions = {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  };
  
  const tokenOptions = { ...defaultOptions, ...options };
  
  return jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);
};

// Verify JWT Token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Decode JWT Token (without verification)
exports.decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

// Generate Refresh Token (longer expiration)
exports.generateRefreshToken = (id) => {
  return jwt.sign(
    { id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

// Verify Refresh Token
exports.verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Generate Access and Refresh Token Pair
exports.generateTokenPair = (id) => {
  const accessToken = this.generateToken(id);
  const refreshToken = this.generateRefreshToken(id);
  
  return {
    accessToken,
    refreshToken,
  };
};

// Generate Email Verification Token
exports.generateEmailToken = (email) => {
  return jwt.sign(
    { email, type: 'email_verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify Email Token
exports.verifyEmailToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'email_verification') {
      throw new Error('Invalid email verification token');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired email verification token');
  }
};

// Generate Password Reset Token
exports.generatePasswordResetToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email, type: 'password_reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Verify Password Reset Token
exports.verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      throw new Error('Invalid password reset token');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired password reset token');
  }
};

// Generate API Key Token (for external integrations)
exports.generateApiKey = (userId, permissions = []) => {
  return jwt.sign(
    { 
      id: userId, 
      type: 'api_key',
      permissions 
    },
    process.env.JWT_SECRET,
    { expiresIn: '365d' } // 1 year
  );
};

// Verify API Key
exports.verifyApiKey = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'api_key') {
      throw new Error('Invalid API key');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired API key');
  }
};

// Get token expiration time
exports.getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    // Return expiration as Date object
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

// Check if token is expired
exports.isTokenExpired = (token) => {
  try {
    const expiration = this.getTokenExpiration(token);
    
    if (!expiration) {
      return true;
    }
    
    return expiration < new Date();
  } catch (error) {
    return true;
  }
};

// Get time until token expires (in milliseconds)
exports.getTimeUntilExpiry = (token) => {
  try {
    const expiration = this.getTokenExpiration(token);
    
    if (!expiration) {
      return 0;
    }
    
    const now = new Date();
    const timeLeft = expiration - now;
    
    return timeLeft > 0 ? timeLeft : 0;
  } catch (error) {
    return 0;
  }
};

// Check if token needs refresh (less than 1 day remaining)
exports.needsRefresh = (token, thresholdMs = 24 * 60 * 60 * 1000) => {
  try {
    const timeLeft = this.getTimeUntilExpiry(token);
    return timeLeft < thresholdMs;
  } catch (error) {
    return true;
  }
};

// Extract user ID from token (without verification)
exports.extractUserId = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded ? decoded.id : null;
  } catch (error) {
    return null;
  }
};

// Generate token with custom claims
exports.generateCustomToken = (payload, expiresIn = '30d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Verify token and return full payload
exports.verifyAndDecode = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

// Refresh access token using refresh token
exports.refreshAccessToken = (refreshToken) => {
  try {
    const decoded = this.verifyRefreshToken(refreshToken);
    return this.generateToken(decoded.id);
  } catch (error) {
    throw new Error('Unable to refresh access token');
  }
};