/**
 * Inspirational quotes used decoratively in the Experience section backdrop
 * (`components/sections/ExperienceQuotes.tsx`).
 *
 * These are real, attributed quotes about hard work, success and career, drawn
 * from the owner-provided public quote collections (Wise Whisper Agency, Brian
 * Tracy, The Go Game, BOS, SNHU). They are short and from familiar personas.
 * Purely decorative ambient content — no Check Point / work / internal material
 * is involved, so no confidentiality review applies.
 */

export type Quote = {
  readonly text: string;
  readonly author: string;
};

export const inspirationalQuotes: readonly Quote[] = [
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Do or do not. There is no try.", author: "Yoda" },
  { text: "I never dreamed about success, I worked for it.", author: "Estée Lauder" },
  {
    text: "Choose a job you love, and you will never work a day in your life.",
    author: "Confucius",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "A person who never made a mistake never tried anything new.",
    author: "Albert Einstein",
  },
  { text: "Nothing is impossible. The word itself says “I'm possible!”", author: "Audrey Hepburn" },
  {
    text: "The best way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Talent wins games, but teamwork wins championships.", author: "Michael Jordan" },
  {
    text: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
  },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Well done is better than well said.", author: "Benjamin Franklin" },
  { text: "If you can dream it, you can do it.", author: "Walt Disney" },
  { text: "A goal is a dream with a deadline.", author: "Napoleon Hill" },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Every strike brings me closer to the next home run.", author: "Babe Ruth" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  {
    text: "The only place where success comes before work is in the dictionary.",
    author: "Vidal Sassoon",
  },
] as const;
