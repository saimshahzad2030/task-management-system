import { toast } from "sonner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
const helpTabs = [
  { label: "PF", description: "This tab explains PF — Primary Function related details.", allowCopy: true },
  { label: "SF", description: "This tab provides information about SF — Secondary Function.", allowCopy: true },
  { label: "TF", description: "TF tab gives insights about Task Function specifics.", allowCopy: false },
  { label: "CF", description: "CF tab covers Control Function or completion flow logic.", allowCopy: true },
];

const HeaderDetails = (headerTitle: string, description: string) => {
  toast.custom((t) => (
   <div className="p-3 bg-white border border-gray-200 rounded-md shadow-md w-[340px] pt-8">
     <button
        onClick={() => toast.dismiss(t)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
      >
        <X size={16} />
      </button>
        <h4 className="font-semibold text-gray-800 mb-2">{headerTitle}</h4>

        <Tabs defaultValue={helpTabs[0]?.label} className="w-full">
          {/* Tabs list */}
          <TabsList 
     
          className={`grid w-full mb-2 grid-cols-4`}>
            {helpTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.label}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tabs content */}
          {helpTabs.map((tab) => (
            <TabsContent key={tab.label} value={tab.label}>
              <p className="text-sm text-gray-600 mb-2">{tab.description}</p>

              {tab.allowCopy && (
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
      </div>
  ),
{
      position: "top-center", // 👈 only this toast appears at the top center
      duration: 6000, // optional: auto close after 6s
      dismissible: true, // allow click to dismiss
    });
};

export default HeaderDetails