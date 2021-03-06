import axios from '../../axios';
import * as actionTypes from "./actionTypes";
import tokenConfig from "./auth";
import {createError} from "./messages";
import {fetchUserPosts} from "./posts";


export const fetchRelatedUsersNewsFeed = (payload) => {
    return (dispatch, getState) => {
            for (let post of payload.tweets) {
                axios.get(post.user.substring(22,), tokenConfig(getState))
                    .then(res => {
                        dispatch({
                            type: actionTypes.SAVE_USERS_SUCCESS,
                            payload: res.data
                        });
                    }).catch(error => {
                    dispatch(createError('userFail', 'Cannot load user'));
                });
            }
            for (let post of payload.shares) {
                axios.get(post.account.substring(22,), tokenConfig(getState))
                    .then(res => {
                        dispatch({
                            type: actionTypes.SAVE_USERS_SUCCESS,
                            payload: res.data
                        });
                    }).catch(error => {
                    dispatch(createError('userFail', 'Cannot load user'));
                });
                axios.get(post.tweet_itself.user.substring(22,), tokenConfig(getState))
                    .then(res => {
                        dispatch({
                            type: actionTypes.SAVE_USERS_SUCCESS,
                            payload: res.data
                        });
                    }).catch(error => {
                    dispatch(createError('userFail', 'Cannot load user'));
                });
            }
    };
};


export const fetchRelatedUsersUserPage = (payload, userUuid) => {
    return (dispatch, getState) => {
        for(let post of payload){
            if(userUuid !== post.user.substring(36, post.user.length-1)) {
                axios.get(post.user.substring(22,), tokenConfig(getState))
                    .then(res => {
                        dispatch({
                            type: actionTypes.SAVE_USERS_SUCCESS,
                            payload: res.data
                        });
                    }).catch(error => {
                        dispatch(createError('userFail', 'Cannot load user'));
                });
            }
        }
    };
};


export const fetchRelatedUsersComments = (payload) => {
    return (dispatch, getState) => {
        for(let comment of payload){
            axios.get(comment.account.substring(22, ), tokenConfig(getState))
                .then(res => {
                    dispatch({
                        type: actionTypes.SAVE_USERS_SUCCESS,
                        payload: res.data
                    });
                }).catch(error => {
                dispatch(createError('userFail', 'Cannot load user'));
            });
        }
    };
};

export const fetchUser = (username, loadPosts=false) => {
    return (dispatch, getState) => {
        axios.get(`/api/user/username/${username}/`, tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.FETCH_USER_SUCCESS,
                    payload: res.data
                });
                if(loadPosts){
                    dispatch(fetchUserPosts(res.data.uuid));
                }
            }).catch(err => {
                if(err.response){
                    dispatch({
                        type: actionTypes.FETCH_USER_FAIL,
                    });
                }
                dispatch(createError('noUser', 'Cannot find user'));
            });
    };
};


export const clearPickedUser = () => ({
    type: actionTypes.CLEAR_PICKED_USER
});


export const followUser = (userUuid) => {
    return (dispatch, getState) => {
        axios.post(`/api/user/follow/${userUuid}/`, {}, tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.FOLLOW_USER,
                    payloadUuid: userUuid
                });
                dispatch({
                    type: actionTypes.ADD_FOLLOW_TO_CURRENT_USER_COUNTER
                });
            }).catch(err => {
                if(err.response){
                    dispatch({
                        type: actionTypes.GET_ERRORS,
                        payload: {
                            msg: {followUser: 'Unable to follow user'},
                            status: 500
                        }
                    });
                }
        });
    };
};

export const unfollowUser = (userUuid) => {
    return (dispatch, getState) => {
        axios.delete(`/api/user/follow/${userUuid}/`, tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.UNFOLLOW_USER,
                    payloadUuid: userUuid
                });
                dispatch({
                    type: actionTypes.REMOVE_FOLLOW_FROM_CURRENT_USER_COUNTER
                });
            }).catch(err => {
                if(err.response){
                    dispatch({
                        type: actionTypes.GET_ERRORS,
                        payload: {
                            msg: {unfollowUser: 'Unable to unfollow user'},
                            status: 500
                        }
                    });
                }
        });
    };
};

export const fetchUserWithFollowingOrFollowers = (username, following=true) => {
    return (dispatch, getState) => {
        dispatch({type: actionTypes.LOAD_FOLLOW_START});
        axios.get(`/api/user/username/${username}/`, tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.FETCH_USER_SUCCESS,
                    payload: res.data
                });
                if(following){
                    dispatch(fetchFollowingUserList(res.data.uuid));
                }
                else{
                    dispatch(fetchFollowersUserList(res.data.uuid));
                }
            }).catch(err => {
            if(err.response){
                dispatch({
                    type: actionTypes.FETCH_USER_FAIL,
                });
            }
            dispatch(createError('noUser', 'Cannot find user'));
        });
    };
};

export const fetchFollowingUserList = (userUuid) => {
    return (dispatch, getState) => {
        axios.get(`/api/user/followinglist/${userUuid}/`, tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.LOAD_FOLLOW_SUCCESS,
                    payload: res.data,
                    status: res.status
                });
            }).catch(err => {
                if(err.response){
                    dispatch({
                        type: actionTypes.GET_ERRORS,
                        payload: {
                            msg: {fetchFollowing: 'Unable to perform'},
                            status: 500
                        }
                    });
                }
        });
    }
}

export const fetchFollowersUserList = (userUuid) => {
    return (dispatch, getState) => {
        axios.get(`/api/user/followerslist/${userUuid}/`, tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.LOAD_FOLLOW_SUCCESS,
                    payload: res.data,
                    status: res.status
                });
            }).catch(err => {
            if(err.response){
                dispatch({
                    type: actionTypes.GET_ERRORS,
                    payload: {
                        msg: {fetchFollowing: 'Unable to perform'},
                        status: 500
                    }
                });
            }
        });
    }
}

export const fetchMoreFollowingAndFollowersUserList = (link) => {
    return (dispatch, getState) => {
        axios.get(link.substring(22, ), tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.LOAD_MORE_FOLLOW_SUCCESS,
                    payload: res.data
                });
            }).catch(err => {
            if(err.response){
                dispatch({
                    type: actionTypes.GET_ERRORS,
                    payload: {
                        msg: {fetchFollowing: 'Unable to perform'},
                        status: 500
                    }
                });
            }
        });
    }
}


export const searchUsersWithPhrase = (phrase) => {
    return (dispatch, getState) => {
        dispatch({type: actionTypes.SEARCH_USERS_WITH_PHRASE_START});
        axios.get(`/api/user/search/${phrase}/`, tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.SEARCH_USERS_WITH_PHRASE_SUCCESS,
                    payload: res.data,
                    status: res.status
                });
            }).catch(error => {
                if (error.response) {
                    dispatch({
                        type: actionTypes.GET_ERRORS,
                        payload: {
                            msg: {userPosts: 'Unable to load users'},
                            status: error.response.status
                        }
                    });
                }
        });
    }
}

export const searchMoreUsersWithPhrase = (link) => {
    return (dispatch, getState) => {
        axios.get(link.substring(22, ), tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.SEARCH_MORE_USERS_WITH_PHRASE_SUCCESS,
                    payload: res.data,
                });
            }).catch(error => {
                if (error.response) {
                    dispatch({
                        type: actionTypes.GET_ERRORS,
                        payload: {
                            msg: {userPosts: 'Unable to load users'},
                            status: error.response.status
                        }
                    });
                }

        });
    }
}