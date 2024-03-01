export default {
    secret: process.env.JWT_SECRET ?? "TEST",
    verificationSecret: process.env.JWT_VERIFICATION_SECRET ?? "VERIFICATION_TEST",
    duration: process.env.JWT_TTL ?? "7d",
}