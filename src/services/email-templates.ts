export const VISITOR_ARRIVED_EMAIL_TEMPLATE = `<div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px; color: #333333;">GateKipa - Visitor Arrival</h1>
        </div>
        <div style="margin-bottom: 20px;">
            <p style="font-size: 16px; color: #555555;">Dear <strong>{{employeeFirstName}} {{employeeLastName}}</strong>,</p>
            <p style="font-size: 16px; color: #555555;">We are pleased to inform you that your visitor has arrived.</p>
            <p style="font-size: 16px; color: #555555;"><strong>Visitor Details:</strong></p>
            <ul style="list-style-type: none; padding: 0; font-size: 16px; color: #555555;">
                <li style="margin-bottom: 10px;"><strong>Name:</strong> {{visitorName}}</li>
                <li style="margin-bottom: 10px;"><strong>Time of Arrival:</strong> {{arrivalTime}}</li>
            </ul>
            <p style="font-size: 16px; color: #555555;">Please proceed to the reception area to meet your visitor.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #777777;">
            <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
    </div>`;

export const EMAIL_VERIFICATION_TEMPLATE = `<div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333; text-align: center;">GateKipa - Email Verification</h2>
        <p style="color: #666666; text-align: center;">Please use the verification code below to verify your email address.</p>
        
        <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #ffffff; font-size: 24px; letter-spacing: 4px; border-radius: 4px;">{{VERIFICATION_CODE}}</span>
        </div>

        <p style="color: #666666;">If you did not request this email, please ignore it. This verification code will expire in 60 minutes.</p>

        <p style="color: #666666; text-align: center; font-size: 12px;">&copy; ${new Date().getFullYear()} GateKipa. All rights reserved.</p>
    </div>`;

export const EMERGENCY_LIST_EMAIL = `<div style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f2f2f2; padding: 20px;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <tr>
                        <td align="center" style="background-color: #d32f2f; color: #ffffff; padding: 20px;">
                            <h1 style="margin: 0; font-size: 24px;">Emergency Evacuation Notice</h1>
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
                                        <a href="#" style="background-color: #d32f2f; color: #ffffff; text-decoration: none; padding: 10px 20px; font-size: 16px; border-radius: 4px; display: inline-block; margin-top: 10px;">View Emergency Procedures</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background-color: #f2f2f2; padding: 20px; color: #666666; font-size: 14px;">
                            <p style="margin: 0;">If you have any questions, please contact the building management at <a href="tel:{{companyMobileNo}}" style="color: #d32f2f;">{{companyMobileNo}}</a> or email <a href="mailto:{{companyEmail}}" style="color: #d32f2f;">{{companyEmail}}</a>.</p>
                            <p style="margin: 0;">{{companyName}} Team</p>
                        </td>
                    </tr>
                </table>
</div>`;

export const COMPANY_LOGIN_DETAIL_TEMPLATE = `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="background-color: #ffffff; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #333; text-align: center;">Welcome to GateKipa</h2>
        <p style="color: #555; line-height: 1.5;">
            Dear {{companyName}},
        </p>
        <p style="color: #555; line-height: 1.5;">
            Your credentials has been generated automatically for you to access GateKipa. Below are your login details:
        </p>
        <table style="width: 100%; margin-top: 20px;">
            <tr>
                <td style="color: #333; padding: 10px; background-color: #f9f9f9;">Email Address:</td>
                <td style="color: #333; padding: 10px; background-color: #f9f9f9;">{{companyEmail}}</td>
            </tr>
            <tr>
                <td style="color: #333; padding: 10px; background-color: #f1f1f1;">Password:</td>
                <td style="color: #333; padding: 10px; background-color: #f1f1f1;">{{password}}</td>
            </tr>
        </table>
        <p style="color: #555; line-height: 1.5; margin-top: 20px;">
            Please change your password upon first login for security purposes.
        </p>
        <p style="color: #555; line-height: 1.5;">
            You can log in using the following link:
        </p>
        <p style="text-align: center; margin-top: 20px;">
            <a href="{{loginURL}}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px;">Sign In GateKipa</a>
        </p>
        <p style="color: #555; line-height: 1.5; margin-top: 20px;">
            If you have any questions or need assistance, feel free to reach out to our support team.
        </p>
        <p style="color: #555; line-height: 1.5;">
            Best regards,<br>
            GateKipa Team
        </p>
    </div>
</div>`;
