import { eq } from 'drizzle-orm';
import { db } from '../index';
import { exercises } from '../schema';

export const getExercisesByWorkout = async (workoutId: string) => {
    return await db.select()
        .from(exercises)
        .where(eq(exercises.workoutId, workoutId))
        .orderBy(exercises.orderIndex);
}

export const getExerciseById = async (id: string) => {
    return await db.select()
        .from(exercises)
        .where(eq(exercises.id, id));
}

export const createExercise = async (workoutId: string, name: string, sets?: number, reps?: number, description?: string, orderIndex?: number) => {
    const createDate = new Date().toISOString();

    return await db.insert(exercises)
        .values({ workoutId, name, sets, reps, description, orderIndex, createdAt: createDate, modifiedAt: createDate });
}

export const updateExercise = async (id: string, name: string, sets?: number, reps?: number, description?: string, orderIndex?: number) => {
    return await db.update(exercises)
        .set({ name, sets, reps, description, orderIndex, modifiedAt: new Date().toISOString() });
}

export const deleteExercise = (id: string) => {
    return db.delete(exercises)
        .where(eq(exercises.id, id));
}