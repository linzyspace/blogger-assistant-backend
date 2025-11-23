module.exports = [
  // Greetings
  { keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"], reply: "Hello! How can I help you today?" },
  { keywords: ["how are you", "how is it going", "how do you do"], reply: "I'm doing great, thanks for asking! How about you?" },
  
  // Help & support
  { keywords: ["help", "support", "assist", "assistance"], reply: "Sure! What do you need help with?" },
  { keywords: ["question", "problem", "issue"], reply: "Please tell me more about your problem so I can assist you better." },

  // Goodbyes
  { keywords: ["bye", "goodbye", "see you", "farewell"], reply: "Goodbye! Have a nice day!" },
  
  // Thanks / Appreciation
  { keywords: ["thank you", "thanks", "thank"], reply: "You're welcome! Happy to help." },
  { keywords: ["appreciate", "grateful"], reply: "I appreciate your kind words!" },
  
  // Small talk
  { keywords: ["what's up", "sup", "how's it going"], reply: "All good here! How about you?" },
  { keywords: ["name", "who are you"], reply: "I'm your friendly assistant, here to help you with Blogger and more!" },
  { keywords: ["time", "current time"], reply: `I can't tell the real time, but you can check your device clock!` },
  { keywords: ["date", "today's date"], reply: `I can't fetch the exact date, but your device calendar will have it!` },

  // Blogger / blog-related
  { keywords: ["blog", "post", "article"], reply: "I can help you find blog posts or answer questions about Blogger!" },
  { keywords: ["image", "photo", "picture"], reply: "I can show images if available in the post." },
  { keywords: ["pdf", "document", "word"], reply: "I can provide links to PDFs or Word documents if they exist." },

  // Default fallback
  { keywords: ["default"], reply: "I'm not sure about that. Can you try rephrasing your question?" }
];
