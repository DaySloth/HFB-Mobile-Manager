import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";

export default NextAuth({
  providers: [
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      authorize: async (credentials) => {
        //console.log("credentials_:", credentials);

        try {
          const data = {
            username: credentials.username,
            password: credentials.password,
            resetTempPassword: credentials.resetTempPassword,
          };
          // API call associated with authentification
          // look up the user from the credentials supplied
          const { data: user } = await login(data);
          if (user) {
            if (user.hasWebAccess) {
              if (user.isTempPassword) {
                return Promise.reject(
                  `/authorize/signin?error=Temporary password&email=${user.email}`
                );
              } else {
                // Any object returned will be saved in `user` property of the JWT
                return Promise.resolve(user);
              }
            } else {
              return Promise.reject(
                "/authorize/signin?error=Access not allowed to web manager"
              );
            }
          }
        } catch (error) {
          if (error) {
            //console.log(error.response);
            return Promise.reject(
              "/authorize/signin?error=Invalid username or password"
            );
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/authorize/signin",
    signOut: "/auth/signout",
    error: "/authorize/signin", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: null, // If set, new users will be directed here on first sign in
  },
  callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
      //  "user" parameter is the object received from "authorize"
      //  "token" is being send below to "session" callback...
      //  ...so we set "user" param of "token" to object from "authorize"...
      //  ...and return it...
      user && (token.user = user);
      return Promise.resolve(token); // ...here
    },
    session: async (session, user, sessionToken) => {
      //  "session" is current session object
      //  below we set "user" param of "session" to value received from "jwt" callback
      session.user = user.user;
      return Promise.resolve(session);
    },
  },
});

const login = async (data) => {
  const { username, password, resetTempPassword } = data;
  if (resetTempPassword === "true") {
    try {
      const foundUser = await axios.post(
        "https://hfb-api.herokuapp.com/api/users/login/temp-password",
        { email: username, password: password },
        {
          headers: {
            "hfb-apikey": "S29obGVyUm9ja3Mh",
          },
        }
      );

      if (foundUser) {
        return foundUser;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  } else {
    try {
      const foundUser = await axios.post(
        "https://hfb-api.herokuapp.com/api/users/login",
        { email: username, password: password },
        {
          headers: {
            "hfb-apikey": "S29obGVyUm9ja3Mh",
          },
        }
      );

      if (foundUser) {
        return foundUser;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
  // return {
  //   data: {
  //     first_name: "Test User",
  //     hasWebAccess: true,
  //   },
  // };
};
