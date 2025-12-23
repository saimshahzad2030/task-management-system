// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";
// import { Button } from "../ui/button";

// type AlertType = "error" | "success" | "info";

// interface AlertState {
//   open: boolean;
//   message: string;
//   type: AlertType;
// }

// interface AlertContextType {
//   showAlert: (message: string, type?: AlertType) => void;
// }

// const AlertContext = createContext<AlertContextType | null>(null);

// export const useAlert = () => useContext(AlertContext)!;

// export const CustomAlertProvider = ({ children }: { children: ReactNode }) => {
//   const [alert, setAlert] = useState<AlertState>({
//     open: false,
//     message: "",
//     type: "error",
//   });

//   const showAlert = (message: string, type: AlertType = "error") => {
//     setAlert({ open: true, message, type });
//   };

//   const closeAlert = () => {
//     setAlert((prev) => ({ ...prev, open: false }));
//   };

//   const typeColors = {
//     error: "border-red-300 text-red-500",
//     success: "border-green-300 text-green-500",
//     info: "border-blue-300 text-blue-500",
//   };

//   return (
//     <AlertContext.Provider value={{ showAlert }}>
//       {children}

//       {/* Modal */}
//       {alert.open && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
//           <div
//             className={`bg-white p-6 rounded-md shadow-xl w-[350px] border ${typeColors[alert.type]}`}
//           >
//             <p className={`font-semibold text-base  text-gray-500`}>
//               {alert.message}
//             </p>

//             <div className="flex justify-end mt-4">
//               <Button
//                 size="sm"
//                 onClick={closeAlert}
//                 variant="outline"
//                 className={typeColors[alert.type]}
//               >
//                 {alert.type == 'success' || alert.type == 'info'?'Ok':'Close'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </AlertContext.Provider>
//   );
// };
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Button } from "../ui/button";
import { CheckCircle, XCircle, Info,FileWarning } from "lucide-react";

type AlertType = "error" | "success" | "info" | "warning";

interface AlertState {
  open: boolean;
  message: string;
  type: AlertType;
  onOk?: () => void;
}

interface AlertContextType {
  showAlert: (
    message: string,
    type?: AlertType,
    onOk?: () => void
  ) => void;
}


const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => useContext(AlertContext)!;

export const CustomAlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    type: "error",
  });
const showAlert = (
  message: string,
  type: AlertType = "error",
  onOk?: () => void
) => {
  setAlert({
    open: true,
    message,
    type,
    onOk,
  });
};


  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };
const handleOk = () => {
  alert.onOk?.(); // ✅ call handler if exists
  closeAlert();
};

const typeConfig = {
  error: {
    icon: XCircle,
    color: "text-red-500 border-red-300 bg-red-50",
  },
  success: {
    icon: CheckCircle,
    color: "text-green-500 border-green-300 bg-green-50",
  },
  info: {
    icon: Info,
    color: "text-blue-500 border-blue-300 bg-blue-50",
  },
  warning: {
    icon: FileWarning,
    color: "text-orange-500 border-orange-300 bg-orange-50",
  },
};
const Icon = typeConfig[alert.type].icon;
  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Modal */}
      {alert.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
<div
  className={`bg-white p-6 rounded-xl shadow-2xl w-[360px] border
    animate-[alert-in_0.25s_ease-out]
    ${typeConfig[alert.type].color}
  `}
>
  <div className="flex items-start gap-3">
    <Icon className="mt-1" size={22} />

    <div className="flex-1">
   
      <p className="font-medium text-gray-800 leading-snug">
        {alert.message}
      </p>

      <div className="flex justify-end mt-4">
        <div className="flex justify-end mt-4 space-x-2">
  {alert.type !== "success" && (
    <Button
      size="sm"
      variant="outline"
      onClick={closeAlert}
      className={`${typeConfig[alert.type]}`}
    >
      Close
    </Button>
  )}

  {(alert.type === "success" || alert.type === "info" ||   alert.type === "warning") && (
    <Button
      size="sm"
      onClick={handleOk}
            className={`${typeConfig[alert.type]}`}

    >
      OK
    </Button>
  )}
</div>
        
      </div>
    </div>
  </div>
</div>
</div>
      )}
    </AlertContext.Provider>
  );
};
