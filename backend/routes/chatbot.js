const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Simple AI Mock Chatbot
router.post('/message', async (req, res) => {
  const { message, lang } = req.body;
  const userRole = req.user ? req.user.role : 'guest';

  let response = '';
  const lowerMsg = message.toLowerCase();

  // Basic logic for different languages
  const replies = {
    en: {
      hello: 'Hello! How can I help you today?',
      order: 'You can check your order status in the "My Orders" section.',
      delivery: 'Our delivery partners are currently out for delivery. You can track them on the map.',
      billing: 'Bills are generated every 15 days based on your bookings.',
      default: 'I am here to help. You can ask about orders, billing, or delivery.'
    },
    te: {
      hello: 'నమస్కారం! నేను మీకు ఎలా సహాయపడగలను?',
      order: 'మీరు మీ ఆర్డర్ స్థితిని "నా ఆర్డర్‌లు" విభాగంలో తనిఖీ చేయవచ్చు.',
      delivery: 'మా డెలివరీ భాగస్వాములు ప్రస్తుతం డెలివరీ కోసం వెళ్తున్నారు. మీరు వారిని మ్యాప్‌లో ట్రాక్ చేయవచ్చు.',
      billing: 'మీ బుకింగ్‌ల ఆధారంగా ప్రతి 15 రోజులకు బిల్లులు రూపొందించబడతాయి.',
      default: 'నేను సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీరు ఆర్డర్‌లు, బిల్లింగ్ లేదా డెలివరీ గురించి అడగవచ్చు.'
    },
    hi: {
      hello: 'नमस्ते! मैं आज आपकी कैसे मदद कर सकता हूँ?',
      order: 'आप "मेरे आदेश" अनुभाग में अपनी ऑर्डर स्थिति देख सकते हैं।',
      delivery: 'हमारे डिलीवरी पार्टनर अभी डिलीवरी के लिए बाहर हैं। आप उन्हें मैप पर ट्रैक कर सकते हैं।',
      billing: 'आपके बुकिंग के आधार पर हर 15 दिनों में बिल जेनरेट किए जाते हैं।',
      default: 'मैं यहाँ मदद के लिए हूँ। आप ऑर्डर, बिलिंग या डिलीवरी के बारे में पूछ सकते हैं।'
    }
  };

  const selectedLang = ['en', 'te', 'hi'].includes(lang) ? lang : 'en';
  
  if (lowerMsg.includes('order')) response = replies[selectedLang].order;
  else if (lowerMsg.includes('delivery')) response = replies[selectedLang].delivery;
  else if (lowerMsg.includes('bill')) response = replies[selectedLang].billing;
  else if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('namaste')) response = replies[selectedLang].hello;
  else response = replies[selectedLang].default;

  res.json({ response });
});

module.exports = router;
