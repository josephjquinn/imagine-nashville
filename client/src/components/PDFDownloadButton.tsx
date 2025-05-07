import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { usePDF } from "@/contexts/PDFContext";
import { useMediaQuery } from "@/hooks/use-media-query";

export const PDFDownloadButton: React.FC = () => {
  const { downloadPDF, graphs } = usePDF();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (graphs.size === 0) return null;

  return (
    <Button
      variant="outline"
      onClick={downloadPDF}
      size={isMobile ? "icon" : "default"}
      className={`fixed bottom-1 sm:bottom-4 right-3 sm:right-6 z-50 flex items-center gap-1.5 hover:bg-gray-50 ${
        isMobile
          ? "h-6 w-6 p-0 rounded-md bg-transparent border-0"
          : "rounded-lg text-xs sm:text-sm font-medium bg-white border-0"
      }`}
      title="Download All Graphs as PDF"
    >
      <FileText className={isMobile ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} />
      {!isMobile && <span>Download PDF</span>}
    </Button>
  );
};
