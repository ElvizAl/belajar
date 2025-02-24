import type { PrismaClient } from "@prisma/client";
import type { CreateUser, Iuser, UpdateUser } from "../entity/interface";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import { TYPES } from "../entity/types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { DBError } from "./errors";

@injectable()
export class UserRepository implements Iuser {
	private prisma: PrismaClient;

	constructor(@inject(TYPES.prisma) prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getAll() {
		try {
			const users = await this.prisma.user.findMany();
			return users;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw new DBError("Error getting rescourse from db");
			}

			throw new DBError("Something went wrong doing DB operation");
		}
	}

	async getOne(userIdOrEmail: string) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					OR: [
						{
							id: userIdOrEmail,
						},
						{
							email: userIdOrEmail,
						},
					],
				},
			});

			if (!user) {
				throw new DBError("Error getting rescourse from db");
			}

			return user;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw new DBError("Error getting rescourse from db");
			}

			throw new DBError("Something went wrong doing DB operation");
		}
	}

	async create(data: CreateUser) {
		try {
			const newUser = await this.prisma.user.create({
				data,
			});

			return newUser;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw new DBError("Error getting rescourse from db");
			}

			throw new DBError("Something went wrong doing DB operation");
		}
	}

	async update(userId: string, data: UpdateUser) {
		try {
			const updatedUser = await this.prisma.user.update({
				where: { id: userId },
				data,
			});

			return updatedUser;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw new DBError("Error getting rescourse from db");
			}

			throw new DBError("Something went wrong doing DB operation");
		}
	}

	async delete(userId: string) {
		try {
			await this.prisma.user.delete({
				where: { id: userId },
			});
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw new DBError("Error getting rescourse from db");
			}

			throw new DBError("Something went wrong doing DB operation");
		}
	}
}
