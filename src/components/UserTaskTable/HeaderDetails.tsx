import { toast } from "sonner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ColumnDetails } from "@/global/types";
 

const HeaderDetails = (arr: ColumnDetails, headerTitle: string) => {

  return toast.custom((t) => (
    <div className="p-3 bg-white border border-gray-200 rounded-md shadow-md min-w-[300px] pt-8">
      <button
        onClick={() => toast.dismiss(t)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
      >
        <X size={16} />
      </button>
      <h4 className="font-semibold text-gray-800 mb-2">{headerTitle}</h4>

      {!Array.isArray(arr) ?<>
      
           <div className="w-full flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-2 w-full whitespace-pre-wrap">{arr.description}</p>
           <div className="flex justify-end w-full">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(arr.description);
                    toast.success("Copied to clipboard!");
                    toast.dismiss(t)
                  }}
                >
                  Copy
                </Button>
              </div>
           </div>
      </>:
           <Tabs defaultValue={arr[0].category.name} className="w-full">
        {/* Tabs list */}
        {arr.length > 1 && <>
          <TabsList
            style={{
              display: "grid",
              width: "100%",
              marginBottom: "8px",
              gap: "10px",
              gridTemplateColumns: `repeat(${arr.length}, 1fr)` // ✅ Correct property
            }}
          >
            {arr.map((tab, index) => (
              <TabsTrigger className={`${arr.length == 1 && "w-[200px]"}`} key={tab.category.name} value={tab.category.name} style={{ backgroundColor: arr[index].category.color, color: "white" }}>
                {tab.category.name}
              </TabsTrigger>
            ))}
          </TabsList></>}

        {/* Tabs content */}
        {arr.map((tab) => (
          <TabsContent key={tab.category.name} value={tab.category.name}>
            <p className="text-sm text-gray-600 mb-2">{tab.description}</p>

            {tab.copyEnabled && (
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(tab.description);
                    toast.success("Copied to clipboard!");
                    toast.dismiss(t)
                  }}
                >
                  Copy
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
}
    </div>
  ),
    {
      position: "top-center", // 👈 only this toast appears at the top center
      duration: 6000, // optional: auto close after 6s
      dismissible: true, // allow click to dismiss
    });
};

export default HeaderDetails