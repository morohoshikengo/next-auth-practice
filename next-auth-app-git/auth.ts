import NextAuth, { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";

export const config:NextAuthConfig = {

  providers:[Github({
    clientId:process.env.AUTH_GITHUB_ID,
    clientSecret:process.env.AUTH_GITHUB_SECRET
  })
], 
//   以下エンドポイント 
  basePath:"/api/auth",
  //下記コールバック
  callbacks:{
    authorized({request,auth}){
        try{
            const {pathname}= request.nextUrl;
            if(pathname === "/protected-page") return !!auth;
           return true 
        }catch(err){
            console.log(err)
        }
    },
    jwt({token,trigger,session}){
        if(trigger === "update") token.name = session.user.name
        return token;
    }
  }
};

export const {handlers,auth,signIn,signOut} = NextAuth(config)