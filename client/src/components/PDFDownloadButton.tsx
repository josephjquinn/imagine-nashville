import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { usePDF } from "@/contexts/PDFContext";

export const PDFDownloadButton: React.FC = () => {
  const { downloadPDF, graphs } = usePDF();

  if (graphs.size === 0) return null;

  return (
    <Button
      variant="outline"
      onClick={downloadPDF}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-background/80 hover:bg-background"
    >
      <FileText className="h-4 w-4" />
      <span>Download All Graphs as PDF</span>
    </Button>
  );
};
