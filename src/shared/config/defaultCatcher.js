import * as Sentry from '@sentry/node';

export const defaultCatcher = (e, res) => {
    console.error('-------------- default catcher');
    console.log(e ?? 'No message provided');
    Sentry.captureException(e);

    if (res) {
        if (e.code === 11000) return res.status(400).json({ code: 400, message: 'DUPLICATE_ENTRY' });
        else if (e.code === 400) return res.status(400).json({ code: 400, message: e.message });
        else if (e.code === 403) return res.status(403).json({ code: 403, message: e.message });
        else if (e.code === 404) return res.status(404).json({ code: 404, message: e.message });

        return res.status(500).json({ code: 500, message: e.message ?? '[Taangi] Internal server error' });
    }
}