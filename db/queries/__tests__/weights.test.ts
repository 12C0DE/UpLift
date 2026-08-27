import { createProgram } from '../programs';
import { createWorkout } from '../workout';
import { createExercise } from '../exercises';
import {
    deleteWeightEntry,
    getLastWeight,
    getLastWeightsForExercises,
    getWeightEntriesByExercises,
    getWeightsByExercise,
    logWeight,
    updateWeightEntry
} from '../weights';

describe('db/queries/weights', () => {
    let exerciseId: number;

    beforeEach(async () => {
        const [prog] = await createProgram('Weight Test Prog');
        const [w] = await createWorkout(prog.id, 'Test Workout');
        const [ex] = await createExercise(w.id, 'Squat');
        exerciseId = ex.id;
    });

    it('logs and retrieves weights for an exercise', async () => {
        await logWeight(exerciseId, 135);
        await logWeight(exerciseId, 185);

        const entries = await getWeightsByExercise(exerciseId);
        expect(entries.length).toBe(2);
        expect(entries.some((e: any) => e.weight === 135)).toBe(true);
        expect(entries.some((e: any) => e.weight === 185)).toBe(true);
    });

    it('gets the most recent logged weight', async () => {
        await logWeight(exerciseId, 205);
        await logWeight(exerciseId, 225);

        const last = await getLastWeight(exerciseId);
        expect(last).not.toBeNull();
        expect(last?.weight).toBe(225);
    });

    it('returns null when no weight entry exists for an exercise', async () => {
        const last = await getLastWeight(999999);
        expect(last).toBeNull();
    });

    it('updates a weight entry', async () => {
        const [entry] = await logWeight(exerciseId, 100);
        await updateWeightEntry(entry.id, 105);

        const entries = await getWeightsByExercise(exerciseId);
        const updated = entries.find((e: any) => e.id === entry.id);
        expect(updated?.weight).toBe(105);
    });

    it('deletes a weight entry', async () => {
        const [entry] = await logWeight(exerciseId, 150);
        await deleteWeightEntry(entry.id);

        const entries = await getWeightsByExercise(exerciseId);
        expect(entries.find((e: any) => e.id === entry.id)).toBeUndefined();
    });

    it('gets last weights for multiple exercises', async () => {
        const [prog] = await createProgram('Prog 2');
        const [w] = await createWorkout(prog.id, 'W 2');
        const [ex2] = await createExercise(w.id, 'Bench Press');

        await logWeight(exerciseId, 300);
        await logWeight(ex2.id, 200);

        const map = await getLastWeightsForExercises([exerciseId, ex2.id]);
        expect(map[exerciseId]?.weight).toBe(300);
        expect(map[ex2.id]?.weight).toBe(200);
    });

    it('returns empty results when given empty exerciseIds array', async () => {
        const entries = await getWeightEntriesByExercises([]);
        expect(entries).toEqual([]);

        const map = await getLastWeightsForExercises([]);
        expect(map).toEqual({});
    });

    it('falls back to 2nd last weight if last entry is 0 in getLastWeight', async () => {
        await logWeight(exerciseId, 185);
        await logWeight(exerciseId, 0);

        const last = await getLastWeight(exerciseId);
        expect(last).not.toBeNull();
        expect(last?.weight).toBe(185);
    });

    it('falls back to 2nd last weight if last entry is 0 in getLastWeightsForExercises', async () => {
        const [prog] = await createProgram('Prog Fallback');
        const [w] = await createWorkout(prog.id, 'W Fallback');
        const [ex2] = await createExercise(w.id, 'Deadlift');

        // exerciseId: last is 0, 2nd last is 225
        await logWeight(exerciseId, 225);
        await logWeight(exerciseId, 0);

        // ex2: only 1 entry with 0 weight
        await logWeight(ex2.id, 0);

        const map = await getLastWeightsForExercises([exerciseId, ex2.id]);
        expect(map[exerciseId]?.weight).toBe(225);
        expect(map[ex2.id]?.weight).toBe(0);
    });
});
