import { AuthOptions, getServerSession } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { login } from "./db";

const authOptions: AuthOptions = {
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials, _req) {
                if (!credentials) return null;
                const result = await login(credentials.username, credentials.password);
                return result.data ?? null;
            },
        })
    ],
    pages: {
        signIn: "/login",
        signOut: "/logout",
        newUser: "/scrapbooks"
    },
    callbacks: {
        // Modify these (and types/next-auth.d.ts) to add additional user information
        async session({ session, token }: { session: any; token: any }) {
            if (token) {
                session.user.name = token.name;
                session.user.id = token.id;
            }
            return session;
        },
        async jwt({ token, user }: {token: any; user: any}) {
            if (user) {
                token.name = user.name;
                token.id = user.id;
            }
            return token;
        },
    }
};

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }