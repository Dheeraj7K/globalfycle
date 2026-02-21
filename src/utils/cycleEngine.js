/* ═══════════════════════════════════════════════════════
   CYCLE ENGINE — Core prediction & analysis algorithms
   ═══════════════════════════════════════════════════════ */

// Default cycle data for a new user
export const DEFAULT_CYCLE = {
    cycleLength: 28,
    periodLength: 5,
    lastPeriodStart: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 12); // Simulate day 12 of current cycle
        return d.toISOString().split('T')[0];
    })(),
};

// Phase definitions with rich metadata
export const PHASES = {
    menstrual: {
        name: 'Menstrual',
        color: '#ff2d78',
        emoji: '🌑',
        element: 'Water',
        chakra: 'Root (Muladhara)',
        sacredGeometry: 'Circle — Wholeness & Release',
        colorTherapy: ['Deep Red', 'Black', 'Dark Purple'],
        soundFrequency: 174, // Hz — Foundation
        description: 'A time of release, rest, and deep inner knowing. Your body is shedding and renewing.',
        creativeIndex: 3,
        intuitionStrength: 9,
        socialEnergy: 2,
        dreamIntensity: 8,
        manifestationType: 'Release & Let Go',
        foodAlchemy: ['Iron-rich foods', 'Dark chocolate', 'Warming soups', 'Beetroot', 'Red berries'],
        movementMedicine: ['Gentle yoga', 'Walking', 'Rest', 'Yin stretches'],
        crystals: ['Garnet', 'Red Jasper', 'Smoky Quartz'],
        herbs: ['Raspberry leaf', 'Ginger', 'Chamomile'],
        affirmation: 'I honor my body\'s need for rest and release.',
    },
    follicular: {
        name: 'Follicular',
        color: '#00f5d4',
        emoji: '🌒',
        element: 'Air',
        chakra: 'Sacral (Svadhisthana)',
        sacredGeometry: 'Seed of Life — New Beginnings',
        colorTherapy: ['Spring Green', 'Light Blue', 'Coral'],
        soundFrequency: 285, // Hz — Healing
        description: 'Rising energy and creativity. Your body prepares a new egg. Fresh ideas flow naturally.',
        creativeIndex: 7,
        intuitionStrength: 5,
        socialEnergy: 7,
        dreamIntensity: 5,
        manifestationType: 'Plant Seeds & Envision',
        foodAlchemy: ['Fermented foods', 'Sprouts', 'Avocado', 'Citrus', 'Light proteins'],
        movementMedicine: ['Dance', 'Light cardio', 'Hiking', 'Pilates'],
        crystals: ['Carnelian', 'Moonstone', 'Orange Calcite'],
        herbs: ['Peppermint', 'Nettle', 'Green tea'],
        affirmation: 'I am a vessel of creative potential, ready to bloom.',
    },
    ovulation: {
        name: 'Ovulation',
        color: '#ffd700',
        emoji: '🌕',
        element: 'Fire',
        chakra: 'Solar Plexus (Manipura)',
        sacredGeometry: 'Flower of Life — Full Expression',
        colorTherapy: ['Gold', 'Bright Orange', 'Warm White'],
        soundFrequency: 528, // Hz — Love & DNA Repair
        description: 'Peak energy, confidence, and magnetism. You are at your most radiant and communicative.',
        creativeIndex: 10,
        intuitionStrength: 7,
        socialEnergy: 10,
        dreamIntensity: 4,
        manifestationType: 'Take Bold Action',
        foodAlchemy: ['Raw vegetables', 'Lighter grains', 'Juices', 'Berries', 'Seeds'],
        movementMedicine: ['High-intensity', 'Running', 'Group sports', 'Power yoga'],
        crystals: ['Citrine', 'Sunstone', 'Tiger\'s Eye'],
        herbs: ['Shatavari', 'Dandelion', 'Rose'],
        affirmation: 'I radiate power, beauty, and magnetic presence.',
    },
    luteal: {
        name: 'Luteal',
        color: '#a855f7',
        emoji: '🌖',
        element: 'Earth',
        chakra: 'Heart (Anahata)',
        sacredGeometry: 'Metatron\'s Cube — Integration',
        colorTherapy: ['Deep Purple', 'Forest Green', 'Burnt Sienna'],
        soundFrequency: 396, // Hz — Liberation
        description: 'Turning inward. Detail-oriented energy rises. Your inner editor awakens.',
        creativeIndex: 6,
        intuitionStrength: 8,
        socialEnergy: 4,
        dreamIntensity: 7,
        manifestationType: 'Refine & Complete',
        foodAlchemy: ['Complex carbs', 'Root vegetables', 'Dark leafy greens', 'Magnesium-rich foods'],
        movementMedicine: ['Strength training', 'Swimming', 'Moderate yoga', 'Nature walks'],
        crystals: ['Amethyst', 'Lepidolite', 'Rose Quartz'],
        herbs: ['Vitex (chasteberry)', 'Magnesium', 'Evening primrose'],
        affirmation: 'I trust the wisdom of my body as it prepares for renewal.',
    },
};

// Calculate current cycle info
export function getCycleInfo(lastPeriodStart, cycleLength = 28, periodLength = 5) {
    const start = new Date(lastPeriodStart);
    const today = new Date();
    const diffMs = today - start;
    const dayOfCycle = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    const adjustedDay = ((dayOfCycle - 1) % cycleLength) + 1;

    // Determine phase
    let phase;
    if (adjustedDay <= periodLength) {
        phase = 'menstrual';
    } else if (adjustedDay <= Math.floor(cycleLength * 0.46)) {
        phase = 'follicular';
    } else if (adjustedDay <= Math.floor(cycleLength * 0.54)) {
        phase = 'ovulation';
    } else {
        phase = 'luteal';
    }

    const phaseData = PHASES[phase];
    const daysUntilNextPeriod = cycleLength - adjustedDay;
    const ovulationDay = Math.floor(cycleLength / 2);
    const daysUntilOvulation = ovulationDay - adjustedDay;
    const fertileWindowStart = ovulationDay - 5;
    const fertileWindowEnd = ovulationDay + 1;
    const isFertile = adjustedDay >= fertileWindowStart && adjustedDay <= fertileWindowEnd;

    // Calculate cycle progress percentage
    const progressPercent = (adjustedDay / cycleLength) * 100;

    // Biorhythm harmonics (simplified sine wave calculations)
    const physicalBio = Math.sin((2 * Math.PI * dayOfCycle) / 23) * 100;
    const emotionalBio = Math.sin((2 * Math.PI * dayOfCycle) / 28) * 100;
    const intellectualBio = Math.sin((2 * Math.PI * dayOfCycle) / 33) * 100;

    return {
        dayOfCycle: adjustedDay,
        totalDays: cycleLength,
        periodLength,
        phase,
        phaseName: phaseData.name,
        phaseColor: phaseData.color,
        phaseEmoji: phaseData.emoji,
        phaseDescription: phaseData.description,
        element: phaseData.element,
        chakra: phaseData.chakra,
        sacredGeometry: phaseData.sacredGeometry,
        colorTherapy: phaseData.colorTherapy,
        soundFrequency: phaseData.soundFrequency,
        creativeIndex: phaseData.creativeIndex,
        intuitionStrength: phaseData.intuitionStrength,
        socialEnergy: phaseData.socialEnergy,
        dreamIntensity: phaseData.dreamIntensity,
        manifestationType: phaseData.manifestationType,
        foodAlchemy: phaseData.foodAlchemy,
        movementMedicine: phaseData.movementMedicine,
        crystals: phaseData.crystals,
        herbs: phaseData.herbs,
        affirmation: phaseData.affirmation,
        daysUntilNextPeriod,
        daysUntilOvulation: daysUntilOvulation > 0 ? daysUntilOvulation : daysUntilOvulation + cycleLength,
        isFertile,
        fertileWindowStart,
        fertileWindowEnd,
        ovulationDay,
        progressPercent,
        biorhythm: {
            physical: Math.round(physicalBio),
            emotional: Math.round(emotionalBio),
            intellectual: Math.round(intellectualBio),
        },
    };
}

// Get cycle day info for a specific date
export function getCycleDayForDate(date, lastPeriodStart, cycleLength = 28, periodLength = 5) {
    const start = new Date(lastPeriodStart);
    const target = new Date(date);
    const diffMs = target - start;
    const dayOfCycle = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    if (dayOfCycle < 1) return null;
    const adjustedDay = ((dayOfCycle - 1) % cycleLength) + 1;
    const isPeriod = adjustedDay <= periodLength;
    const ovulationDay = Math.floor(cycleLength / 2);
    const isFertile = adjustedDay >= (ovulationDay - 5) && adjustedDay <= (ovulationDay + 1);
    return { dayOfCycle: adjustedDay, isPeriod, isFertile };
}

// Symptoms catalog
export const SYMPTOMS = [
    { id: 'cramps', emoji: '😣', label: 'Cramps' },
    { id: 'bloating', emoji: '🫧', label: 'Bloating' },
    { id: 'headache', emoji: '🤕', label: 'Headache' },
    { id: 'fatigue', emoji: '😴', label: 'Fatigue' },
    { id: 'acne', emoji: '😤', label: 'Acne' },
    { id: 'cravings', emoji: '🍫', label: 'Cravings' },
    { id: 'mood_swings', emoji: '🎭', label: 'Mood Swings' },
    { id: 'breast_tenderness', emoji: '💗', label: 'Tenderness' },
    { id: 'insomnia', emoji: '🌙', label: 'Insomnia' },
    { id: 'nausea', emoji: '🤢', label: 'Nausea' },
    { id: 'back_pain', emoji: '🔙', label: 'Back Pain' },
    { id: 'high_energy', emoji: '⚡', label: 'High Energy' },
    { id: 'creative', emoji: '🎨', label: 'Creative' },
    { id: 'emotional', emoji: '💧', label: 'Emotional' },
    { id: 'confident', emoji: '👑', label: 'Confident' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
];

// Mood options
export const MOODS = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'calm', emoji: '😌', label: 'Calm' },
    { id: 'energetic', emoji: '🤩', label: 'Energetic' },
    { id: 'sensitive', emoji: '🥺', label: 'Sensitive' },
    { id: 'irritable', emoji: '😤', label: 'Irritable' },
    { id: 'sad', emoji: '😢', label: 'Sad' },
    { id: 'anxious', emoji: '😟', label: 'Anxious' },
    { id: 'neutral', emoji: '😐', label: 'Neutral' },
];

// Flow levels
export const FLOW_LEVELS = [
    { id: 0, label: 'None', color: 'rgba(255,45,120,0.1)' },
    { id: 1, label: 'Spotting', color: 'rgba(255,45,120,0.25)' },
    { id: 2, label: 'Light', color: 'rgba(255,45,120,0.45)' },
    { id: 3, label: 'Medium', color: 'rgba(255,45,120,0.65)' },
    { id: 4, label: 'Heavy', color: 'rgba(255,45,120,0.85)' },
    { id: 5, label: 'Very Heavy', color: 'rgba(255,45,120,1)' },
];

// Seasonal shift prediction
export function getSeasonalShift(month) {
    const shifts = {
        0: { season: 'Deep Winter', shift: +1, note: 'Cycles may lengthen slightly. Embrace the darkness and rest.' },
        1: { season: 'Late Winter', shift: +1, note: 'Body still in conservation mode. Warm foods support your cycle.' },
        2: { season: 'Early Spring', shift: 0, note: 'Equinox energy — cycles begin to normalize. Rising vitality.' },
        3: { season: 'Spring', shift: -1, note: 'Increasing light may shorten cycles. Creative energy surges.' },
        4: { season: 'Late Spring', shift: -1, note: 'Peak daylight approaching. Your body syncs with blooming nature.' },
        5: { season: 'Summer Solstice', shift: -1, note: 'Maximum light — cycles may be shortest. Peak social & physical energy.' },
        6: { season: 'High Summer', shift: 0, note: 'Full radiance. Your cycle mirrors the sun\'s power.' },
        7: { season: 'Late Summer', shift: 0, note: 'Energy begins shifting. Harvest time for intentions set in spring.' },
        8: { season: 'Early Autumn', shift: +1, note: 'Equinox balance. Cycles begin to lengthen with darkening days.' },
        9: { season: 'Autumn', shift: +1, note: 'Turning inward. Your body prepares for winter rhythms.' },
        10: { season: 'Late Autumn', shift: +1, note: 'Deep introspection. Melatonin rises, affecting cycle timing.' },
        11: { season: 'Winter Solstice', shift: +2, note: 'Deepest darkness — cycles may be longest. Maximum dream & intuition power.' },
    };
    return shifts[month] || shifts[0];
}
