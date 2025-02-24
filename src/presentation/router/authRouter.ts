import { Elysia, t } from "elysia";
import { authServices } from "../../application/services/instance";

export const authRouter = new Elysia({ prefix: "/v1" })

	.post(
		"/register",
		async ({ body, set }) => {
			try {
				const newUser = await authServices.registerUser(
					body.name,
					body.email,
					body.password,
				);

				set.status = 201;
				return newUser;
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("Terjadi Kesalahan");
			}
		},
		{
			body: t.Object({
				name: t.String({ minLength: 3 }),
				email: t.String({ format: "email" }),
				password: t.String({ minLength: 6 }),
			}),
		},
	)
	.post(
		"/login",
		async ({ body, set }) => {
			try {
				const session = await authServices.loginUser(body.email, body.password);
				set.status = 201;

				return { sessionId: session.id };
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}
				throw new Error("Terjadi Kesalahan");
			}
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				password: t.String({ minLength: 8 }),
			}),
		},
	)
	.post(
		"/session",
		async ({ body, set }) => {
			const sessionId = body.sessionId;

			const isValid = await authServices.checkSession(sessionId);

			if (isValid !== "valid") {
				set.status = 401;
				return { status: "invalid" };
			}
			return { status: "valid" };
		},
		{
			body: t.Object({
				sessionId: t.String(),
			}),
		},
	);
