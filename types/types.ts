export interface ProgramType {
  id: string;
  name: string;
  lastWorkout?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  description: string;
  weights: (number | null)[];
}

export interface WorkoutSection {
  title: string;
  week: string;
  exercises: Exercise[];
}

export interface WorkoutLogProps {
  programName: string;
  dates: string[];
  sections: WorkoutSection[];
}