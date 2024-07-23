import { Employee } from "../models/Employee";

async function generateEmployeeNo() {
  // * Generate a random number between 100,000 and 999,999
  let randomNumber = Math.floor(Math.random() * 900000) + 100000;

  let occupiedEmployeeNo = null;
  do {
    // * Check if the generated number is already in use
    occupiedEmployeeNo = await Employee.findOne({ employeeNo: randomNumber });
    if (occupiedEmployeeNo) {
      // * If it is, generate a new one
      randomNumber = Math.floor(Math.random() * 900000) + 100000;
    }
  } while (occupiedEmployeeNo != null);
  return randomNumber.toString();
}

export { generateEmployeeNo };
