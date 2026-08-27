import { desc, eq, inArray } from "drizzle-orm";
import { db } from "../index";
import { weightEntries } from "../schema";

export const getWeightsByExercise = async (exerciseId: number) => {
    return await db
        .select()
        .from(weightEntries)
        .where(eq(weightEntries.exerciseId, exerciseId))
        .orderBy((weightEntries.loggedAt));
}

export const getLastWeight = async (exerciseId: number) => {
    const results = await db
        .select()
        .from(weightEntries)
        .where(eq(weightEntries.exerciseId, exerciseId))
        .orderBy(desc(weightEntries.loggedAt), desc(weightEntries.id))
        .limit(2);

    if (results.length === 0) return null;
    const first = results[0];
    const second = results[1];

    if ((first.weight === 0 || first.weight == null) && second) {
        return second;
    }

    return first;
}

export const logWeight = async (exerciseId: number, weight: number) => {
    const createDate = new Date().toISOString();

    return await db.insert(weightEntries)
        .values({
            exerciseId,
            weight,
            loggedAt: createDate,
            modifiedAt: createDate,
        })
        .returning({ id: weightEntries.id });
}

export const updateWeightEntry = (id: number, weight: number) => {
    return db.update(weightEntries)
        .set({
            weight,
            modifiedAt: new Date().toISOString()
        })
        .where(eq(weightEntries.id, id));
}

export const deleteWeightEntry = (id: number) => {
    return db.delete(weightEntries).where(eq(weightEntries.id, id));
}

export const getWeightEntriesByExercises = async (exerciseIds: number[]) => {
    if (exerciseIds.length === 0) return [];
    return await db
        .select()
        .from(weightEntries)
        .where(inArray(weightEntries.exerciseId, exerciseIds))
        .orderBy(desc(weightEntries.loggedAt));
}

export interface LastWeightInfo {
    weight: number | null;
    loggedAt: string;
}

export const getLastWeightsForExercises = async (
    exerciseIds: number[]
): Promise<Record<number, LastWeightInfo>> => {
    if (exerciseIds.length === 0) return {};
    const results = await db
        .select()
        .from(weightEntries)
        .where(inArray(weightEntries.exerciseId, exerciseIds))
        .orderBy(desc(weightEntries.loggedAt), desc(weightEntries.id));

    const exerciseEntriesMap: Record<number, Array<(typeof results)[number]>> = {};
    for (const entry of results) {
        if (!exerciseEntriesMap[entry.exerciseId]) {
            exerciseEntriesMap[entry.exerciseId] = [];
        }
        if (exerciseEntriesMap[entry.exerciseId].length < 2) {
            exerciseEntriesMap[entry.exerciseId].push(entry);
        }
    }

    const map: Record<number, LastWeightInfo> = {};
    for (const [exIdStr, entries] of Object.entries(exerciseEntriesMap)) {
        const exerciseId = Number(exIdStr);
        const first = entries[0];
        const second = entries[1];

        const chosen = (first.weight === 0 || first.weight == null) && second
            ? second
            : first;

        map[exerciseId] = {
            weight: chosen.weight,
            loggedAt: chosen.loggedAt,
        };
    }
    return map;
};


