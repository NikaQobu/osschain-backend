import { signInSuccess, signOutSuccess, signUpSuccess } from "@persistence/user/UserReducer";
import { StorageUtil } from "@modules/core/util/StorageUtil";

export const UserAction = {
    signIn,
    signUp,
    signOut,
};

function signIn(params) {
    return async dispatch => {
        await StorageUtil.setItem('loggedIn', true);
        dispatch(signInSuccess(params));
    };
}

function signUp(params) {
    return async dispatch => {
        await StorageUtil.setItem('loggedIn', true);
        dispatch(signUpSuccess(params));
    };
}

function signOut() {
    return async dispatch => {
        await StorageUtil.setItem('loggedIn', false);
        dispatch(signOutSuccess());
    };
}
