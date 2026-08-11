import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '../index';
import { exercises, programs, weightEntries, workouts } from '../schema';

const formatDate = (isoStr?: string | null) => {
    if (!isoStr) return "Never";
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "Never";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const getLastLiftedDatesForPrograms = async (programIds: number[]): Promise<Record<number, string>> => {
    if (programIds.length === 0) return {};

    const workoutList = await db
        .select({ id: workouts.id, programId: workouts.programId })
        .from(workouts)
        .where(inArray(workouts.programId, programIds));

    if (workoutList.length === 0) return {};

    const workoutIdToProgramId: Record<number, number> = {};
    const workoutIds: number[] = [];
    for (const w of workoutList) {
        workoutIdToProgramId[w.id] = w.programId;
        workoutIds.push(w.id);
    }

    const exList = await db
        .select({ id: exercises.id, workoutId: exercises.workoutId })
        .from(exercises)
        .where(inArray(exercises.workoutId, workoutIds));

    if (exList.length === 0) return {};

    const exerciseIdToProgramId: Record<number, number> = {};
    const exerciseIds: number[] = [];
    for (const ex of exList) {
        const progId = workoutIdToProgramId[ex.workoutId];
        if (progId) {
            exerciseIdToProgramId[ex.id] = progId;
            exerciseIds.push(ex.id);
        }
    }

    if (exerciseIds.length === 0) return {};

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
        const progId = exerciseIdToProgramId[entry.exerciseId];
        if (progId && !lastLiftedMap[progId]) {
            lastLiftedMap[progId] = entry.loggedAt;
        }
    }

    return lastLiftedMap;
};

export const getPrograms = async () => {
    return await db.select().from(programs)
        .orderBy(desc(programs.modifiedAt));
}

export const getRecentPrograms = async (limit: number = 3) => {
    const progs = await db.select().from(programs)
        .orderBy(desc(programs.modifiedAt))
        .limit(limit);

    if (progs.length === 0) return [];

    const programIds = progs.map((p) => p.id);
    const lastLiftedMap = await getLastLiftedDatesForPrograms(programIds);

    return progs.map((p) => ({
        ...p,
        lastWorkout: lastLiftedMap[p.id] ? formatDate(lastLiftedMap[p.id]) : "Never",
    }));
}

export const getProgramById = (id: number) => {
    return db.select().from(programs).where(eq(programs.id, id)).get();
}

export const createProgram = (name: string) => {
    const createDate = new Date().toISOString();

    return db.insert(programs)
        .values({ name, createdAt: createDate, modifiedAt: createDate })
        .returning({ id: programs.id });
}

export const updateProgram = (id: number, name: string) => {
    return db.update(programs).set({ name, modifiedAt: new Date().toISOString() }).where(eq(programs.id, id));
}

export const deleteProgram = (id: number) => {
    return db.delete(programs).where(eq(programs.id, id));
}