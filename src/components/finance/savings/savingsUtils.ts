
export const formatDeadline = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

export const calculateTimeLeft = (deadline: string) => {
  const today = new Date();
  const targetDate = new Date(deadline);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return "Dépassé";
  if (diffDays === 0) return "Aujourd'hui!";
  if (diffDays === 1) return "Demain";
  
  const months = Math.floor(diffDays / 30);
  const days = diffDays % 30;
  
  if (months > 0) {
    return `${months} mois${months > 1 ? '' : ''} ${days > 0 ? `et ${days} jour${days > 1 ? 's' : ''}` : ''}`;
  }
  
  return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
};
