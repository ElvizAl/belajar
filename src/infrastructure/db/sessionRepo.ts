import type { PrismaClient, Session } from "@prisma/client";
import type { Isession } from "../entity/interface";
import { injectable, inject } from "inversify";
import { TYPES } from "../entity/types";

@injectable()
export class SessionRepository implements Isession {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getOne(sessionId: string) {
		const session = await this.prisma.session.findUnique({
			where: { id: sessionId },
		});

		return session;
	}

	async create(userId: string) {
		const session = await this.prisma.session.create({
			data: {
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return session;
	}

	async delete(sessioId: string) {
		await this.prisma.user.delete({
			where: { id: sessioId },
		});
	}
}
