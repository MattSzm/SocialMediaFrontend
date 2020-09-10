import * as actionTypes from './actionTypes';
import axios from 'axios'
import tokenConfig from "./auth";
import {fetchRelatedUsers} from "./users";


export const fetchNewsFeed = () => {
    return (dispatch, getState) => {
        dispatch({type: actionTypes.FETCH_NEWSFEED_START});
        axios.get('/api/tweet/newsfeed/', tokenConfig(getState))
            .then(res => {
                dispatch({type: actionTypes.FETCH_NEWSFEED_SUCCESS,
                        payload: res.data});
                dispatch(fetchRelatedUsers(res.data));
            }).catch(error => {
                dispatch({type: actionTypes.FETCH_NEWSFEED_FAIL});
            if(error.response) {
                dispatch({
                    type: actionTypes.GET_ERRORS,
                    payload: {
                        msg: {newsfeed: 'Unable to load newsfeed'},
                        status: error.response.status
                    }
                })
            }});
    };
};