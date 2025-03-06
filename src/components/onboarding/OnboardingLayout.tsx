
import { ReactNode } from "react";
import { useOnboarding } from "../../context/OnboardingContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface OnboardingLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
  showPrevButton?: boolean;
  showNextButton?: boolean;
  onNext?: () => boolean; // Return boolean to indicate success
  onPrevious?: () => void;
  nextDisabled?: boolean;
  onComplete?: () => void; // For completing onboarding
}

const OnboardingLayout = ({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps,
  showPrevButton = true,
  showNextButton = true,
  onNext,
  onPrevious,
  nextDisabled = false,
  onComplete,
}: OnboardingLayoutProps) => {
  const { onboarding } = useOnboarding();
  const { t } = useLanguage();
  
  const handleNext = () => {
    if (onNext) {
      return onNext();
    }
    return true;
  };
  
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
  };
  
  const isLastStep = currentStep === totalSteps - 1;
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-zou-purple/10 to-purple-300/10">
      <div className="max-w-screen-md w-full glass-card p-6 relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-muted-foreground/20">
          <div 
            className="h-full bg-zou-purple transition-all duration-500"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        <div className="text-center mb-8 mt-4">
          <h1 className="font-pixel text-xl md:text-2xl mb-2">
            {title}
          </h1>
          <p className="text-muted-foreground">{subtitle}</p>
          
          <div className="flex justify-center mt-4 text-xs text-muted-foreground">
            <span className="pixel-border px-2 py-1">
              {t("step")} {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>
        
        <div className="mb-10">
          {children}
        </div>
        
        <div className="flex justify-between mt-8">
          {showPrevButton && currentStep > 0 ? (
            <button 
              className="pixel-button-secondary flex items-center"
              onClick={handlePrevious}
            >
              <ChevronLeft size={16} className="mr-1" />
              {t("back")}
            </button>
          ) : (
            <div></div>
          )}
          
          {showNextButton && (
            <button 
              className="pixel-button flex items-center"
              onClick={isLastStep && onComplete ? onComplete : handleNext}
              disabled={nextDisabled}
            >
              {isLastStep ? t("finish") : t("next")}
              <ChevronRight size={16} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
