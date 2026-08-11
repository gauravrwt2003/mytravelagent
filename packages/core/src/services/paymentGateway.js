// Payment Gateway Integration Agent Service

export function processCreditCardPayment(cardData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cleanNum = (cardData.cardNumber || "").replace(/\s+/g, "");
      if (cleanNum.length < 13) {
        return reject({ success: false, error: "Invalid Credit Card number length." });
      }
      if (!cardData.expiryDate || !cardData.cvv) {
        return reject({ success: false, error: "Please enter Expiry Date and CVV." });
      }
      
      resolve({
        success: true,
        transactionId: `TXN_CARD_${Math.floor(100000 + Math.random() * 900000)}`,
        authCode: `AUTH_${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: "Credit Card",
        cardLast4: cleanNum.slice(-4),
        amount: cardData.amount,
        currency: cardData.currency || "USD",
        timestamp: new Date().toISOString()
      });
    }, 1200);
  });
}

export function processUPIPayment(upiData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const upiId = (upiData.upiId || "").trim();
      if (upiData.type === "vpa" && (!upiId || !upiId.includes("@"))) {
        return reject({ success: false, error: "Invalid UPI VPA handle. Example: user@upi or name@okicici." });
      }

      resolve({
        success: true,
        transactionId: `TXN_UPI_${Math.floor(100000 + Math.random() * 900000)}`,
        upiRef: `UPI_REF_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        paymentMethod: "UPI",
        vpa: upiId || "yatra_qr_scan@upi",
        amount: upiData.amount,
        currency: upiData.currency || "USD",
        timestamp: new Date().toISOString()
      });
    }, 1000);
  });
}
