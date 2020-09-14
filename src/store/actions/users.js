import axios from "axios";
import * as actionTypes from "./actionTypes";
import tokenConfig from "./auth";
import {createError} from "./messages";


export const fetchRelatedUsers = (payload) => {
    return (dispatch, getState) => {
        for(let post of payload.tweets){
            axios.get(post.user.substring(22, ), tokenConfig(getState))
                .then(res => {
                    dispatch({
                        type: actionTypes.SAVE_USERS_SUCCESS,
                        payload: res.data});
                }).catch(error => {
                dispatch(createError('userFail', 'Cannot load user'));
            });
        }
        for(let post of payload.shares) {
            axios.get(post.account.substring(22,), tokenConfig(getState))
                .then(res => {
                    dispatch({
                        type: actionTypes.SAVE_USERS_SUCCESS,
                        payload: res.data});
                }).catch(error => {
                dispatch(createError('userFail', 'Cannot load user'));
            });
            axios.get(post.tweet_itself.user.substring(22,), tokenConfig(getState))
                .then(res => {
                    dispatch({
                        type: actionTypes.SAVE_USERS_SUCCESS,
                        payload: res.data});
                }).catch(error => {
                    dispatch(createError('userFail', 'Cannot load user'));
            });
        }

    };
};

export const fetchUser = (username) => {
    return (dispatch, getState) => {
        axios.get(`/api/user/username/${username}/`, tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.FETCH_USER_SUCCESS,
                    payload: res.data
                });
            }).catch(err => {
                dispatch({
                    type: actionTypes.FETCH_USER_FAIL,
                    payload: err.response.data
                });
            });
    };
};