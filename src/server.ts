import app from './app';
import { env } from './config/env';
import { releaseExpiredHolds } from './jobs/releaseExpiredHolds';

const HOLD_CHECK_INTERVAL_MS = 60 * 1000; // every 60s

app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);

    setInterval(releaseExpiredHolds, HOLD_CHECK_INTERVAL_MS);
});