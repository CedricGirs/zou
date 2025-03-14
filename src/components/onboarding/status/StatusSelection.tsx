
import { useLanguage } from "../../../context/LanguageContext";

interface StatusSelectionProps {
  status: string;
  handleStatusChange: (newStatus: 'student' | 'employee' | 'career-change') => void;
}

const StatusSelection = ({ status, handleStatusChange }: StatusSelectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-3 gap-3">
      <button
        className={`pixel-card p-3 text-center ${status === 'student' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
        onClick={() => handleStatusChange('student')}
      >
        <span className="block mb-1">{t("student")}</span>
        <span className="text-xs text-muted-foreground">{t("studentDesc")}</span>
      </button>
      <button
        className={`pixel-card p-3 text-center ${status === 'employee' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
        onClick={() => handleStatusChange('employee')}
      >
        <span className="block mb-1">{t("employee")}</span>
        <span className="text-xs text-muted-foreground">{t("employeeDesc")}</span>
      </button>
      <button
        className={`pixel-card p-3 text-center ${status === 'career-change' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
        onClick={() => handleStatusChange('career-change')}
      >
        <span className="block mb-1">{t("careerChange")}</span>
        <span className="text-xs text-muted-foreground">{t("careerChangeDesc")}</span>
      </button>
    </div>
  );
};

export default StatusSelection;
