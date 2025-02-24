import type { PrismaClient } from "@prisma/client";
import type { Createnote, Inote, UpdatedNote } from "../entity/interface";
import { injectable, inject } from "inversify";
import { TYPES } from "../entity/types";

@injectable()
export class NoteRepository implements Inote {
	private prisma: PrismaClient;
	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getAll(userId: string) {
		const notes = await this.prisma.note.findMany({
			where: {
				authorId: userId,
			},
		});
		return notes;
	}

	async getOne(noteId: string) {
		const notes = await this.prisma.note.findUnique({
			where: { id: noteId },
		});

		return notes;
	}

	async create(data: Createnote) {
		const newNote = await this.prisma.note.create({
			data,
		});

		return newNote;
	}

	async update(noteId: string, data: UpdatedNote) {
		const updatedNote = await this.prisma.note.update({
			where: { id: noteId },
			data,
		});

		return updatedNote;
	}

	async delete(noteId: string) {
		await this.prisma.user.delete({
			where: { id: noteId },
		});
	}
}
