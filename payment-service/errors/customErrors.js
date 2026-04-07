class PaymentError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'PaymentError';
  }
}

class PaymentNotFoundError extends PaymentError {
  constructor(message = 'Payment not found') {
    super(message, 404);
    this.name = 'PaymentNotFoundError';
  }
}

class InvalidPaymentError extends PaymentError {
  constructor(message = 'Invalid payment details') {
    super(message, 400);
    this.name = 'InvalidPaymentError';
  }
}

class StripeError extends PaymentError {
  constructor(message = 'Stripe operation failed') {
    super(message, 402);
    this.name = 'StripeError';
  }
}

class UnauthorizedError extends PaymentError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

class RefundError extends PaymentError {
  constructor(message = 'Refund operation failed') {
    super(message, 400);
    this.name = 'RefundError';
  }
}

export {
  PaymentError,
  PaymentNotFoundError,
  InvalidPaymentError,
  StripeError,
  UnauthorizedError,
  RefundError,
};
