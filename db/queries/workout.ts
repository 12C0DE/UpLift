import { eq } from "drizzle-orm";
import { db } from '../index';
import { workouts } from '../schema';

export const getWorkoutsByProgram = async (programId: string) => {
    return await db.select()
        .from(workouts)
        .where(eq(workouts.programId, programId))
        .orderBy(workouts.orderIndex);
}

export const getWorkoutById = async (id: string) => {
    return await db.select()
        .from(workouts)
        .where(eq(workouts.id, id))
}

export const createWorkout = async (programId: string, title: string, week?: number, exercises?: string[], orderIndex?: number) => {
    const createDate = new Date().toISOString();

    return await db.insert(workouts)
        .values({ programId, title, week, exercises, orderIndex, createdAt: createDate, modifiedAt: createDate });
}

export const updateWorkout = async (id: string, title: string, week?: number, exercises?: string[], orderIndex?: number) => {
    return await db.update(workouts)
        .set({ title, week, exercises, orderIndex, modifiedAt: new Date().toISOString() })
        .where(eq(workouts.id, id));
}

export const deleteWorkout = async (id: string) => {
    return await db.delete(workouts)
        .where(eq(workouts.id, id));
}