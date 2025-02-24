import type { SessionRepository } from "../../infrastructure/db/sessionRepo";
import type { UserRepository } from "../../infrastructure/db/userRepo";
import "reflect-metadata"
import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/entity/types";
import { UserDTO } from "../dtos/userDTO";

@injectable()

export class AuthServices {
    private userRepo: UserRepository;
    private sessionRepo: SessionRepository;

    constructor(@inject(TYPES.userRepo) userRepo: UserRepository, @inject(TYPES.sessionRepo) sessionRepo: SessionRepository) {
        this.userRepo = userRepo;
        this.sessionRepo = sessionRepo;
    }

    async registerUser(name: string, email: string, password: string) {
        const user = await this.userRepo.getOne(email);

        if (user) {
            throw new Error("user sudah terdaftar")
        }

        const hashPassword = await Bun.password.hash(password)
        const newUser = await this.userRepo.create({
            name, email, password: hashPassword, avatar: "",
        });

        return new UserDTO(newUser).fromEntity();
    }

    async loginUser(email:string, password: string) {
        const user = await this.userRepo.getOne(email);

        if (!user) {
            throw new Error("pengguna tidak ditemukan")
        }

        const matchedPassword = Bun.password.verify(password, user.password);

        if (!matchedPassword) {
            throw new Error("Password Salah")
        }

        const session = await this.sessionRepo.create(user.id);

        return session
    }

    async checkSession(sessionId: string) {
        const session = await this.sessionRepo.getOne(sessionId)

        if (!session) {
            throw new Error("Session Salah")
        }

        return "valid"
    }
 
    async decodeSession(sessionId: string) {
        const session = await this.sessionRepo.getOne(sessionId)

        if (!session) {
            throw new Error("Session Salah")
        }

        const user = await this.userRepo.getOne(session.userId)

        return { user }
    }
}

