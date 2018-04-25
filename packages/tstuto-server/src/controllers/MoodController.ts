import { happyMood, sadMood } from '<NPM_USER>/tstuto-api';
import * as express from 'express';

const HAPPY_THRESHOLD = 0.3;

export function MoodController(_req: express.Request, res: express.Response) {
    const indicator = Math.random();
    if (indicator > HAPPY_THRESHOLD) {
        res.json(happyMood(indicator));
    } else {
        res.json(sadMood(indicator));
    }
}
