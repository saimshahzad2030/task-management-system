 
 

 
export type FinalColumnKey = "statusTL" | "completed";
 export type ColumnDetails = {
    description:string;
    copyEnabled:boolean;
    category:Categories;
  }[] | {
    description:string;
    copyEnabled:boolean; 
  } ; 
export interface Step {
  index?:number,
  id:number;
  columnDetailsChecked:boolean
  columnByCategoriesEnabled?:boolean
  columnDetails?:ColumnDetails ;
  timeSensitiveColors?: {
    warning: { days: number; color: string }; // Yellow at X days
    danger: { days: number; color: string };  // Red at Y days
  };
  unCheckOption?:{
    enabled:boolean;
    days:number;
  };
  isTimeSensitive?: boolean; // If the step has a time-sensitive date
  name: string;                           // Step name or label
  description?: string;                   // Optional extra details for users
  completed?: boolean;                     // For user tasks (false by default)
    type?: "text" | "check" | "date";       // Optional step input type
  trigger?: "popup" | "relation" | "completed" ; // Admin trigger type
   popupDescription?:string | null
    linkedStep?:{id:number ,notes?:string, futureColumnThings?:{
        needed:boolean | "true" | "false";
        description:string;
      }[]} | null
  info?: string | null;                          // Instruction, note, or email text
}
export interface ListStep {
    id?:number;
    columnId:number;
     columnDetails?:ColumnDetails; 

  unCheckOption?:{
    enabled:boolean;
    days:number;
  };
 
    name: string;
    markedNext?: boolean;
    markedNextRed?:boolean;
    completed: boolean; 
    notes?:string; 
    description: string;
    triggerType:"popup" | "relation" | "completed"
      popupDescription?:string | null

    linkedStep?:{id:number,
       notes?:string,
     
      futureColumnThings?:{
     needed:boolean | "true" | "false";
        description:string;
      }[]
    }
  }
// Admin-created reusable template
export interface AdminTemplate {
  id: string;
  enabledUsers?:{id:number; email:string}[];

  name: string;
 categories:Categories[];
  description: string;
  createdAt?:Date;
  updatedAt?:Date;
  
  steps: Omit<Step, "completed" | "timeSensitiveDate">[];
}
 export interface Categories{color:string, name:string,id:number};
// User-created task line (based on admin template)
export interface TaskRow {
  id: string;
    createdAt?:Date;
  updatedAt?:Date;
    color: string;
    category?:{id:number;color:string; name:string;};
  template: AdminTemplate;
  taskLineChecked: boolean;
  timeSensitiveDate: string | null;
 
  otherColumns: {
    columnId:number;
    name: string;
    type: "text" | "check" | "date";
    value?:string;
      timeSensitiveColors?: {
    warning: { days: number; color: string }; // Yellow at X days
    danger: { days: number; color: string };  // Red at Y days
  };
  isTimeSensitive?: boolean;
  }[];
  steps: ListStep[];
  statusTL: boolean;
  completed: boolean;
  columnDetails?:ColumnDetails;
}

export type FlagProps = { 
  checked:boolean;
   disabled:boolean;
   onToggle: (value: boolean) => void;
  color?: string; // ✅ custom color support
};

export   interface NotesPopupState {
  open: boolean;
  x: number;
  y: number;
  rowIndex: number | null;
  stepName: string;
  value: string;
}
