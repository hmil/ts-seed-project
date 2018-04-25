import { IMoodAPIResponse } from '<NPM_USER>/tstuto-api';
import axios from 'axios';

/**
 * Extend the global context with our initialization function
 */
declare global {
    interface Window {
        setup: () => void;
    }
}


window.setup = () => {
    const btn = document.getElementById('action-button');
    const output = document.getElementById('mood');

    if (btn == null || output == null) {
        throw new Error('The window does not contain the expected elements.');
    }

    btn.addEventListener('click', async () => {
        const mood = await axios.get<IMoodAPIResponse>('/api/mood');
        output.innerText = mood.data.text;
    });
}
