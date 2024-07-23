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
