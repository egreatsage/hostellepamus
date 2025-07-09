const { getToken } = require("next-auth/jwt");
const { NextResponse } = require("next/server");

  async function withAuth(request,roles=[]){
    try {
        const token = await getToken({
            req: request,})
            if(!token || !!token.role){
                return new NextResponse(
                    JSON.stringify({ error: "Aunethntication required" }),
                    { status: 401 }
                )
            }
            if (roles.length>0 && !roles.includes(token.role)){
                return new NextResponse(
                    JSON.stringify({ error: "Insufficient permissions" }),
                    { status: 403 }
                )
            }
            return NextResponse.next();
    } catch (error) {
        console.error("Error in withAuth middleware:", error);
        return new NextResponse(
            JSON.stringify({ error: "An error occurred during authentication" }),
            { status: 500 }
        );
    }
  }export async function middleware(request){
    const {pathname}= request.nextUrl;
    if (
        pathname.startsWith('/_next')||
        pathname.startsWith('api/auth')||
        (pathname ==='/api/users' && request.method ==='POST') ||
        pathname === '/'||
        pathname ==='/logn'||
        pathname === '/register'
    ){
        return NextResponse.next();
    }
    if (pathname.startsWith('/admin')) {
        return withAuth(request, ['admin']);
    }
    if (pathname.startsWith('/student')) {
        return withAuth(request, ['student', 'admin']);
    }

    //  if (pathname.startsWith('/api')) {
    // // Course routes
    // if (pathname.startsWith('/api/courses')) {
    //   // For specific course operations (PUT, DELETE, etc)
    //   if (pathname.match(/\/api\/courses\/[^/]+/)) {
    //     const courseId = pathname.split('/')[3];
    //     return withCourseAccess(request, courseId);
    //   }
    //   // For general course operations (GET all, POST)
    //   return withAuth(request);
    // }}
  }
  export const config = {
    matcher:[
          /*
     * Match all request paths except:
     * 1. /_next (Next.js internals)
     * 2. /static (static files)
     * 3. /favicon.ico, /robots.txt (static files)
     */
    '/((?!_next|static|favicon.ico|robots.txt).*)',
    ]
  }