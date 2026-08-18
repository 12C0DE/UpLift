import { eq } from 'drizzle-orm';
import { db } from '../index';
import { exercises } from '../schema';

import { getLastWeightsForExercises } from './weights';

export const getExercisesByWorkout = async (workoutId: number) => {
    return await db.select()
        .from(exercises)
        .where(eq(exercises.workoutId, workoutId))
        .orderBy(exercises.orderIndex);
}

export const getExercisesWithLastWeightByWorkout = async (workoutId: number) => {
    const exerciseList = await getExercisesByWorkout(workoutId);
    if (exerciseList.length === 0) return [];

    const exerciseIds = exerciseList.map((ex: any) => ex.id);
    const lastWeightsMap = await getLastWeightsForExercises(exerciseIds);

    return exerciseList.map((ex: any) => ({
        ...ex,
        lastWeight: lastWeightsMap[ex.id]?.weight ?? null,
        lastLoggedAt: lastWeightsMap[ex.id]?.loggedAt ?? null,
    }));
}


export const getExerciseById = async (id: number) => {
    return await db.select()
        .from(exercises)
        .where(eq(exercises.id, id));
}

export const createExercise = async (
    workoutId: number,
    name: string,
    sets?: number,
    reps?: number,
    description?: string,
    orderIndex?: number,
) => {
    const createDate = new Date().toISOString();

    return await db.insert(exercises)
        .values({ workoutId, name, sets, reps, description, orderIndex, createdAt: createDate, modifiedAt: createDate })
        .returning({ id: exercises.id });
}

export const updateExercise = async (id: number, name: string, sets?: number, reps?: number, description?: string, orderIndex?: number) => {
    return await db.update(exercises)
        .set({ name, sets, reps, description, orderIndex, modifiedAt: new Date().toISOString() })
        .where(eq(exercises.id, id));
}

export const deleteExercise = (id: number) => {
    return db.delete(exercises)
        .where(eq(exercises.id, id));
}