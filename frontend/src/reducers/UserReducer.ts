import cookie from 'react-cookies'
import { User } from '../interfaces/User';

export interface Action {
    type: string;
    payload?: User;
}

const UserReducer = (currentState: User | null, action: Action): User | null => {
    switch (action.type) {
        case "login":
            return action.payload || null;
        case "logout":
            cookie.remove("token");
            cookie.remove("user");
            return null;
        default:
    }
    return currentState;
};

export default UserReducer;