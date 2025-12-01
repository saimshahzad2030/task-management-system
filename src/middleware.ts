 
import { withRouteGuard } from './api/routeHandler'; 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { config as con } from '../config/config';
import axiosInstance, { axiosInstanceJson } from '../axios/axiosInstance';
import axios from 'axios';
const adminProtectedRoutes = ['/admin-templates/:path*']; 
const userProtectedRoutes = ['/user-tasks/:path*']; 
export async function middleware(req: NextRequest, res: NextResponse) {
try {
  const path = req.nextUrl.pathname
 
const token = req.cookies.get('accessToken')?.value;
 
console.log(token,"token")
 
    
if(token){ 

    const accessCheck = await  axios.get(`${con.BASE_URL}user-auth-check`, {
  headers: {
    authorization: `Bearer ${token}`,
  },
})
console.log(accessCheck.data,"data")
 if (adminProtectedRoutes.includes(path) && !accessCheck.data.isAdmin) {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
    if (userProtectedRoutes.includes(path)) {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
 
}

   

  return NextResponse.next()
 
  

} catch (error) {
    console.log(error,'errorresponse.statusmiddleware');
// console.error('Middleware error:', error);
return NextResponse.redirect(new URL('/error', req.url));
}
} 
export const config = {
  matcher: ['/admin-templates/:path*'],
};
