import { Request, Response, NextFunction } from "express";
import { logDebug } from "../utils/logger";

export default (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    const originalSend = res.send;
    res.json = function (data: any) {
        const transaction_id = req.body?.context?.transaction_id;
        logDebug({
            message: `Response Log`,
            transaction_id,
            meta: {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                // Don't log the full body as it might contain circular references
                bodyLength: typeof data === 'string' ? data.length : JSON.stringify(data).length,
            },
        });

        // Call the original res.json with the data
        return originalJson.call(this, data);
    };
    res.send = function (data: any) {
        const transaction_id = req.body?.transaction_id;
        
        // Only log if response hasn't been sent yet
        if (!res.headersSent) {
                    logDebug({
            message: `Response Log`,
            transaction_id,
            meta: {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                // Don't log the full body as it might contain circular references
                bodyLength: typeof data === 'string' ? data.length : JSON.stringify(data).length,
            },
        });
        }

        // Call the original res.send with the data
        return originalSend.call(this, data);
    };
    next();
};
