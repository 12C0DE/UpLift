import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '../index';
import { exercises, programs, weightEntries, workouts } from '../schema';

const formatDate = (isoStr?: string | null) => {
    if (!isoStr) return "Never";
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "Never";

    const now = new Date();
    const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfD = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const diffDays = Math.round((startOfNow - startOfD) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

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
    const progs = await db.select().from(programs).orderBy(desc(programs.modifiedAt));
    if (progs.length === 0) return [];

    const programIds = progs.map((p: any) => p.id);

    const workoutList = await db
        .select({
            id: workouts.id,
            programId: workouts.programId,
            title: workouts.title,
        })
        .from(workouts)
        .where(inArray(workouts.programId, programIds))
        .orderBy(workouts.orderIndex);

    const workoutsByProgram: Record<number, { id: number; title: string }[]> = {};
    const workoutIdToProgramId: Record<number, number> = {};
    const workoutIds: number[] = [];

    for (const w of workoutList) {
        if (!workoutsByProgram[w.programId]) {
            workoutsByProgram[w.programId] = [];
        }
        workoutsByProgram[w.programId].push(w);
        workoutIdToProgramId[w.id] = w.programId;
        workoutIds.push(w.id);
    }

    const exercisesByProgram: Record<number, number> = {};
    const exerciseIdToProgramId: Record<number, number> = {};
    const exerciseIds: number[] = [];

    if (workoutIds.length > 0) {
        const exList = await db
            .select({ id: exercises.id, workoutId: exercises.workoutId })
            .from(exercises)
            .where(inArray(exercises.workoutId, workoutIds));

        for (const ex of exList) {
            const progId = workoutIdToProgramId[ex.workoutId];
            if (progId) {
                exercisesByProgram[progId] = (exercisesByProgram[progId] || 0) + 1;
                exerciseIdToProgramId[ex.id] = progId;
                exerciseIds.push(ex.id);
            }
        }
    }

    const lastWorkoutMap: Record<number, string> = {};
    const completedSessionsMap: Record<number, Set<string>> = {};

    if (exerciseIds.length > 0) {
        const weights = await db
            .select({
                exerciseId: weightEntries.exerciseId,
                loggedAt: weightEntries.loggedAt,
            })
            .from(weightEntries)
            .where(inArray(weightEntries.exerciseId, exerciseIds))
            .orderBy(desc(weightEntries.loggedAt));

        for (const entry of weights) {
            const progId = exerciseIdToProgramId[entry.exerciseId];
            if (progId) {
                if (!lastWorkoutMap[progId]) {
                    lastWorkoutMap[progId] = entry.loggedAt;
                }
                if (!completedSessionsMap[progId]) {
                    completedSessionsMap[progId] = new Set();
                }
                const dateKey = entry.loggedAt.split("T")[0];
                completedSessionsMap[progId].add(dateKey);
            }
        }
    }

    return progs.map((p: any) => {
        const wList = workoutsByProgram[p.id] || [];
        const lastIso = lastWorkoutMap[p.id] ?? null;
        const completedCount = completedSessionsMap[p.id] ? completedSessionsMap[p.id].size : 0;

        return {
            ...p,
            workoutCount: wList.length,
            exerciseCount: exercisesByProgram[p.id] || 0,
            timesCompleted: completedCount,
            lastWorkoutISO: lastIso,
            lastWorkout: formatDate(lastIso),
            workoutTitles: wList.map((w) => w.title),
        };
    });
};

export const getRecentPrograms = async (limit: number = 3) => {
    const allProgs = await getPrograms();
    return allProgs.slice(0, limit);
};

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