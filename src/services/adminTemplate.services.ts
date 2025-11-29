import { Step } from "@/global/types";
import axiosInstance from "../../axios/axiosInstance";
export interface AdminTemplatePayload {
  name: string;
  description: string;
  categories: { name: string; color: string }[];
  steps: Step[];
  createdAt?: Date;
    updatedAt?: Date;
}
export const fetchAllTemplatesService = async () => {
try {
const response = await axiosInstance.get("/admin-templates"); // adjust the route if needed
return {
status: response.status,
data: response.data.templates, // match backend response
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

export const createAdminTemplate = async (data: AdminTemplatePayload) => {
  try {
    const response = await axiosInstance.post("admin-template", data); 
    return {
      status: response.status,
      data: response.data.template, // matches your backend response
      message: response.data.message,
    };
  } catch (err) {
    const error = err as { response?: { status: number; data: { message: string } } };
    return {
      status: error.response?.status || 500,
      message: error.response?.data.message || "Something went wrong",
    };
  }
};
export const updateAdminTemplate = async (id:number,data: AdminTemplatePayload) => {
  try {
    const response = await axiosInstance.patch(`admin-template?id=${id}`, data); 
    return {
      status: response.status,
      data: response.data.template, // matches your backend response
      message: response.data.message,
    };
  } catch (err) {
    const error = err as { response?: { status: number; data: { message: string } } };
    return {
      status: error.response?.status || 500,
      message: error.response?.data.message || "Something went wrong",
    };
  }
};

export const deleteTemplate = async (id:number) => {
  try {
    const response = await axiosInstance.delete(`admin-template?id=${id}`); 
    return {
      status: response.status, 
      message: response.data.message,
    };
  } catch (err) {
    const error = err as { response?: { status: number; data: { message: string } } };
    return {
      status: error.response?.status || 500,
      message: error.response?.data.message || "Something went wrong",
    };
  }
};

export const allowTemplateAccessToUser = async (id:number,userId:number) => {
  try {
    const response = await axiosInstance.patch(`admin-templates?id=${id}`, { userId }); 
    return {
      status: response.status,
      data: response.data.template, // matches your backend response
      message: response.data.message,
    };
  } catch (err) {
    const error = err as { response?: { status: number; data: { message: string } } };
    return {
      status: error.response?.status || 500,
      message: error.response?.data.message || "Something went wrong",
    };
  }
};
