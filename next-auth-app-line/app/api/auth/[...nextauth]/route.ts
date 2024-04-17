import NextAuth, { AuthOptions } from 'next-auth';
import LineProvider from 'next-auth/providers/line';

const options: AuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID ?? '',
      clientSecret: process.env.LINE_CLIENT_SECRET ?? '',
    }),
  ],
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };