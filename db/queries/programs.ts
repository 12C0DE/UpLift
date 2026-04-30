import { eq } from 'drizzle-orm';
import { db } from '../index';
import { programs } from '../schema';

export const getPrograms = async () => {
    return await db.select().from(programs);
}

export const getProgramById = (id: string) => {
    return db.select().from(programs).where(eq(programs.id, id)).get();
}

export const createProgram = (id: string, name: string) => {
    const createDate = new Date().toISOString();
    return db.insert(programs).values({ id, name, createdAt: createDate, modifiedAt: createDate });
}

export const updateProgram = (id: string, name: string) => {
    return db.update(programs).set({ name, modifiedAt: new Date().toISOString() }).where(eq(programs.id, id));
}

export const deleteProgram = (id: string) => {
    return db.delete(programs).where(eq(programs.id, id));
}