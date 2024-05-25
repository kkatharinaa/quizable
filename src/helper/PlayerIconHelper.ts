import QuizUser from "../models/QuizUser.ts";

const gems = ['diamond', 'gold', 'quartz', 'ruby', 'lapis', 'amethyst'];
const helmetColors = ['normal', 'purple', 'blue', 'green', 'red', 'grey'];
const icons = gems.flatMap(gemType => helmetColors.map(color => `/assets/helmets/helmet-${gemType}-${color}.svg`));

export const getRandomIcon = (quizUser: QuizUser) => {
    const seedString = `${quizUser.id}-${quizUser.identifier}`;
    const seed = hashStringToNumber(seedString);
    const random = mulberry32(seed);

    const iconIndex = Math.floor(random() * icons.length); // scales the pseudo-random number (0 to 1) to the range of indices for the icons array (for us: 0 to 36) and then floors it to ensure we only get a valid index (max icons.length-1)
    return icons[iconIndex];
}

// hashing function -  convert each character in a string to a number and combine it to create a hash
const hashStringToNumber = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // convert to 32bit integer
    }
    return Math.abs(hash);
}

// pseudo random number generator - use some math to create a pseudo-random number between 0 and 1, so the "randomness" can be reproduced
const mulberry32 = (seed: number) => {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}