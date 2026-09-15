import { useUserStore } from '../../stores/useUserStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { BeginnerDashboard } from './BeginnerDashboard';
import { BacDashboard } from './BacDashboard';
import { AthleteDashboard } from './AthleteDashboard';
import { ProfessionalDashboard } from './ProfessionalDashboard';
import { PersonalDashboard } from './PersonalDashboard';

interface DynamicDashboardRouterProps {
  onOpenMistakesLogbook: () => void;
  onOpenCalculator: () => void;
  onOpenRewardStore: () => void;
}

export function DynamicDashboardRouter({
  onOpenMistakesLogbook,
  onOpenCalculator,
  onOpenRewardStore,
}: DynamicDashboardRouterProps) {
  const { profile } = useUserStore();
  const { uiMode } = useLanguageStore();

  // If user is in beginner mode (default for simplicity), render clean, intuitive view
  if (uiMode === 'beginner') {
    return (
      <BeginnerDashboard
        onOpenMistakesLogbook={onOpenMistakesLogbook}
        onOpenRewardStore={onOpenRewardStore}
      />
    );
  }

  // Advanced Mode: route to full role dashboards
  switch (profile.role) {
    case 'bac_student':
      return (
        <BacDashboard
          onOpenMistakesLogbook={onOpenMistakesLogbook}
          onOpenCalculator={onOpenCalculator}
          onOpenRewardStore={onOpenRewardStore}
        />
      );
    case 'athlete':
      return <AthleteDashboard onOpenRewardStore={onOpenRewardStore} />;
    case 'professional':
      return <ProfessionalDashboard onOpenRewardStore={onOpenRewardStore} />;
    case 'personal':
      return <PersonalDashboard onOpenRewardStore={onOpenRewardStore} />;
    default:
      return (
        <BacDashboard
          onOpenMistakesLogbook={onOpenMistakesLogbook}
          onOpenCalculator={onOpenCalculator}
          onOpenRewardStore={onOpenRewardStore}
        />
      );
  }
}

