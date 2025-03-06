import { useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useOnboarding } from "../context/OnboardingContext";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import HeroProfileStep from "../components/onboarding/HeroProfileStep";
import StatusModuleStep from "../components/onboarding/StatusModuleStep";
import LookModuleStep from "../components/onboarding/LookModuleStep";
import FinanceModuleStep from "../components/onboarding/FinanceModuleStep";
import { useLanguage } from "../context/LanguageContext";

const Onboarding = () => {
  const { onboarding, totalSteps, setOnboardingCompleted, nextStep, prevStep } = useOnboarding();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get('step');
    
    if (stepParam) {
      const step = parseInt(stepParam);
      if (!isNaN(step) && step >= 1 && step <= totalSteps) {
        while (onboarding.currentStep < step) {
          nextStep();
        }
        while (onboarding.currentStep > step) {
          prevStep();
        }
      }
    }
  }, [location.search]);
  
  useEffect(() => {
    if (onboarding.isCompleted && !location.pathname.includes('onboarding')) {
      navigate('/');
    }
  }, [onboarding.isCompleted, navigate, location.pathname]);
  
  if (onboarding.isCompleted && !location.pathname.includes('onboarding')) {
    return <Navigate to="/" />;
  }
  
  const renderStep = () => {
    switch (onboarding.currentStep) {
      case 1:
        return (
          <OnboardingLayout
            title={t("createHeroProfile")}
            subtitle={t("createHeroProfileDesc")}
            showPrevButton={false}
            onNext={() => {
              return !!onboarding.heroProfile.username.trim();
            }}
          >
            <HeroProfileStep />
          </OnboardingLayout>
        );
      case 2:
        return (
          <OnboardingLayout
            title={t("statusModule")}
            subtitle={t("statusModuleDesc")}
          >
            <StatusModuleStep />
          </OnboardingLayout>
        );
      case 3:
        return (
          <OnboardingLayout
            title={t("lookModule")}
            subtitle={t("lookModuleDesc")}
          >
            <LookModuleStep />
          </OnboardingLayout>
        );
      case 4:
        return (
          <OnboardingLayout
            title={t("financeModule")}
            subtitle={t("financeModuleDesc")}
          >
            <FinanceModuleStep />
          </OnboardingLayout>
        );
      case 5:
        return (
          <OnboardingLayout
            title={t("tutorial")}
            subtitle={t("tutorialDesc")}
            onComplete={() => {
              setOnboardingCompleted(true);
            }}
          >
            <div className="text-center py-10">
              <p className="text-muted-foreground">{t("congratsOnboarding")}</p>
              <p className="mt-4">{t("readyToStart")}</p>
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
