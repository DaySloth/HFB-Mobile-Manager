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
          };
          // API call associated with authentification
          // look up the user from the credentials supplied
          const user = await login(data);
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return Promise.resolve(user);
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
});

const login = async (data) => {
  //   const { db } = await connectToDatabase();
  //   const Users = await db.collection("users");
  const { username, password } = data;
  const user = await axios.post(
    "https://hfb-api.herokuapp.com/api/users/login",
    { email: username, password: password },
    {
      headers: {
        "hfb-apikey": "S29obGVyUm9ja3Mh",
      },
    }
  );

  console.log(user);
  // if (user[0]) {
  //   const correctPass = await bcrypt.compare(password, user[0].password);

  //   if (correctPass) {
  //     return {
  //       name: user[0].first_name,
  //       email: user[0].email,
  //     };
  //   } else {
  //     return null;
  //   }
  // } else {
  //   return null;
  // }
  // const result = await db.ref(`/users/${username}`).once("value");
  // const foundUser = result.val();
  // if (foundUser) {
  //   if (foundUser.hasManagerAccess) {
  //     if (Base64.decode(foundUser.password) === password) {
  //       return {
  //         name: foundUser.first_name,
  //         email: foundUser.email,
  //       };
  //     } else {
  //       return null;
  //     }
  //   } else {
  //     return null;
  //   }
  // } else {
  //   return null;
  // }
};
