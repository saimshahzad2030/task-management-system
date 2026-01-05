"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { UserTaskHeaderProps } from '@/global/componentTypes'
import { User, LogOut, LayoutList } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from 'axios'
import Cookies from 'js-cookie'
import { config } from '../../../config/config'
import SkeletonLoader from '../Loader/SkeletonLoader'
export const UserMenuPopover = () => {
  const router = useRouter();
  const [isAdmin,setIsAdmin]=React.useState(false);
  const [loading,setLoading]=React.useState(true);
  let fetchDetails = async()=>{
    const accessCheck = await  axios.get(`${config.BASE_URL}user-auth-check`, {
  headers: {
    authorization: `Bearer ${Cookies.get('accessToken')}`,
  },
})
console.log(accessCheck?.data?.isAdmin)
console.log(accessCheck.status == 304)
if(accessCheck.status == 304){
  if(accessCheck?.data?.isAdmin){
    setIsAdmin(true);
  }
  else{
    setIsAdmin(false);
  }
}

  }
React.useEffect(()=>{

    fetchDetails();
    setLoading(false);
},[])
  const handleLogout = () => {
    toast.custom(
      (t) => (
        <div className="bg-white border rounded-lg shadow-md p-4 w-[320px]">
          <p className="text-sm text-gray-800 mb-4">
            Are you sure you want to logout?
          </p>

          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1.5 text-sm border rounded-md"
              onClick={() => toast.dismiss(t)}
            >
              Cancel
            </button>

            <button
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md"
              onClick={() => {
                toast.dismiss(t);

                localStorage.clear();
                sessionStorage.clear();
                Cookies.remove("accessToken");
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        duration: 8000,
      }
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-muted transition">
          <User size={18} />
        </button>
      </PopoverTrigger>
<PopoverContent align="end" className="w-48 p-1">
      {loading?
      <div className='w-[100px] h-auto flex flex-col items-center'>
        <SkeletonLoader className='h-[40px] w-full bg-neutral-700'/>
        <SkeletonLoader className='h-[40px] w-full bg-neutral-700'/>
      </div> :
      
       <> {isAdmin && <button
          onClick={() => router.push("/templates")}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted"
        >
          <LayoutList size={16} />
          Back to Templates
        </button>}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-600"
        >
          <LogOut size={16} />
          Logout
        </button></>}
      </PopoverContent>
    </Popover>
  );
};

const UserTaskHeader = ({ adminTemplate }: UserTaskHeaderProps) => {
  return (
      <div className='flex flex-row items-center w-full justify-between'>
            <h1 className='text-5xl'>LOGO</h1>
             <UserMenuPopover />
        </div>
  )
}

export default UserTaskHeader