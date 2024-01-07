import { writable } from "svelte/store";
import type LoggedUserInterface from "../interfaces/loggedUser.interface";

export const loggedUserStore = writable<LoggedUserInterface>({
    user_id: 0,
    email: '',
    username: '',
    user_type: 0,
    profile_file: new Uint8Array,
    cover_file: new Uint8Array,
});