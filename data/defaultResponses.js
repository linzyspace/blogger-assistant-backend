module.exports = {
  replies: [
    // Greetings
    { keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"], reply: "Hello! How can I help you today?" },
    { keywords: ["how are you", "how's it going", "how do you do"], reply: "I'm doing great, thanks for asking! How about you?" },
    { keywords: ["what's up", "sup"], reply: "All good here! How about you?" },

    // Small talk
    { keywords: ["name", "who are you"], reply: "I'm your friendly assistant, here to help you with Blogger and more!" },
    { keywords: ["joke", "funny"], reply: "Why did the developer go broke? Because he used up all his cache!" },
    { keywords: ["weather", "forecast"], reply: "I can't fetch live weather, but you can check your local weather app!" },
    { keywords: ["time", "current time"], reply: "I can't tell the real time, but you can check your device clock!" },
    { keywords: ["date", "today's date"], reply: "I can't fetch the exact date, but your device calendar will have it!" },

    // Thanks / Appreciation
    { keywords: ["thank you", "thanks", "thank"], reply: "You're welcome! Happy to help." },
    { keywords: ["appreciate", "grateful"], reply: "I appreciate your kind words!" },

    // Goodbyes
    { keywords: ["bye", "goodbye", "see you", "farewell"], reply: "Goodbye! Have a nice day!" },
    { keywords: ["see ya", "catch you later"], reply: "See you later! Take care!" },

    // Help & support
    { keywords: ["help", "support", "assist", "assistance"], reply: "Sure! What do you need help with?" },
    { keywords: ["question", "problem", "issue"], reply: "Please tell me more about your problem so I can assist you better." },
    { keywords: ["how to", "guide", "tutorial"], reply: "I can provide step-by-step guidance. What specifically do you need help with?" },
    { keywords: ["error", "bug", "issue"], reply: "Can you describe the error message or issue in detail?" },

    // Blogger / blog-specific
    { keywords: ["blog", "post", "article"], reply: "I can help you find blog posts or answer questions about Blogger!" },
    { keywords: ["image", "photo", "picture"], reply: "I can show images if available in the post." },
    { keywords: ["pdf", "document", "word"], reply: "I can provide links to PDFs or Word documents if they exist." },
    { keywords: ["video", "youtube"], reply: "I can link videos if available in the blog post." },
    { keywords: ["link", "url"], reply: "I can provide clickable links to posts, documents, or resources." },
    { keywords: ["comments", "feedback"], reply: "I can tell you how to manage comments or reply to readers." },
    { keywords: ["template", "theme"], reply: "I can help you choose or customize Blogger templates." },
    { keywords: ["analytics", "traffic"], reply: "I can explain how to check your blog traffic or analytics." },
    { keywords: ["seo", "search engine optimization"], reply: "I can give tips for improving your blog's SEO." },

    // Programming / tech
    { keywords: ["code", "programming", "javascript", "python"], reply: "I can assist with coding questions or provide examples." },
    { keywords: ["api", "endpoint", "request"], reply: "I can guide you on using APIs or sending HTTP requests." },
    { keywords: ["database", "sql", "mongodb"], reply: "I can explain database queries or help debug your database." },
    { keywords: ["server", "backend", "node"], reply: "I can help with backend setup, Node.js, or server issues." },
    { keywords: ["frontend", "html", "css", "react"], reply: "I can assist with frontend development or styling." },
    
    // Artificial Intelligence
    { keywords: ["ai", "artificial intelligence"], reply: "Artificial Intelligence (AI) is the simulation of human intelligence processes by machines." },
    { keywords: ["machine learning", "ml"], reply: "Machine Learning (ML) is a subset of AI that enables systems to learn from data and improve over time." },
    { keywords: ["deep learning", "neural network"], reply: "Deep Learning uses neural networks with multiple layers to model complex patterns in data." },
    { keywords: ["nlp", "natural language processing"], reply: "NLP enables machines to understand, interpret, and respond to human language." },
    { keywords: ["llm", "large language model"], reply: "LLMs are AI models trained on vast amounts of text to generate human-like responses." },
    { keywords: ["chatbot"], reply: "A chatbot is a program designed to simulate conversation with human users, often using AI." },
    { keywords: ["reinforcement learning", "rl"], reply: "Reinforcement Learning is an ML approach where agents learn by trial and error to maximize rewards." },
    { keywords: ["computer vision", "cv"], reply: "Computer Vision is a field of AI that enables machines to interpret and understand visual information." },
    { keywords: ["supervised learning"], reply: "Supervised learning uses labeled data to train models to predict outputs from inputs." },
    { keywords: ["unsupervised learning"], reply: "Unsupervised learning finds patterns or structures in data without labeled outputs." },
    { keywords: ["ai ethics", "ethics in ai"], reply: "AI ethics deals with moral issues, fairness, transparency, and accountability in AI systems." },
    { keywords: ["model training", "training ai"], reply: "Model training involves feeding data to an AI model and adjusting parameters to improve performance." },
    { keywords: ["predictive analytics"], reply: "Predictive analytics uses historical data and AI models to predict future outcomes." },
    { keywords: ["data science"], reply: "Data Science involves extracting insights and knowledge from data using statistics, AI, and ML techniques." },
    { keywords: ["automation"], reply: "AI-driven automation uses machines or software to perform tasks with minimal human intervention." },

    // Fun / casual
    { keywords: ["riddle", "puzzle"], reply: "I love riddles! Ask me one and I’ll try to solve it." },
    { keywords: ["game", "play"], reply: "I can suggest games or small interactive activities." },
    { keywords: ["quote", "motivation"], reply: "Here's a quote: 'The best way to predict the future is to create it.' – Peter Drucker" }
  ],

  // Function to get reply or fallback to Google
  getReply: function(userMessage) {
    const msg = userMessage.toLowerCase();

    for (const item of this.replies) {
      for (const keyword of item.keywords) {
        if (msg.includes(keyword)) {
          return item.reply;
        }
      }
    }

    // No match → fallback to Google search
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(userMessage)}`;
    return `I’m not sure about that. You can try searching here: <a href="${googleSearchUrl}" target="_blank">Google Search</a>`;
  }
};
