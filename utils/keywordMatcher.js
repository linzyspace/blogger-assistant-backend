function matchKeyword(message, responses) {
  const lowerMsg = message.toLowerCase();
  const match = responses.find(r => r.keywords.some(k => lowerMsg.includes(k)));
  return match ? match.reply : null;
}

module.exports = { matchKeyword };
