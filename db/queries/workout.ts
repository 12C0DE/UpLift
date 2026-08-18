import { desc, eq, inArray } from "drizzle-orm";
import { db } from '../index';
import { exercises, weightEntries, workouts } from '../schema';

export const getWorkoutsByProgram = async (programId: number) => {
    return await db.select()
        .from(workouts)
        .where(eq(workouts.programId, programId))
        .orderBy(workouts.orderIndex);
}

export const getLastLiftedDateForWorkouts = async (workoutIds: number[]) => {
    if (workoutIds.length === 0) return {};

    const exList = await db
        .select({ id: exercises.id, workoutId: exercises.workoutId })
        .from(exercises)
        .where(inArray(exercises.workoutId, workoutIds));

    if (exList.length === 0) return {};

    const exerciseIdToWorkoutId: Record<number, number> = {};
    const exerciseIds: number[] = [];
    for (const ex of exList) {
        exerciseIdToWorkoutId[ex.id] = ex.workoutId;
        exerciseIds.push(ex.id);
    }

    const weights = await db
        .select({
            exerciseId: weightEntries.exerciseId,
            loggedAt: weightEntries.loggedAt,
        })
        .from(weightEntries)
        .where(inArray(weightEntries.exerciseId, exerciseIds))
        .orderBy(desc(weightEntries.loggedAt));

    const lastLiftedMap: Record<number, string> = {};
    for (const entry of weights) {
        const wId = exerciseIdToWorkoutId[entry.exerciseId];
        if (wId && !lastLiftedMap[wId]) {
            lastLiftedMap[wId] = entry.loggedAt;
        }
    }

    return lastLiftedMap;
};

export const getWorkoutsWithLastLiftedByProgram = async (programId: number) => {
    const workoutList = await getWorkoutsByProgram(programId);
    if (workoutList.length === 0) return [];

    const workoutIds = workoutList.map((w: any) => w.id);
    const lastLiftedMap = await getLastLiftedDateForWorkouts(workoutIds);

    return workoutList.map((w: any) => ({
        ...w,
        lastLiftedAt: lastLiftedMap[w.id] ?? null,
    }));
};


export const getWorkoutById = async (id: number) => {
    return await db.select()
        .from(workouts)
        .where(eq(workouts.id, id))
}

export const createWorkout = async (
    programId: number,
    title: string,
    week?: number,
    exercises?: string[],
    orderIndex?: number,
) => {
    const createDate = new Date().toISOString();

    return await db.insert(workouts)
        .values({
            programId,
            title,
            week,
            exercises,
            orderIndex,
            createdAt: createDate,
            modifiedAt: createDate
        })
        .returning({ id: workouts.id });
}

export const updateWorkout = async (id: number, title: string, week?: number, orderIndex?: number) => {
    return await db.update(workouts)
        .set({
            title,
            week,
            orderIndex,
            modifiedAt: new Date().toISOString()
        })
        .where(eq(workouts.id, id));
}

export const deleteWorkout = async (id: number) => {
    return await db.delete(workouts)
        .where(eq(workouts.id, id));
}