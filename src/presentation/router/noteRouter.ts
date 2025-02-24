import { Elysia, t } from "elysia";
import {
	authServices,
	noteServices,
} from "../../application/services/instance";

export const noteRouter = new Elysia({ prefix: "/v1/notes" })
	.derive(async ({ headers }) => {
		const sessionId = headers.authorization?.split(" ")[1];

		if (!sessionId) {
			throw new Error("Error!");
		}
		const user = await authServices.decodeSession(sessionId);

		return user;
	})
	.get("/", async ({ user }) => {
		const notes = await noteServices.getAll(user?.id as string);

		return notes;
	})
	.get("/:id", async ({ params }) => {
		const notes = await noteServices.getOne(params.id);
	})
	.post(
		"/",
		async ({ body, user }) => {
			const { title, content } = body;

			const newNote = await noteServices.create({
				title,
				content,
				authorId: user?.id as string,
			});

			return newNote;
		},
		{
			body: t.Object({
				title: t.String(),
				content: t.String(),
			}),
		},
	)
	.patch(
		"/:id",
		async ({ body, params }) => {
			const { title, content } = body;

			const updatedNote = await noteServices.update(params.id, {
				title,
				content,
			});

			return updatedNote;
		},
		{
			body: t.Object({
				title: t.String(),
				content: t.String(),
			}),
		},
	)
	.delete("/:id", async ({ params }) => {
		await noteServices.delete(params.id);
	});
