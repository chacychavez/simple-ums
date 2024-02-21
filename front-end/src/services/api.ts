import { UserListResponse } from "../types/api";
import { User } from "../types/user";

export const getUsers = async (page: number) : Promise<UserListResponse> => {
    const res = await fetch(`http://localhost:3000/users?page=${page}`);
    return await res.json();
};

export const postUser = async (data: Partial<User>) => {
    const res = await fetch("http://localhost:3000/users/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await res.json();
};