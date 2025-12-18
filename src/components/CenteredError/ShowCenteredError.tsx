"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Button } from "../ui/button";

type AlertType = "error" | "success" | "info";

interface AlertState {
  open: boolean;
  message: string;
  type: AlertType;
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => useContext(AlertContext)!;

export const CustomAlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    type: "error",
  });

  const showAlert = (message: string, type: AlertType = "error") => {
    setAlert({ open: true, message, type });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const typeColors = {
    error: "border-red-300 text-red-500",
    success: "border-green-300 text-green-500",
    info: "border-blue-300 text-blue-500",
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Modal */}
      {alert.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div
            className={`bg-white p-6 rounded-md shadow-xl w-[350px] border ${typeColors[alert.type]}`}
          >
            <p className={`font-semibold text-base  text-gray-500`}>
              {alert.message}
            </p>

            <div className="flex justify-end mt-4">
              <Button
                size="sm"
                onClick={closeAlert}
                variant="outline"
                className={typeColors[alert.type]}
              >
                {alert.type == 'success' || alert.type == 'info'?'Ok':'Close'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};
