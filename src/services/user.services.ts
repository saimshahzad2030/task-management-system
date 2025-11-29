import axiosInstance from "../../axios/axiosInstance";

export const fetchAllUsersService = async () => {
try {
const response = await axiosInstance.get("/user"); // adjust the route if needed
return {
status: response.status,
data: response.data.users, // match backend response
message: response.data.message,
};
} catch (err) {
const error = err as { response: { status: number; data: { message: string } } };
return {
status: error.response?.status || 500,
message: error.response?.data?.message || "Network Error",
};
}
};