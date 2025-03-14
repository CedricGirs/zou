
import { useState } from "react";
import { Upload, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../../../context/LanguageContext";
import { StatusItem } from "@/types/StatusTypes";

interface CertificateUploadProps {
  item: StatusItem;
  onUpdate: (id: string, updates: Partial<StatusItem>) => void;
}

const CertificateUpload = ({ item, onUpdate }: CertificateUploadProps) => {
  const { t } = useLanguage();
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (file) {
      // In a real app, you would upload the file to a server
      onUpdate(item.id, { 
        certificate: URL.createObjectURL(file),
        completed: true,
        progress: 100
      });
      setShowUpload(false);
      setFile(null);
    }
  };
  
  return (
    <>
      {!showUpload ? (
        <Button 
          className="pixel-button text-[10px] py-1 flex items-center"
          onClick={() => setShowUpload(true)}
          size="sm"
          variant="outline"
        >
          <Upload size={12} className="mr-1" />
          {t("cert")}
        </Button>
      ) : (
        <Button 
          className="text-[10px] text-red-500"
          onClick={() => setShowUpload(false)}
          size="sm"
          variant="ghost"
        >
          <X size={16} />
        </Button>
      )}
      
      {showUpload && (
        <div className="mt-3 bg-muted p-2 rounded-md animate-appear-from-bottom">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">{t("uploadCertificate")}</span>
          </div>
          <input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png" 
            onChange={handleFileChange}
            className="text-xs w-full mb-2"
          />
          <Button 
            className="pixel-button w-full text-[10px] py-1"
            onClick={handleUpload}
            disabled={!file}
            size="sm"
            variant="default"
          >
            {t("upload")}
          </Button>
        </div>
      )}
      
      {item.certificate && (
        <div className="mt-3 flex items-center text-xs">
          <CheckCircle size={12} className="text-green-500 mr-1" />
          <span>{t("certificate")}</span>
        </div>
      )}
    </>
  );
};

export default CertificateUpload;
