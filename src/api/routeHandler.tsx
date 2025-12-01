import { NextApiRequest, NextApiResponse } from 'next';
import { axiosInstanceJson } from '../../axios/axiosInstance';

// Middleware to protect API routes
export const withRouteGuard = (handler: Function) => {
return async (req: NextApiRequest, res: NextApiResponse) => {
try {
const userId = req.headers['x-user-id']; // Example: pass user ID via headers
if (!userId) {
return res.status(401).json({ message: "Unauthorized: No user ID provided." });
}
 
  // Call your lightweight API to check access
const response = await axiosInstanceJson.get(`user-auth-check`); 
    // return {
    //   status: response.status,
    //   data: response.data.template, // matches your backend response
    //   message: response.data.message,
    // };
 

  if (response.status !== 200  ) {
    return res.status(403).json({ message: "Access denied to this route." });
  }

  // If allowed, continue to the original handler
  return handler(req, res);

} catch (error) {
  console.error("Error in route guard:", error);
  return res.status(500).json({ message: "Internal server error" });
}
 

};
};
