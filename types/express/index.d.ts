import { Role } from '../../models/user'

interface JwtPayload{
    id: string;
    role: Role;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            file?: Express.Multer.File;
        }
    }
}

export {};