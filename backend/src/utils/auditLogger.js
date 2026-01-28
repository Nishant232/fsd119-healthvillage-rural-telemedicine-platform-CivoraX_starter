const AuditLog = require("../models/AuditLog.model");

module.exports = async ({
  req,
  action,
  targetType,
  targetId,
  metadata = {},
  actor = null,
  role = null,
}) => {
  try {
    // Use provided actor/role or fallback to req.user
    const actorId = actor || req.user?.id;
    const actorRole = role || req.user?.role;

    if (!actorId || !actorRole) {
      throw new Error("Actor ID and role are required for audit logging");
    }

    await AuditLog.create({
      actor: actorId,
      role: actorRole,
      action,
      targetType,
      targetId,
      metadata,
      ipAddress: req.ip,
      userAgent: req.headers?.["user-agent"],
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};
