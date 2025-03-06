
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import HeroProfileStep from "../components/onboarding/HeroProfileStep";
import StatusModuleStep from "../components/onboarding/StatusModuleStep";
import LookModuleStep from "../components/onboarding/LookModuleStep";
import FinanceModuleStep from "../components/onboarding/FinanceModuleStep";
import { useLanguage } from "../context/LanguageContext";
import { useUserData } from "../context/UserDataContext";

const Onboarding = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { setCompletedOnboarding } = useUserData();
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: t("heroProfile"),
      component: <HeroProfileStep />,
      validate: () => true, // Validation is done inside the component
    },
    {
      title: t("statusModule"),
      component: <StatusModuleStep />,
      validate: () => true,
    },
    {
      title: t("lookModule"),
      component: <LookModuleStep />,
      validate: () => true,
    },
    {
      title: t("financeModule"),
      component: <FinanceModuleStep />,
      validate: () => true,
    },
    {
      title: t("tutorial"),
      component: (
        <div className="space-y-6">
          <p>{t("tutorialText1")}</p>
          <p>{t("tutorialText2")}</p>
          <p>{t("tutorialText3")}</p>
          <div className="pixel-card p-4 bg-zou-purple/10 mt-6">
            <p className="text-sm font-medium">{t("tutorialTip")}</p>
          </div>
        </div>
      ),
      validate: () => true,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return true; // Added to match the expected return type
    } else {
      completeOnboarding();
      return true; // Added to match the expected return type
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    // Set onboarding completed in UserDataContext
    setCompletedOnboarding(true);
    // Navigate to main app
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <OnboardingLayout
          title={steps[currentStep].title}
          subtitle={t("stepProgress", { current: currentStep + 1, total: steps.length })}
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onComplete={completeOnboarding}
        >
          {steps[currentStep].component}
        </OnboardingLayout>
      </div>
    </div>
  );
};

export default Onboarding;
