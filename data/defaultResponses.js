const bloggerService = require('../services/bloggerService'); 

module.exports = {
  replies: [
    // --------------------- GREETINGS ---------------------
    { keywords: ["hello", "hi", "hey", "yo", "hiya"], reply: "Hello! How can I help you today? 😊" },
    { keywords: ["good morning"], reply: "Good morning! Hope your day starts amazing!" },
    { keywords: ["good afternoon"], reply: "Good afternoon! How’s your day going?" },
    { keywords: ["good evening"], reply: "Good evening! Need help with anything?" },

    // --------------------- SMALL TALK ---------------------
    { keywords: ["how are you"], reply: "I'm doing great, thanks for asking! How about you?" },
    { keywords: ["what's up", "sup"], reply: "All good here! What’s going on with you?" },
    { keywords: ["who are you", "your name"], reply: "I’m your friendly AI assistant!" },

    // --------------------- THANKS ---------------------
    { keywords: ["thank you", "thanks"], reply: "You're welcome! Happy to help! 😊" },
    { keywords: ["appreciate"], reply: "Aww, I appreciate you too!" },

    // --------------------- GOODBYES ---------------------
    { keywords: ["bye", "goodbye", "see you"], reply: "Goodbye! Take care! 👋" },

    // --------------------- BLOGGER SPECIFIC ---------------------
    { keywords: ["blog", "post", "article"], reply: "I can help you find blog posts or answer questions about Blogger!" },
    { keywords: ["image", "photo"], reply: "If the post contains images, I’ll pull them up for you!" },
    { keywords: ["pdf", "document", "word"], reply: "I can fetch PDFs and Word documents if they exist in the post." },
    { keywords: ["video", "youtube"], reply: "I can show YouTube or embedded videos from your blog posts." },
    { keywords: ["seo"], reply: "Improving your SEO starts with keywords, quality content, and clean structure." },

    // --------------------- TECH & AI ---------------------
    { keywords: ["ai", "artificial intelligence"], reply: "AI is the simulation of human intelligence in machines." },
    { keywords: ["machine learning"], reply: "Machine learning teaches computers to learn from data." },
    { keywords: ["deep learning"], reply: "Deep learning uses multi-layer neural networks to learn patterns." },
    { keywords: ["chatbot"], reply: "Chatbots simulate conversation using natural language models." },
    { keywords: ["coding", "programming"], reply: "Coding is fun! What language are you working on?" },
    { keywords: ["api"], reply: "APIs allow systems to communicate. Want help with one?" },

    // --------------------- SPORTS (MIXED STYLE) ---------------------
    { keywords: ["sports", "athletics"], reply: "Sports are a great way to stay active! What sport do you like?" },
    { keywords: ["basketball"], reply: "Basketball is fast-paced and exciting—who's your favorite player?" },
    { keywords: ["soccer", "football"], reply: "Soccer is the world’s most popular sport! ⚽" },
    { keywords: ["baseball"], reply: "Baseball is all about strategy, patience, and timing." },
    { keywords: ["boxing", "mma"], reply: "Combat sports require discipline, strength, and mental focus!" },

    // --------------------- HOBBIES ---------------------
    { keywords: ["hobby", "hobbies"], reply: "Hobbies help you relax and grow! What do you enjoy doing?" },
    { keywords: ["cooking"], reply: "Cooking is both art and science. What's your favorite dish?" },
    { keywords: ["music"], reply: "Music makes life better! What do you like listening to?" },
    { keywords: ["reading"], reply: "Reading expands the mind—fiction or nonfiction?" },
    { keywords: ["photography"], reply: "Photography is storytelling through images 📷" },

    // --------------------- TRAVEL ---------------------
    { keywords: ["travel", "traveling"], reply: "Travel opens your mind! What destination is on your bucket list?" },
    { keywords: ["flight", "vacation"], reply: "Planning a vacation? I can help suggest ideas!" },
    { keywords: ["beach"], reply: "Beaches are perfect for relaxing—sun, sand, and waves 🌊" },
    { keywords: ["hotel"], reply: "Looking for hotel tips? I can help you pick a good one." },

    // --------------------- COMICS / FUN ---------------------
    { keywords: ["comic", "comics"], reply: "Comics are awesome! Marvel or DC?" },
    { keywords: ["anime"], reply: "Anime has some of the best storytelling and art styles!" },
    { keywords: ["manga"], reply: "Manga fans unite! What are you reading lately?" },
    { keywords: ["superhero"], reply: "Superheroes teach us courage and creativity!" },

    // --------------------- LIFESTYLE ---------------------
    { keywords: ["lifestyle"], reply: "Lifestyle is all about habits that shape your well-being." },
    { keywords: ["fitness"], reply: "Fitness keeps your body and mind strong! 💪" },
    { keywords: ["health"], reply: "Staying healthy is a daily practice!" },
    { keywords: ["diet"], reply: "Balanced diets improve energy, mood, and longevity." },

    // --------------------- GAMES ---------------------
    { keywords: ["game", "gaming"], reply: "Gaming is fun! What do you play?" },
    { keywords: ["playstation", "ps5"], reply: "PlayStation has awesome exclusives. What’s your favorite?" },
    { keywords: ["xbox"], reply: "Xbox is great for Game Pass fans!" },
    { keywords: ["nintendo", "switch"], reply: "Nintendo brings nostalgia and fun! Mario? Zelda?" },
    { keywords: ["mobile game"], reply: "Mobile games are perfect for quick entertainment!" },

    // --------------------- BUSINESS ---------------------
    { keywords: ["business"], reply: "Business is about value, strategy, and innovation." },
    { keywords: ["startup"], reply: "Startups thrive on creativity, risk, and solving problems." },
    { keywords: ["marketing"], reply: "Marketing is storytelling that sells!" },
    { keywords: ["sales"], reply: "Sales is about understanding customer needs." },
    { keywords: ["finance"], reply: "Finance helps you manage money, risk, and investments." },

    // --------------------- POLITICS ---------------------
    { keywords: ["politics", "government"], reply: "Politics shapes our society through laws and decisions." },
    { keywords: ["election"], reply: "Elections give people a voice in leadership." },
    { keywords: ["policy"], reply: "Policies guide how governments solve problems." },

    // --------------------- FUN CASUAL ---------------------
    { keywords: ["riddle"], reply: "I love riddles! Ask me one 😄" },
    { keywords: ["puzzle"], reply: "Puzzles keep your mind sharp!" },
    { keywords: ["joke"], reply: "Why did the AI cross the road? To optimize the chicken’s path!" }
  ],


  // --------------------- MAIN HANDLER ---------------------
  getReply: async function (userMessage) {
    const msg = userMessage.toLowerCase();

    // 1️⃣ Check keyword matches
    for (const item of this.replies) {
      if (item.keywords.some(keyword => msg.includes(keyword))) {
        return item.reply;
      }
    }

  // 2️⃣ search Blogger posts/pages
    const blogReply = await bloggerService.searchAllContent(userMessage);
    if (blogReply) return blogReply;

    // 3️⃣ fallback
    return "Sorry, I couldn't find a relevant answer in my knowledge base or blog posts.";
  }
};
