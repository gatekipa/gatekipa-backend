import { Password } from "./password";

export function generateRandom6DigitNumber(): string {
  // Generate a random number between 100,000 and 999,999
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  // Convert the number to a string and return it
  return randomNumber.toString();
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
}

export function getDate15MinsFromNow(): Date {
  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + 15 * 60 * 1000);
  return futureDate;
}

export async function generateStrongPassword(length = 12) {
  // Define the character sets for letters, numbers, and symbols
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  // Combine all characters
  const allCharacters = lowercaseLetters + uppercaseLetters + numbers + symbols;

  // Ensure at least one character from each set is included
  const getRandomChar = (set: any) =>
    set[Math.floor(Math.random() * set.length)];

  // Start with one character from each character set
  let password = [
    getRandomChar(lowercaseLetters),
    getRandomChar(uppercaseLetters),
    getRandomChar(numbers),
    getRandomChar(symbols),
  ];

  // Fill the rest of the password length with random characters
  for (let i = password.length; i < length; i++) {
    password.push(getRandomChar(allCharacters));
  }

  // Shuffle the password array to ensure randomness
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  // Convert the array to a string and return
  const passwordString = password.join("");
  const hashedPassword = await Password.toHash(passwordString);
  return { hashedPassword, passwordString };
}
