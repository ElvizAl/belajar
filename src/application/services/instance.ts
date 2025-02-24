import { Container } from "inversify";
import { PrismaClient } from "@prisma/client";
import { TYPES } from "../../infrastructure/entity/types";
import { UserRepository } from "../../infrastructure/db/userRepo";
import { SessionRepository } from "../../infrastructure/db/sessionRepo";
import { NoteRepository } from "../../infrastructure/db/noteRepo";
import { AuthServices } from "./authServices";
import { NoteServices } from "./noteServices";


const container = new Container();

container.bind(TYPES.prisma).toConstantValue(new PrismaClient());

container.bind(TYPES.userRepo).to(UserRepository);
container.bind(TYPES.sessionRepo).to(SessionRepository);
container.bind(TYPES.noteRepo).to(NoteRepository);

container.bind(AuthServices).toSelf();
container.bind(NoteServices).toSelf();

export const authServices = container.get<AuthServices>(AuthServices);
export const noteServices = container.get<NoteServices>(NoteServices);