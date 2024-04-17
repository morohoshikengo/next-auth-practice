export  { auth as middleware } from "@/auth";

export const config = {
    // 下記の記述でprofile以降のものにmiddlewareが発火するようにできるらしい
    // matcher: "/profille:"
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}