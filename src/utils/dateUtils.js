export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  const defaultOptions = { month: 'short', day: 'numeric', ...options };
  return date.toLocaleDateString('en-US', defaultOptions);
};

export const isOverdue = (dueDate, status) => {
  return new Date(dueDate) < new Date() && status !== 'Done';
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export const getTodayFormatted = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};
