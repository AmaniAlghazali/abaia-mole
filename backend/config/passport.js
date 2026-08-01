const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const prisma = require('./db');
const crypto = require('crypto');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email from Google'), null);

        let user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
            user = await prisma.users.create({
                data: {
                    name: profile.displayName || email.split('@')[0],
                    email,
                    password: crypto.randomBytes(32).toString('hex'),
                    role: 'customer',
                    profile_pic: profile.photos?.[0]?.value || `https://www.gravatar.com/avatar/${emailHash}?s=200&d=identicon`,
                },
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`,
    scope: ['user:email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || `github_${profile.id}@noemail.com`;

        let user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
            user = await prisma.users.create({
                data: {
                    name: profile.displayName || profile.username || email.split('@')[0],
                    email,
                    password: crypto.randomBytes(32).toString('hex'),
                    role: 'customer',
                    profile_pic: profile.photos?.[0]?.value || `https://www.gravatar.com/avatar/${emailHash}?s=200&d=identicon`,
                },
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.users.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
