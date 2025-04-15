const axios = require('axios');
const otpGenerator = require('otp-generator');

class KoraPayService {
  constructor() {
    this.secretKey = process.env.Korapay_Secret_Key;
    this.baseUrl = 'https://api.korapay.com/merchant/api/v1/charges';
  }

  /**
   * Generate a unique reference
   * @returns {string} A unique reference string
   */
  generateReference() {
    const otp = otpGenerator.generate(12, { specialChars: false });
    return `TCA-AF-${otp}`;
  }

  /**
   * Initialize payment with Kora
   * @param {Object} paymentDetails - Payment details
   * @param {string} paymentDetails.amount - Amount to be paid
   * @param {string} paymentDetails.name - Customer name
   * @param {string} paymentDetails.email - Customer email
   * @returns {Promise<Object>} Payment initialization response
   */
  async initializePayment({ amount, name, email }) {
    const reference = this.generateReference();
    
    const paymentData = {
      amount,
      customer: {
        name,
        email
      },
      currency: "NGN",
      reference
    };

    const response = await axios.post(`${this.baseUrl}/initialize`, paymentData, {
      headers: {
        Authorization: `Bearer ${this.secretKey}`
      }
    });

    return {
      reference,
      data: response.data.data
    };
  }

  /**
   * Verify payment with Kora
   * @param {string} reference - Payment reference
   * @returns {Promise<Object>} Payment verification response
   */
  async verifyPayment(reference) {
    const response = await axios.get(`${this.baseUrl}/${reference}`, {
      headers: {
        Authorization: `Bearer ${this.secretKey}`
      }
    });

    return response.data;
  }
}

module.exports = new KoraPayService();