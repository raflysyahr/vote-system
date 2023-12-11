interface User {
    username:string,
    name:string,
    email:string,
    bio:string|null,
    role:'admin'|'user'|'guest',
    password:string|null,
    createdBy:'credential'|'google'|'facebook',
    votes:number,
    emailVerify:boolean,
    planer:string,
    links:{ url:string , label : string }[]|null
    createAt:Date,
    updateAt:Date,
}

interface Account extends User {
    
}
interface Profile {}
