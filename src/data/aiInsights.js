/* AI Insights — Response templates based on real cycle data */
export const AI_INITIAL_MESSAGES = [
    {
        from: 'ai',
        text: "✨ Welcome to Fycle AI — your cosmic cycle intelligence. I weave together your cycle data, astrological alignments, and lunar patterns to reveal connections. Ask me anything about your cycle or the cosmos.",
    },
];

export const AI_RESPONSES = {
    default: [
        "Based on your current cycle phase and today's lunar alignment, I recommend focusing on activities that match your body's natural energy levels. Listen to what your body is telling you — it carries ancient wisdom.",
        "Your cycle data shows a unique pattern. Each woman's rhythm is like a fingerprint — track consistently across several cycles to reveal your personal cosmic blueprint.",
        "The relationship between your cycle and the lunar cycle is deeply personal. Over time, your tracking data will reveal how your body resonates with celestial rhythms.",
    ],
    medical: [
        "During your current phase, your body benefits from specific nutrients. Anti-inflammatory foods like turmeric, ginger, and leafy greens support hormonal balance. Remember to stay hydrated and listen to your energy levels.",
        "Your symptom patterns will become clearer with consistent tracking. Log your symptoms, mood, and flow daily — after 3 cycles, meaningful patterns will emerge that can help you prepare for each phase.",
    ],
    cosmic: [
        "Today's planetary alignment interacts uniquely with your cycle phase. The moon's current position influences your emotional and physical rhythms. Track your experiences to discover your personal cosmic correlations.",
        "Your cycle mirrors the lunar cycle in remarkable ways. Pay attention to how you feel during different moon phases — these observations will deepen your cosmic self-awareness.",
    ],
    global: [
        "As more women join Global Fycle, the sync map will reveal real global patterns. When the community grows, you'll be able to see connections with women on the same cycle day worldwide.",
        "Global synchronization is a real phenomenon that science is beginning to explore. Your tracking data contributes to our understanding of collective feminine rhythms.",
    ],
};

export function getAIResponse(category = 'default') {
    const responses = AI_RESPONSES[category] || AI_RESPONSES.default;
    return responses[Math.floor(Math.random() * responses.length)];
}
