import { desc, eq } from 'drizzle-orm';
import { db } from '../index';
import { programs } from '../schema';

export const getPrograms = async () => {
    return await db.select().from(programs)
    .orderBy(desc(programs.modifiedAt));
}

export const getRecentPrograms = async (limit: number = 3) => {
    return await db.select().from(programs)
    .orderBy(desc(programs.modifiedAt))
    .limit(limit);
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