import { Elysia } from "elysia";
import { authRouter } from "./presentation/router/authRouter";

const app = new Elysia({ prefix: "/api" }).use(authRouter).listen(8000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
