import { Strategy as GitHubStrategy } from "passport-github2";
import passport from "passport";
import { Profile } from "passport";
import { VerifyCallback } from "passport-oauth2";

const GITHUB_CLIENT_ID = process.env.MY_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.MY_GITHUB_CLIENT_SECRET;
const SERVER_URL = process.env.SERVER_URL;
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
}
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/auth/github/callback`,
    },
    (
      accessToken: string,
      refreshToken: string | undefined,
      profile: Profile,
      done: VerifyCallback
    ) => {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export  {passport};