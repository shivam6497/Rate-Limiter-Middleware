import type { Request, Response, NextFunction } from "express";
declare const rateLimiter: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default rateLimiter;
//# sourceMappingURL=rateLimiter.d.ts.map