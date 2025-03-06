
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import HeroProfileStep from "../components/onboarding/HeroProfileStep";
import { useLanguage } from "../context/LanguageContext";

const Onboarding = () => {
  const { onboarding, totalSteps } = useOnboarding();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If onboarding is already completed, redirect to home
    if (onboarding.isCompleted) {
      navigate('/');
    }
  }, [onboarding.isCompleted, navigate]);
  
  // If onboarding is completed, redirect to home
  if (onboarding.isCompleted) {
    return <Navigate to="/" />;
  }
  
  // Return the appropriate step based on the current step
  const renderStep = () => {
    switch (onboarding.currentStep) {
      case 1:
        return (
          <OnboardingLayout
            title={t("createHeroProfile")}
            subtitle={t("createHeroProfileDesc")}
            showPrevButton={false}
            onNext={() => {
              // Validate that username is not empty
              return !!onboarding.heroProfile.username.trim();
            }}
          >
            <HeroProfileStep />
          </OnboardingLayout>
        );
      case 2:
        // Status module step
        return (
          <OnboardingLayout
            title={t("statusModule")}
            subtitle={t("statusModuleDesc")}
          >
            <div className="text-center py-10">
              <p className="text-muted-foreground">{t("comingSoon")}</p>
              {/* In a real implementation, we would have a StatusModuleStep component here */}
            </div>
          </OnboardingLayout>
        );
      case 3:
        // Look module step
        return (
          <OnboardingLayout
            title={t("lookModule")}
            subtitle={t("lookModuleDesc")}
          >
            <div className="text-center py-10">
              <p className="text-muted-foreground">{t("comingSoon")}</p>
              {/* In a real implementation, we would have a LookModuleStep component here */}
            </div>
          </OnboardingLayout>
        );
      case 4:
        // Finance module step
        return (
          <OnboardingLayout
            title={t("financeModule")}
            subtitle={t("financeModuleDesc")}
          >
            <div className="text-center py-10">
              <p className="text-muted-foreground">{t("comingSoon")}</p>
              {/* In a real implementation, we would have a FinanceModuleStep component here */}
            </div>
          </OnboardingLayout>
        );
      case 5:
        // Tutorial step
        return (
          <OnboardingLayout
            title={t("tutorial")}
            subtitle={t("tutorialDesc")}
          >
            <div className="text-center py-10">
              <p className="text-muted-foreground">{t("comingSoon")}</p>
              {/* In a real implementation, we would have a TutorialStep component here */}
            </div>
          </OnboardingLayout>
        );
      default:
        return <Navigate to="/" />;
    }
  };
  
  return renderStep();
};

export default Onboarding;
