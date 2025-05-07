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
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-background/80 hover:bg-background ${
        isMobile ? "h-8 w-8 p-0" : ""
      }`}
      title="Download All Graphs as PDF"
    >
      <FileText className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
      {!isMobile && <span>Download All Graphs as PDF</span>}
    </Button>
  );
};
