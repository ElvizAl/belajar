import type { User, Session, Note } from "@prisma/client";

export type CreateUser = Omit<User, "id">;
export type UpdateUser = Partial<User>;
export type Createnote = Omit<Note, "id">;
export type UpdatedNote = Partial<Note>;

export interface Iuser {
	getAll: () => Promise<User[]>;
	getOne: (id: string) => Promise<User | null>;
	create: (data: CreateUser) => Promise<User>;
	update: (id: string, data: UpdateUser) => Promise<User>;
	delete: (id: string) => Promise<void>;
}

export interface Isession {
	getOne: (SessionId: string) => Promise<Session | null>;
	create: (userId: string) => Promise<Session>;
	delete: (SessionId: string) => Promise<void>;
}

export interface Inote {
	getAll: (userId: string) => Promise<Note[]>;
	getOne: (id: string) => Promise<Note | null>;
	create: (data: Createnote) => Promise<Note>;
	update: (id: string, data: UpdatedNote) => Promise<Note>;
	delete: (id: string) => Promise<void>;
}
