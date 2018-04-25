import { MoodController } from './controllers/MoodController';
import * as express from 'express';
import * as path from 'path';

console.log('Hello world');

const app = express();

app.get('/api/mood', MoodController);

// Bind static content to server
const pathToWebUI = path.dirname(require.resolve('<NPM_USER>/tstuto-web-client'));
const staticDirToServer = path.join(pathToWebUI, 'public');
console.log(staticDirToServer);
app.use(express.static(staticDirToServer));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
