import { getExercisesWithLastWeightByWorkout } from "@/db/queries/exercises";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ExerciseType = Awaited<ReturnType<typeof getExercisesWithLastWeightByWorkout>>[number];


export interface ActiveWorkoutState {
  programId: number | null;
  workoutId: number | null;
  workoutTitle: string | null;
  workoutWeek: number | null;
  exercises: ExerciseType[];
  /** exerciseId -> setNumber -> weight */
  exerciseWeights: Record<number, Record<number, number>>;
  isWorkoutSaved: boolean;
}

interface ActiveWorkoutContextValue extends ActiveWorkoutState {
  setWorkoutData: (
    data: Omit<ActiveWorkoutState, "isWorkoutSaved">,
  ) => void;
  updateWeights: (weights: Record<number, Record<number, number>>) => void;
  markSaved: () => void;
  clearWorkout: () => void;
}

const defaultState: ActiveWorkoutState = {
  programId: null,
  workoutId: null,
  workoutTitle: null,
  workoutWeek: null,
  exercises: [],
  exerciseWeights: {},
  isWorkoutSaved: false,
};

const ActiveWorkoutContext = createContext<ActiveWorkoutContextValue>({
  ...defaultState,
  setWorkoutData: () => {},
  updateWeights: () => {},
  markSaved: () => {},
  clearWorkout: () => {},
});

export function ActiveWorkoutProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [state, setState] = useState<ActiveWorkoutState>(defaultState);

  const setWorkoutData = useCallback(
    (data: Omit<ActiveWorkoutState, "isWorkoutSaved">) => {
      setState({ ...data, isWorkoutSaved: false });
    },
    [],
  );

  const updateWeights = useCallback(
    (weights: Record<number, Record<number, number>>) => {
      setState((prev) => ({ ...prev, exerciseWeights: weights }));
    },
    [],
  );

  const markSaved = useCallback(() => {
    setState((prev) => ({ ...prev, isWorkoutSaved: true }));
  }, []);

  const clearWorkout = useCallback(() => {
    setState(defaultState);
  }, []);

  const contextValue = useMemo(
    () => ({ ...state, setWorkoutData, updateWeights, markSaved, clearWorkout }),
    [state, setWorkoutData, updateWeights, markSaved, clearWorkout],
  );

  return (
    <ActiveWorkoutContext.Provider value={contextValue}>
      {children}
    </ActiveWorkoutContext.Provider>
  );
}

export function useActiveWorkout() {
  return useContext(ActiveWorkoutContext);
}
