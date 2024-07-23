import { CompanyCounter } from "../models/CompanyCounter";
import { Employee } from "../models/Employee";

export async function generateEmployeeNo(
  companyId: string,
  employeeNo: string | undefined | null
) {
  // Check if employeeNo is provided and not undefined or null
  if (employeeNo !== undefined && employeeNo !== null) {
    // Check if the employeeNo already exists for the given company
    const existingEmployee = await Employee.findOne({
      employeeNo,
      companyId,
    });

    if (existingEmployee) {
      throw new Error(`Employee number ${employeeNo} is already occupied.`);
    }

    // If no existing employee is found, return the provided employeeNo
    return employeeNo;
  }

  // Generate a new employee number if none is provided
  const update = { $inc: { seq: 1 } };
  const options = { new: true, upsert: true };

  const counter = await CompanyCounter.findOneAndUpdate(
    { companyId },
    update,
    options
  );

  if (!counter) {
    throw new Error(`No counter found for companyId ${companyId}`);
  }

  const newEmployeeNo = counter.seq.toString();

  // Ensure the new employee number is unique (recursive call if necessary)
  const existingEmployee = await Employee.findOne({
    employeeNo: newEmployeeNo,
    companyId,
  });

  if (existingEmployee) {
    // If the new employee number is already taken, recursively call the function
    return generateEmployeeNo(companyId, undefined);
  }

  return newEmployeeNo;
}
