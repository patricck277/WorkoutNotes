export type ExerciseItem = {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    userId?: string | null;
  };
  
  export const basicExercises: ExerciseItem[] = [
    { id: '1', name: 'Push-up', description: 'A basic push-up exercise.', imageUrl: 'https://example.com/pushup.jpg' },
    { id: '2', name: 'Squat', description: 'A basic squat exercise.', imageUrl: 'https://example.com/squat.jpg' },
    { id: '3', name: 'Lunge', description: 'A basic lunge exercise.', imageUrl: 'https://example.com/lunge.jpg' },
    { id: '4', name: 'Pull-up', description: 'A basic pull-up exercise.', imageUrl: 'https://example.com/pullup.jpg' },
    { id: '5', name: 'Plank', description: 'A basic plank exercise.', imageUrl: 'https://example.com/plank.jpg' },
  ];
  
