import { desc, eq } from "drizzle-orm";
import { db } from "../index";
import { weightEntries } from "../schema";

export const getWeightsByExercise = async (exerciseId: string) => {
    return await db
    .select()
    .from(weightEntries)
    .where(eq(weightEntries.exerciseId, exerciseId))
    .orderBy((weightEntries.loggedAt));
}

export const getLastWeight = async (exerciseId: string) => {
    const results = await db
    .select()
    .from(weightEntries)
    .where(eq(weightEntries.exerciseId, exerciseId))
    .orderBy(desc(weightEntries.loggedAt))
    .limit(1);

    return results[0] || null;
}

export const logWeight = (exerciseId: string, weight: number) => {
    const createDate = new Date().toISOString();

    return db.insert(weightEntries).values({
        exerciseId,
        weight,
        loggedAt: createDate,
        modifiedAt: createDate,
    });
}

export const updateWeightEntry = (id: string, weight: number) => {
    return db.update(weightEntries).set({ weight, modifiedAt: new Date().toISOString() }).where(eq(weightEntries.id, id));
}

export const deleteWeightEntry = (id: string) => {
    return db.delete(weightEntries).where(eq(weightEntries.id, id));
}

