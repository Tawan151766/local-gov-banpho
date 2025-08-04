import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Block level 0 from /admin (except /admin/login)
        if (req.nextUrl.pathname.startsWith('/admin') && 
            !req.nextUrl.pathname.startsWith('/admin/login')) {
          if (!token) return false;
          if (token.level === 0 || token.level === "0") return false;
          return true;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*']
};