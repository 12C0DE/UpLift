import { createProgram } from '../programs';
import {
    createWorkout,
    deleteWorkout,
    getLastLiftedDateForWorkouts,
    getWorkoutById,
    getWorkoutsByProgram,
    getWorkoutsWithLastLiftedByProgram,
    updateWorkout
} from '../workout';
import { createExercise } from '../exercises';
import { logWeight } from '../weights';

describe('db/queries/workout', () => {
    let programId: number;

    beforeEach(async () => {
        const [prog] = await createProgram('Workout Test Program');
        programId = prog.id;
    });

    it('creates and fetches workouts for a program', async () => {
        const [w1] = await createWorkout(programId, 'Push Day A', 1, [], 0);
        const [w2] = await createWorkout(programId, 'Pull Day A', 1, [], 1);

        const workouts = await getWorkoutsByProgram(programId);
        expect(workouts.length).toBe(2);
        expect(workouts[0].title).toBe('Push Day A');
        expect(workouts[1].title).toBe('Pull Day A');
    });

    it('fetches workout by ID', async () => {
        const [created] = await createWorkout(programId, 'Leg Day A');
        const fetched = await getWorkoutById(created.id);
        expect(fetched.length).toBe(1);
        expect(fetched[0].title).toBe('Leg Day A');
    });

    it('updates workout details', async () => {
        const [created] = await createWorkout(programId, 'Initial Title');
        await updateWorkout(created.id, 'Updated Title', 2, 5);

        const fetched = await getWorkoutById(created.id);
        expect(fetched[0].title).toBe('Updated Title');
        expect(fetched[0].week).toBe(2);
        expect(fetched[0].orderIndex).toBe(5);
    });

    it('deletes a workout', async () => {
        const [created] = await createWorkout(programId, 'Temporary Workout');
        await deleteWorkout(created.id);

        const fetched = await getWorkoutById(created.id);
        expect(fetched.length).toBe(0);
    });

    it('gets workouts with last lifted date', async () => {
        const [w] = await createWorkout(programId, 'Full Body');
        const [ex] = await createExercise(w.id, 'Deadlift');
        await logWeight(ex.id, 315);

        const workoutsWithLift = await getWorkoutsWithLastLiftedByProgram(programId);
        expect(workoutsWithLift.length).toBe(1);
        expect(workoutsWithLift[0].lastLiftedAt).not.toBeNull();
    });

    it('returns empty object when workoutIds is empty for getLastLiftedDateForWorkouts', async () => {
        const result = await getLastLiftedDateForWorkouts([]);
        expect(result).toEqual({});
    });
});
