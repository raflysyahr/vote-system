import { user , account } from '@prisma/client';


export interface UserInterface {
    id: string;
    username: string | null;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    password: string | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
}


export interface AccountInterface {
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    createdAt: Date;
    updatedAt: Date;
}