import { Candidate } from './Candidate';
export type VoteType = {
    id?: string,
    title: string,
    startDateTime: Date,
    endDateTime: Date,
    publisher: string,
    email:string,
    code: string,
    candidates: Candidate[],
    createdAt?: Date,
    deleteAt?: string | null,
    scheduled: boolean,
    total?:number
}

