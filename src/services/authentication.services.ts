 
import { SignupFormValues } from "@/components/LoginForm/AuthTabsPage";
import axiosInstance,{axiosInstanceJson} from "../../axios/axiosInstance";
 
export const signup = async (data:SignupFormValues) => {
  try {
    let {firstname,lastname,...dataToSend} = data 
    const response =  await axiosInstance.post("user",{...dataToSend,firstName:firstname,lastName:lastname}); 
    return {
      status: response.status,
      data: response.data,
    };
  } catch (err) {
  const error = err as { response:{status: number; data: string} };
    return {
      status: error.response.status,
      data: error.response?.data,
    };
  }
};

export const login = async (data:{email:string,password:string}) => {
  try {
  

    const response =  await axiosInstance.post("login", {
  email: data.email, 
  password: data.password,
});  
    return {
      status: response.status,
      data: response.data.updatedUser,
    };
  } catch (err) {
  const error = err as { response:{status: number; data: {message:string}} };
    return {
      status: error.response.status,
      message: error.response?.data.message,
    };
  }
};


export const autoLogin = async () => {
  try {
    const response =  await axiosInstanceJson.post("login"); 
    return {
      status: response.status,
      data: response.data,
    };
  } catch (err) {
  const error = err as { response:{status: number; data: string} };
    return {
      status: error.response.status,
      data: error.response?.data,
    };
  }
};