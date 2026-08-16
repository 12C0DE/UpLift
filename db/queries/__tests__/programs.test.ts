import {
    createProgram,
    deleteProgram,
    getLastLiftedDatesForPrograms,
    getProgramById,
    getPrograms,
    getRecentPrograms,
    updateProgram
} from '../programs';
import { createWorkout } from '../workout';
import { createExercise } from '../exercises';
import { logWeight } from '../weights';

describe('db/queries/programs', () => {
    it('creates and fetches programs', async () => {
        const result = await createProgram('Hypertrophy 101');
        expect(result[0].id).toBeDefined();
        const progId = result[0].id;

        const program = await getProgramById(progId);
        expect(program).toBeDefined();
        expect(program?.name).toBe('Hypertrophy 101');

        const allPrograms = await getPrograms();
        expect(allPrograms.some((p: any) => p.id === progId)).toBe(true);
    });

    it('updates a program name', async () => {
        const [created] = await createProgram('Old Program Name');
        await updateProgram(created.id, 'New Program Name');

        const updated = await getProgramById(created.id);
        expect(updated?.name).toBe('New Program Name');
    });

    it('deletes a program', async () => {
        const [created] = await createProgram('Program To Delete');
        await deleteProgram(created.id);

        const fetched = await getProgramById(created.id);
        expect(fetched).toBeUndefined();
    });

    it('returns recent programs up to the specified limit', async () => {
        await createProgram('Prog 1');
        await createProgram('Prog 2');
        await createProgram('Prog 3');
        await createProgram('Prog 4');

        const recents = await getRecentPrograms(2);
        expect(recents.length).toBeLessThanOrEqual(2);
    });

    it('calculates last lifted dates for programs accurately', async () => {
        const [prog] = await createProgram('Program with Workouts');
        const [workout] = await createWorkout(prog.id, 'Leg Day');
        const [ex] = await createExercise(workout.id, 'Squat');
        await logWeight(ex.id, 225);

        const lastLiftedMap = await getLastLiftedDatesForPrograms([prog.id]);
        expect(lastLiftedMap[prog.id]).toBeDefined();
    });

    it('returns empty object when programIds array is empty for last lifted dates', async () => {
        const res = await getLastLiftedDatesForPrograms([]);
        expect(res).toEqual({});
    });
});
