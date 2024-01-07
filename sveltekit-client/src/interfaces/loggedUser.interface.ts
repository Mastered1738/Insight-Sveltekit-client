export default interface LoggedUserInterface {
    user_id: number;
    email: string;
    username: string;
    user_type: number;
    profile_file: Uint8Array;
    cover_file: Uint8Array;
}