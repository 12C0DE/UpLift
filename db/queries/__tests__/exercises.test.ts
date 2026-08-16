import { createProgram } from '../programs';
import { createWorkout } from '../workout';
import {
    createExercise,
    deleteExercise,
    getExerciseById,
    getExercisesByWorkout,
    getExercisesWithLastWeightByWorkout,
    updateExercise
} from '../exercises';
import { logWeight } from '../weights';

describe('db/queries/exercises', () => {
    let workoutId: number;

    beforeEach(async () => {
        const [prog] = await createProgram('Exercise Test Prog');
        const [w] = await createWorkout(prog.id, 'Test Workout');
        workoutId = w.id;
    });

    it('creates and retrieves exercises by workout', async () => {
        const [ex1] = await createExercise(workoutId, 'Bench Press', 3, 10, 'Chest exercise', 0);
        const [ex2] = await createExercise(workoutId, 'Incline Dumbbell Press', 3, 12, 'Upper chest', 1);

        const list = await getExercisesByWorkout(workoutId);
        expect(list.length).toBe(2);
        expect(list[0].name).toBe('Bench Press');
        expect(list[1].name).toBe('Incline Dumbbell Press');
    });

    it('fetches exercise by ID', async () => {
        const [ex] = await createExercise(workoutId, 'Overhead Press');
        const result = await getExerciseById(ex.id);
        expect(result.length).toBe(1);
        expect(result[0].name).toBe('Overhead Press');
    });

    it('updates an exercise', async () => {
        const [ex] = await createExercise(workoutId, 'Old Exercise');
        await updateExercise(ex.id, 'New Exercise', 4, 8, 'Updated desc', 2);

        const [updated] = await getExerciseById(ex.id);
        expect(updated.name).toBe('New Exercise');
        expect(updated.sets).toBe(4);
        expect(updated.reps).toBe(8);
        expect(updated.description).toBe('Updated desc');
    });

    it('deletes an exercise', async () => {
        const [ex] = await createExercise(workoutId, 'Exercise to Delete');
        await deleteExercise(ex.id);

        const result = await getExerciseById(ex.id);
        expect(result.length).toBe(0);
    });

    it('gets exercises with last logged weight', async () => {
        const [ex] = await createExercise(workoutId, 'Barbell Row');
        await logWeight(ex.id, 185);

        const list = await getExercisesWithLastWeightByWorkout(workoutId);
        expect(list.length).toBe(1);
        expect(list[0].lastWeight).toBe(185);
        expect(list[0].lastLoggedAt).toBeDefined();
    });
});
