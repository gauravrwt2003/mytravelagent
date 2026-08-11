// Omnichannel Multi-Channel Notification Service (RoamingBuddy & INR Currency)

export function dispatchBookingNotifications(booking) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pnr = booking.pnr;
      const passenger = booking.passenger;
      const transit = booking.transitOption;

      const smsContent = `[RoamingBuddy] Booking Confirmed! PNR: ${pnr}. Mode: ${transit.mode.toUpperCase()} (${transit.provider} - ${transit.code}). Dep: ${transit.departureTime}, ${transit.source} -> ${transit.destination}. Total: ₹${booking.amountPaid}.`;

      const whatsappContent = `🎉 *RoamingBuddy Booking Confirmation*

Hi ${passenger.fullName}, your travel booking is confirmed!

🎫 *PNR*: ${pnr}
✈️ *Route*: ${transit.source} ➔ ${transit.destination}
🚆 *Provider*: ${transit.provider} (${transit.code})
⏰ *Departure*: ${transit.departureTime} | Class: ${transit.classType}
💳 *Paid*: ₹${booking.amountPaid} via ${booking.paymentMethod.toUpperCase()}

📱 *Digital Boarding Pass*: https://roamingbuddy.app/pass/${pnr}
Need assistance? Reply to this WhatsApp message 24/7!`;

      const emailSubject = `✈️ Your Travel Confirmation & E-Ticket [PNR: ${pnr}]`;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; background:#0b0f19; color:#f3f4f6; padding:20px; border-radius:12px;">
          <h2 style="color:#ea2330;">RoamingBuddy E-Ticket Confirmation</h2>
          <p>Dear <strong>${passenger.fullName}</strong>,</p>
          <p>Thank you for booking with RoamingBuddy. Your reservation has been successfully processed.</p>
          <table style="width:100%; border-collapse:collapse; margin:20px 0; color:#fff;">
            <tr style="background:#1e293b;"><th style="padding:10px; text-align:left;">Booking PNR</th><td style="padding:10px; font-weight:bold; color:#38bdf8;">${pnr}</td></tr>
            <tr><th style="padding:10px; text-align:left;">Transit Mode</th><td style="padding:10px;">${transit.mode.toUpperCase()} (${transit.provider})</td></tr>
            <tr style="background:#1e293b;"><th style="padding:10px; text-align:left;">Route</th><td style="padding:10px;">${transit.source} &rarr; ${transit.destination}</td></tr>
            <tr><th style="padding:10px; text-align:left;">Departure</th><td style="padding:10px;">${transit.departureTime} hrs</td></tr>
            <tr style="background:#1e293b;"><th style="padding:10px; text-align:left;">Total Paid</th><td style="padding:10px; font-weight:bold; color:#10b981;">₹${booking.amountPaid}</td></tr>
          </table>
          <p>Safe Travels!</p>
        </div>
      `;

      resolve({
        sms: {
          status: "delivered",
          to: passenger.phone,
          timestamp: new Date().toLocaleTimeString(),
          message: smsContent
        },
        whatsapp: {
          status: "delivered",
          to: passenger.phone,
          timestamp: new Date().toLocaleTimeString(),
          message: whatsappContent
        },
        email: {
          status: "sent",
          to: passenger.email,
          subject: emailSubject,
          timestamp: new Date().toLocaleTimeString(),
          html: emailHtml
        }
      });
    }, 800);
  });
}
