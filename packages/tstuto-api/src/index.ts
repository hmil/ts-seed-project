
export interface IMoodAPIResponse {
    indicator: number;
    mood: string;
    text: string;
}

export function happyMood(indicator: number): IMoodAPIResponse {
    return {
        indicator: indicator,
        mood: 'happy',
        text: 'I am feeling glad today!'
    };
}

export function sadMood(indicator: number): IMoodAPIResponse {
    return {
        indicator: indicator,
        mood: 'sad',
        text: 'I am not feeling well today :sad_face:'
    };
}