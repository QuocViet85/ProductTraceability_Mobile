import AppUser from "../model/AppUser";

export const temp_User: AppUser[] = [];

export function setUserToTemp(user: AppUser) {
    if (user) {
        temp_User.push(user);
    }
}

export function getUserInTemp(userId: string) : AppUser | undefined {
    const userInTemp = temp_User.find((user) => {
        return user.id === userId;
    });

    return userInTemp;
}
