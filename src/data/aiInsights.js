/* AI Insights — Pre-built insight templates */
export const AI_INITIAL_MESSAGES = [
    {
        from: 'ai',
        text: "✨ Welcome to Fycle AI — your cosmic cycle intelligence. I weave together your medical data, astrological alignments, and global synchronization patterns to reveal connections invisible to the ordinary eye. Ask me anything about your cycle, the cosmos, or the collective feminine pulse.",
    },
    {
        from: 'ai',
        text: "🌙 Today's Insight: You're on Day 12 of your cycle — the Follicular phase. Your estrogen is rising like the waxing moon. The current Waxing Gibbous moon amplifies this creative surge. 47% of your synced sisters globally are also in this rising-energy phase right now.",
    },
];

export const AI_RESPONSES = {
    default: [
        "Based on your cycle data and the current cosmic alignment, I see an interesting pattern forming. Your luteal phase has been shifting by 1-2 days over the past 3 cycles, which correlates with the Mars-Venus conjunction we experienced last month. This is completely natural and shows your body's deep sensitivity to cosmic rhythms.",
        "Looking at your global sync data, something beautiful is emerging: you and 1,247 other women across 6 continents are experiencing the exact same cycle day today. The Noosphere Index is at 73 — elevated consciousness. This level of synchronization typically amplifies collective intuition by 40%.",
        "Your cycle data shows a strong correlation with the lunar cycle — you're currently in a 'White Moon Cycle' pattern where menstruation aligns with the New Moon. Historically, this pattern was associated with deep wisdom keepers and healers. Only about 30% of women naturally maintain this alignment.",
        "I notice your energy levels peak on cycle days 12-14, which perfectly aligns with your ovulation window. Interestingly, the current Schumann Resonance readings (7.89 Hz — slightly above baseline) suggest heightened Earth-body resonance. Consider this your power window for important meetings or creative work.",
    ],
    medical: [
        "Your average cycle length of 28 days is remarkably consistent with the lunar synodic month (29.53 days). Your flow patterns suggest healthy estrogen-progesterone balance. The slight cramping you logged on Day 1-2 is prostaglandin-mediated — try anti-inflammatory foods like turmeric and ginger during this phase.",
        "Based on your symptom tracking: your PMS symptoms cluster 5-7 days before menstruation and correlate with your progesterone drop. Magnesium-rich foods during the luteal phase (dark chocolate, spinach, almonds) can reduce symptom severity by up to 40%.",
    ],
    cosmic: [
        "The current planetary alignment is remarkable for feminine cycles. Venus is in Pisces — the sign of spiritual depth and intuitive power. Your cycle, beginning under this transit, carries extra potential for emotional healing and creative breakthroughs.",
        "Mercury is currently direct, supporting clear communication about your body's needs. The upcoming Full Moon in your 5th house will supercharge your creative phase — plan important projects for around ovulation day.",
    ],
    global: [
        "A fascinating global pattern: during the last Full Moon, period starts increased globally by 12% — suggesting a collective lunar-menstrual synchronization that science is only beginning to understand. Your body is part of this ancient rhythm.",
        "The Global Sync Map shows a concentration corridor from São Paulo to Lagos to Mumbai today — women along this latitude band share remarkably similar cycle patterns. Geomagnetic field variations along the equatorial belt may explain this.",
    ],
};

export function getAIResponse(category = 'default') {
    const responses = AI_RESPONSES[category] || AI_RESPONSES.default;
    return responses[Math.floor(Math.random() * responses.length)];
}
