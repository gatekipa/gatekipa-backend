import { CompanyCounter } from "../models/CompanyCounter";
import { Employee } from "../models/Employee";

export function generateRandom6DigitNumber() {
  // Generate a random number between 100,000 and 999,999
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  // Convert the number to a string and return it
  return randomNumber.toString();
}

async function generateEmployeeNo(companyId: string) {
  const update = { $inc: { seq: 1 } };
  const options = { new: true, upsert: true };

  const counter = await CompanyCounter.findOneAndUpdate(
    { companyId },
    update,
    options
  );

  if (!counter) {
    throw new Error(`No counter found for compnayId ${companyId}`);
  }

  const employeeNo = counter.seq;

  // Ensure the employee number is unique (though it should be by design)
  let existingEmployee = await Employee.findOne({ employeeNo });
  if (existingEmployee) {
    return generateEmployeeNo(companyId);
  }

  return employeeNo.toString();
}

export { generateEmployeeNo };
