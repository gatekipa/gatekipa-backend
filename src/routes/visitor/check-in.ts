import { ApiResponseDto } from "../../dto/api-response.dto";
import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth.middleware";
import { Visits } from "../../models/Visits";
import { sendEmail } from "../../services/mailer";
import { VISITOR_ARRIVED_EMAIL_TEMPLATE } from "../../services/email-templates";
import moment from "moment";

const router = express.Router();

interface Employee {
  emailAddress: string;
  mobileNo: string;
  firstName: string;
  lastName: string;
}

interface Visitor {
  firstName: string;
  lastName: string;
}

interface Visit {
  employee: Employee;
  visitor: Visitor;
  checkInTime: Date;
}

router.post(
  "/api/visits/checkin/:visitId",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { appUserId } = req?.user;
      const { visitId } = req.params;

      if (!visitId) {
        return res
          .status(400)
          .send(
            new ApiResponseDto(true, "Visit information is required", [], 400)
          );
      }

      const visit = (await Visits.find({ _id: visitId }).populate([
        {
          path: "employee",
          select: "emailAddress mobileNo firstName lastName",
        },
        {
          path: "visitor",
          select: "firstName lastName",
        },
      ])) as Visit[];

      if (!visit || visit.length === 0) {
        return res
          .status(404)
          .send(
            new ApiResponseDto(
              true,
              "No visit found by provided visit information",
              [],
              404
            )
          );
      }

      if (visit[0].checkInTime) {
        return res
          .status(400)
          .send(new ApiResponseDto(true, "Visit already checked in", [], 400));
      }

      const checkInTime = new Date();

      await Visits.findByIdAndUpdate(visitId, {
        checkInTime,
        updatedBy: appUserId,
      });

      const checkInTimeFormatted = moment(checkInTime).format(
        "ddd MMM DD YYYY HH:mm"
      );

      const { employee, visitor } = visit[0];

      const emailContent = VISITOR_ARRIVED_EMAIL_TEMPLATE.replace(
        "{{employeeFirstName}}",
        employee.firstName
      )
        .replace("{{employeeLastName}}", employee.lastName)
        .replace("{{visitorName}}", `${visitor.firstName} ${visitor.lastName}`)
        .replace("{{arrivalTime}}", checkInTimeFormatted);

      await sendEmail(
        employee?.emailAddress,
        "GateKipa - Your visitor has arrived",
        emailContent
      );

      return res
        .status(200)
        .send(
          new ApiResponseDto(false, "Visitor Checked In Successfully", [], 200)
        );
    } catch (error) {
      console.error("Error occurred during checkIn-visit", error);
      return res
        .status(500)
        .send(
          new ApiResponseDto(
            true,
            "Something wen't wrong while checking in visit",
            [],
            500
          )
        );
    }
  }
);

export { router as checkInVisitRouter };
