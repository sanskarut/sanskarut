import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "sansrut-core-security-secret-key-321";
// ─────────────────────────────────────────────────────────────────────────────
// authorizeJwt Middleware
// Validates signed JWT from Authorization header, populates req.user context.
// Used to protect dashboard endpoints (templates, /me, logs, api-keys).
// ─────────────────────────────────────────────────────────────────────────────
export function authorizeJwt(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
                message: "Missing dashboard session token. Bearer JWT required.",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token || token.trim().length === 0) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
                message: "JWT session token string must be provided.",
            });
            return;
        }
        // Verify and decode JWT — throws if expired or tampered
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            plan: decoded.plan,
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: "Unauthorized",
            message: error.name === "TokenExpiredError"
                ? "Your session has expired. Please sign in again."
                : "Invalid session token. Please sign in again.",
        });
    }
}
