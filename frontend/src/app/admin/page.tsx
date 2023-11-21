"use client"

import { fetchAllUsers } from  "@/actions/admin"
import UserList from "@/components/userslist"
import { setUsers } from "@/store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";


export default function Page() {
    const dispatch = useAppDispatch();
    const users = useAppSelector((state) => state.userReducer.users);

    useEffect(() => {
        const fetchData = async () => {
            const mergedList = await fetchAllUsers();
            dispatch(setUsers(mergedList));
        };

        fetchData();
    }, [dispatch]);


    return (
        <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">ADMIN DASHBOARD</h1>
        <h2 className="text-xl font-bold mb-4">User List</h2>
        <UserList users={users} />
      </div>
    )
}