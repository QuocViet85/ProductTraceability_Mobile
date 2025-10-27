import AppUser from "../model/AppUser";

export const temp_User: AppUser[] = [];

export const temp_UserName: {id: string, name: string}[] = []

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

export function setUserNameToTemp(userId: string, name: string) {
    temp_UserName.push({
        id: userId, name: name
    })
}

export function getUserNameInTemp(userId: string) : string | undefined  {
    const userNameObjInTemp = temp_UserName.find((userNameObj) => {
        return userNameObj.id === userId
    });

    if (!userNameObjInTemp) {
        const userInTemp = temp_User.find((user) => {
            return user.id === userId;
        });

        if (userInTemp) {
            temp_UserName.push({
                id: userInTemp.id as string,
                name: userInTemp.name as string
            })
            return userInTemp.name;
        }
    }else {
        return userNameObjInTemp.name;
    }
}


