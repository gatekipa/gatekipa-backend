export const VISITOR_ARRIVED_EMAIL_TEMPLATE = `<div style="max-width: 600px; margin: 20px auto; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="background-color: #020617; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px; color: #ffffff; font-weight: 300;">GateKipa - Visitor Arrival</h1>
    </div>
    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 20px;">Dear <strong>{{employeeFirstName}} {{employeeLastName}}</strong>,</p>
        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 20px;">We are pleased to inform you that your visitor has arrived.</p>
        <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 18px; color: #ffffff; margin: 0 0 15px; font-weight: bold;">Visitor Details:</p>
            <ul style="list-style-type: none; padding: 0; margin: 0; font-size: 16px; color: #ffffff;">
                <li style="margin-bottom: 10px;"><strong style="color: #60a5fa;">Name:</strong> {{visitorName}}</li>
                <li style="margin-bottom: 10px;"><strong style="color: #60a5fa;">Time of Arrival:</strong> {{arrivalTime}}</li>
            </ul>
        </div>
        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 30px;">Please proceed to the reception area to meet your visitor.</p>
        <div style="text-align: center; font-size: 14px; color: #666666; border-top: 1px solid #dddddd; padding-top: 20px;">
            <p style="margin: 0;">This is an automated notification. Please do not reply to this email.</p>
        </div>
    </div>
</div>`;

export const EMAIL_VERIFICATION_TEMPLATE = `<div style="max-width: 600px; margin: 20px auto; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="background-color: #020617; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">GateKipa - Email Verification</h2>
    </div>
    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <p style="color: #333333; text-align: center; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Please use the verification code below to verify your email address.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 15px 30px; background-color: #0f172a; color: #ffffff; font-size: 28px; letter-spacing: 6px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">{{VERIFICATION_CODE}}</span>
        </div>

        <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
            If you did not request this email, please ignore it. This verification code will expire in 60 minutes.
        </p>

        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
            <p style="color: #888888; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} GateKipa. All rights reserved.
            </p>
        </div>
    </div>
</div>`;

export const EMERGENCY_LIST_EMAIL = `<div style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; background-color: #f4f4f4;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 20px;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center" style="background-color: #020617; color: #ffffff; padding: 30px;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Emergency Evacuation Notice</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0; margin-bottom: 20px; color: #333333; font-size: 18px;">Dear Visitors and Employees,</p>
                            <p style="margin: 0; margin-bottom: 20px; color: #333333;">This is an urgent message to inform you that there is an emergency evacuation in progress at our building. Please follow the instructions below for your safety:</p>
                            <ul style="padding-left: 20px; margin: 0; margin-bottom: 20px; color: #333333;">
                                <li style="margin-bottom: 10px;">Remain calm and proceed to the nearest exit.</li>
                                <li style="margin-bottom: 10px;">Follow the exit signs and do not use elevators.</li>
                                <li style="margin-bottom: 10px;">Assist those who may need help.</li>
                                <li style="margin-bottom: 10px;">Proceed to the designated assembly area outside the building.</li>
                            </ul>
                            <p style="margin: 0; margin-bottom: 20px; color: #333333;">Please wait for further instructions from emergency personnel at the assembly area.</p>
                            <p style="margin: 0; margin-bottom: 20px; color: #333333;">Thank you for your cooperation.</p>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="#" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 16px; border-radius: 4px; display: inline-block; margin-top: 10px; font-weight: bold;">View Emergency Procedures</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background-color: #0f172a; padding: 20px; color: #ffffff; font-size: 14px;">
                            <p style="margin: 0; margin-bottom: 10px;">If you have any questions, please contact the building management at <a href="tel:{{companyMobileNo}}" style="color: #60a5fa;">{{companyMobileNo}}</a> or email <a href="mailto:{{companyEmail}}" style="color: #60a5fa;">{{companyEmail}}</a>.</p>
                            <p style="margin: 0;">{{companyName}} Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>`;

export const COMPANY_LOGIN_DETAIL_TEMPLATE = `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px 0;">
    <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #020617; padding: 30px 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">Welcome to GateKipa</h2>
        </div>
        <div style="padding: 30px 20px;">
            <p style="color: #333333; line-height: 1.6; margin: 0 0 20px;">
                Dear {{companyName}},
            </p>
            <p style="color: #333333; line-height: 1.6; margin: 0 0 20px;">
                Your credentials have been generated automatically for you to access GateKipa. Below are your login details:
            </p>
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                <tr>
                    <td style="color: #ffffff; padding: 12px; background-color: #0f172a; font-weight: bold;">Email Address:</td>
                    <td style="color: #333333; padding: 12px; background-color: #f1f5f9;">{{companyEmail}}</td>
                </tr>
                <tr>
                    <td style="color: #ffffff; padding: 12px; background-color: #0f172a; font-weight: bold;">Password:</td>
                    <td style="color: #333333; padding: 12px; background-color: #f1f5f9;">{{password}}</td>
                </tr>
            </table>
            <p style="color: #333333; line-height: 1.6; margin: 0 0 20px;">
                Please change your password upon first login for security purposes.
            </p>
            <p style="color: #333333; line-height: 1.6; margin: 0 0 20px;">
                You can log in using the following link:
            </p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{loginURL}}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">Sign In to GateKipa</a>
            </p>
            <p style="color: #333333; line-height: 1.6; margin: 0 0 20px;">
                If you have any questions or need assistance, feel free to reach out to our support team.
            </p>
            <p style="color: #333333; line-height: 1.6; margin: 0;">
                Best regards,<br>
                GateKipa Team
            </p>
        </div>
    </div>
</div>`;

export const MULTIFACTOR_AUTH_CODE_EMAIL_TEMPLATE = `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px 0;">
    <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background-color: #020617; padding: 30px 20px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 300; letter-spacing: 1px;">Multi-Factor Authentication</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
                <p style="font-size: 16px; color: #333333; margin: 0 0 20px; line-height: 1.5;">Hi {{FIRST_NAME}},</p>
                <p style="font-size: 16px; color: #333333; margin: 0 0 30px; line-height: 1.5;">There has been a login attempt to your account. Please use the following code to complete the login process.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; background-color: #0f172a; padding: 15px 30px; font-size: 28px; font-weight: bold; color: #ffffff; border-radius: 6px; letter-spacing: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">{{MFA_CODE}}</span>
                </div>
                <p style="font-size: 14px; color: #666666; margin: 0 0 15px; line-height: 1.5;">If you did not request this code, you can safely ignore this email. However, we recommend changing your password immediately for security purposes.</p>
                <p style="font-size: 14px; color: #666666; margin: 0 0 30px; line-height: 1.5;">For your security, this code will expire in 15 minutes.</p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #0f172a; padding: 20px; text-align: center;">
                <p style="font-size: 14px; color: #a0aec0; margin: 0 0 10px;">If you have any questions, contact our support team at <a href="mailto:support@gatekipas.com" style="color: #60a5fa; text-decoration: none;">support@gatekipas.com</a></p>
                <p style="font-size: 12px; color: #a0aec0; margin: 0;">&copy; 2024 GateKipa. All rights reserved.</p>
            </td>
        </tr>
    </table>
</div>`;

export const DISCOUNT_EMAILS_TEMPLATE = `<div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 20px;">
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: #020617; padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 300;">GateKipa offers you a special discount!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 20px;">
              <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                Dear <strong style="color: #0f172a;">{{OWNER_NAME}}</strong>,
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                We are pleased to inform you that a special discount has been issued for your company <strong style="color: #0f172a;">{{COMPANY_NAME}}</strong>.
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                Use the code: <strong style="color: #0f172a; background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px;">{{DISCOUNT_CODE}}</strong> to avail <strong style="color: #0f172a;">{{DISCOUNT_TYPE_TEXT}}</strong> discount on your next invoice.
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                This discount is valid until <strong style="color: #0f172a;">{{EXPIRY_DATE}}</strong>, so don't miss out on this opportunity to save!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 20px 30px; text-align: center;">
              <a href="{{GATE_KIPA_URL}}" style="display: inline-block; color: #ffffff; background-color: #0f172a; padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; font-weight: bold;">Visit Our Website</a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px; text-align: center;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 10px;">
                If you have any questions or need assistance, feel free to contact us at <a href="mailto:{{GATE_KIPA_EMAIL}}" style="color: #0f172a; text-decoration: underline;">{{GATE_KIPA_EMAIL}}</a>.
              </p>
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                ©${new Date().getFullYear()} GateKipa, All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;
