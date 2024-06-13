export function generateRandom6DigitNumber() {
  // Generate a random number between 100,000 and 999,999
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  // Convert the number to a string and return it
  return randomNumber.toString();
}
