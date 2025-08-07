import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // If user is authenticated and trying to access /admin/login, redirect based on level
    if (req.nextUrl.pathname === "/admin/login" && token) {
      const userLevel = token.level?.toString();
      console.log(
        "[middleware] Authenticated user at login page, level:",
        userLevel
      );

      if (userLevel === "1") {
        console.log("[middleware] Redirecting level 1 user to /admin");
        return Response.redirect(new URL("/admin", req.url));
      } else if (userLevel === "0") {
        console.log(
          "[middleware] Redirecting level 0 user to /e-service/tracking"
        );
        return Response.redirect(new URL("/e-service/tracking", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // DEBUG LOG: ตรวจสอบค่า token และ token.level
        console.log("[middleware] token:", token);
        console.log(
          "[middleware] token.level:",
          token?.level,
          typeof token?.level,
          "path:",
          req.nextUrl.pathname
        );

        // Allow access to /admin/login for everyone
        if (req.nextUrl.pathname.startsWith("/admin/login")) {
          return true;
        }

        // For other /admin routes, check authentication and level
        if (req.nextUrl.pathname.startsWith("/admin")) {
          if (!token) {
            console.log("[middleware] No token, redirecting to login");
            return false;
          }

          const userLevel = token.level?.toString();
          console.log("[middleware] userLevel (string):", userLevel);

          // Only allow level "1" users to access admin area
          if (userLevel === "1") {
            console.log("[middleware] Level 1 user, allowing access");
            return true;
          } else {
            console.log(
              "[middleware] Level",
              userLevel,
              "user blocked from admin"
            );
            return false;
          }
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
