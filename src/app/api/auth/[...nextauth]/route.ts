import 'dotenv/config';
import jwt from 'jsonwebtoken';
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWTDecodeParams, JWTEncodeParams } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getCookies } from 'next-client-cookies/server';

const nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'text'
        },
        password: {
          label: 'password',
          type: 'password'
        }
      },
      async authorize(credentials, req) {


        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify
            ({
              email: credentials?.email,
              password: credentials?.password
            })
        })


        const result = await response.json()

        if (result && response.ok) {
          return {
            name: result.user.name,
            email: result.user.email,
            id: result.user.id,
          }
        }

        return null
      },
    })
  ],
  pages: {
    signIn: '/',
    error: '/'
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        secure: false
      }
    }
  },
  useSecureCookies: false,
  jwt: {
    maxAge: 60 * 60 * 24 * 2, // 2 dias
    encode: (params: JWTEncodeParams) => {

      // return a custom encoded JWT string
      return jwt.sign({
        email: params.token?.email,
        name: params.token?.name,
        role: params.token?.role
      }, params.secret, {
        expiresIn: '2 days'
      })
    },
    decode: (params: JWTDecodeParams) => {
      // return a `JWT` object, or `null` if decoding failed
      const payload: any = jwt.verify(params.token as string, params.secret);

      // retorne o payload


      if (payload) {
        return {
          name: payload.name,
          email: payload.email,
          role: payload.role,
          exp: payload.exp
        }
      }

      return null
    },
  },
  session: {
    maxAge: 60 * 60 * 24 * 2 // 2 dias
  },
  callbacks: {
    async signIn({ account, profile, credentials }) {
      if (account?.provider === "google") {
        //  profile?.email && profile.email.endsWith("@example.com")
        const profileTyped: any = { ...profile }

        if (profileTyped?.email_verified) {

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login-with-google`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify
              ({
                email: profile?.email,
                name: profile?.name
              })
          })

          if (!response.ok) {
            return null
          }

          const result = await response.json()

          return result
        }


      }

      if (account?.provider === 'credentials') {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify
            ({
              email: credentials?.email,
              password: credentials?.password
            })
        })

        if (!response.ok) {
          return null
        }


        const result = await response.json()


        if (result && response.ok) {
          return {
            name: result.user.name,
            email: result.user.email,
            id: result.user.id,
          }
        }

        return null
      }

      return false
    },
    async jwt({ token, trigger, user, session }) {
      // console.log(token, user, session)

      const { exp }: { exp: number } = token as any
      if (exp * 1000 < Date.now()) {
        return {
          ...token,
          error: "invalid-version",
        };
      }

      return { ...token, ...user }
    },
    async session({ session, token }) {
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST };
