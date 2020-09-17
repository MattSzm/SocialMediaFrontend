import * as actionTypes from './actionTypes';
import axios from '../../axios';
import tokenConfig from "./auth";
import {createMessage} from './messages';
import {fetchRelatedUsersUserPage} from './users';


export const createPost = (form) => {
    return (dispatch, getState) => {
        dispatch({type: actionTypes.CREATE_POST_START});
        const config = tokenConfig(getState);
        config.headers["Content-Type"] = {
            'Content-Type': 'multipart/form-data'
        };

        axios.post('/api/tweet/create/', form, config)
            .then(res => {
                dispatch({
                    type: actionTypes.CREATE_POST_SUCCESS,
                    payload: res.data
                });
                dispatch(createMessage(
                    {createdPost: 'Created tweet successfully'}
                ));
            }).catch(error => {
                dispatch({
                    type: actionTypes.CREATE_POST_FAIL,
                });
                dispatch({
                    type: actionTypes.GET_ERRORS,
                    payload: {
                        msg: {createPost: 'Unable to create tweet'},
                        status: 500
                    }
            });
        });
    };
};


export const fetchUserPosts = (userUuid) => {
    return (dispatch, getState) => {
        dispatch({type: actionTypes.FETCH_USER_POSTS_START});

        axios.get(`/api/tweet/byuser/${userUuid}/`, tokenConfig(getState))
            .then(res => {
                dispatch(fetchRelatedUsersUserPage(
                    res.data.results,
                    userUuid));
                dispatch({
                    type: actionTypes.FETCH_USER_POSTS_SUCCESS,
                    payload: res.data
                });
            }).catch(error => {
                dispatch({type: actionTypes.FETCH_USER_POSTS_FAIL});
                if(error.response) {
                    dispatch({
                        type: actionTypes.GET_ERRORS,
                        payload: {
                            msg: {userPosts: 'Unable to load tweets'},
                            status: error.response.status
                        }
                    });
            }
        });
    };
};


export const fetchMoreUserPosts = (link, userUuid) => {
    return (dispatch, getState) => {
        dispatch({type: actionTypes.LOAD_MORE_USER_POSTS_START});
        axios.get(link.substring(22, ), tokenConfig(getState))
            .then(res => {
                dispatch(fetchRelatedUsersUserPage(
                    res.data.results,
                    userUuid));
                dispatch({
                    type: actionTypes.LOAD_MORE_USER_POSTS_SUCCESS,
                    payload: res.data
                });
            }).catch(error => {
                dispatch({type: actionTypes.FETCH_USER_POSTS_FAIL});
            if(error.response) {
                dispatch({
                    type: actionTypes.GET_ERRORS,
                    payload: {
                        msg: {newsfeed: 'Unable to load newsfeed'},
                        status: error.response.status
                    }
                });
            }
        });
    };
};


export const deletePost = (postUuid) => {
    return (dispatch, getState) => {
        axios.delete(`/api/tweet/destroy/${postUuid}/`, tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.DELETE_POST,
                    payloadUuid: postUuid
                });
                dispatch(createMessage(
                    {postDeleted: 'Deleted tweet successfully'}));
            }).catch(error => {
                dispatch({
                    type: actionTypes.GET_ERRORS,
                    payload: {
                        msg: {deletePost: 'Unable to delete tweet'},
                        status: 500
                    }
                });
        });
    };
};


export const createLikePost = (postUuid) => {
    return (dispatch, getState) => {
        axios.post(`/api/tweet/likes/${postUuid}/`,{}, tokenConfig(getState))
            .then((res) => {
                dispatch({
                    type: actionTypes.CREATE_LIKE_POST,
                    payloadUuid: postUuid
                });
            }).catch(error => {
                dispatch({
                    type: actionTypes.GET_ERRORS,
                    payload: {
                        msg: {likePost: 'Unable to like tweet'},
                        status: 500
                    }
                });
        });
    };
};

export const deleteLikePost = (postUuid) => {
    return (dispatch, getState) => {
        axios.delete(`/api/tweet/likes/${postUuid}/`, tokenConfig(getState))
            .then(res => {
                dispatch({
                    type: actionTypes.DELETE_LIKE_POST,
                    payloadUuid: postUuid
                });
            }).catch(error => {
            dispatch({
                type: actionTypes.GET_ERRORS,
                payload: {
                    msg: {likePost: 'Unable to unlike tweet'},
                    status: 500
                }
            });
        });
    }
}