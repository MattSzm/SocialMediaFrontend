import * as actionTypes from '../actions/actionTypes';

const initialState = {
    posts: [],
    newsFeedTimeStamp: null,
    linkToLoadMoreUserPage: null,
    loading: false,
    hasMore: true
}

const mergePostsWithShares = (posts, shares) => {
    let postIndex = 0;
    let shareIndex = 0;
    let output = []
    while (postIndex < posts.length &&
    shareIndex < shares.length){
        if(posts[postIndex].created > shares[shareIndex].created){
            output.push(posts[postIndex]);
            postIndex++;
        } else{
            output.push(shares[shareIndex]);
            shareIndex++;
        }
    }
    while (postIndex < posts.length){
        output.push(posts[postIndex]);
        postIndex++;
    }
    while (shareIndex < shares.length){
        output.push(shares[shareIndex]);
        shareIndex++;
    }
    return output;
}

const reducer = (state=initialState, action) => {
    switch (action.type){
        case actionTypes.FETCH_NEWSFEED_START:
        case actionTypes.FETCH_USER_POSTS_START:
            return {...state,
                posts: [],
                newsFeedTimeStamp: null,
                linkToLoadMoreUserPage: null,
                loading: true,
                hasMore: true}
        case actionTypes.LOAD_MORE_NEWSFEED_START:
            return {...state,
                loading: true,
                hasMore: true};
        case actionTypes.FETCH_NEWSFEED_SUCCESS:
            let hasMore = true;
            if((action.payload.tweets.length +
                    action.payload.shares.length) < 10){
                hasMore = false;
            }
            const mergedPosts = mergePostsWithShares(
                    action.payload.tweets,
                    action.payload.shares);
            return {...state,
                posts: mergedPosts,
                newsFeedTimeStamp: action.payload.time_stamp,
                loading: false,
                hasMore: hasMore};
        case actionTypes.FETCH_NEWSFEED_FAIL:
            return {...state, loading: false};
        case actionTypes.CLEAR_NEWSFEED:
            return {...state,
                posts: [],
                newsFeedTimeStamp: null,
                loading: false,
                hasMore: true}
        case actionTypes.LOAD_MORE_NEWSFEED_SUCCESS:
            const newMergedPosts = mergePostsWithShares(
                action.payload.tweets,
                action.payload.shares
            );
            const newPosts = [...state.posts].concat(newMergedPosts);
            let hasMoreMore = true;
            if((action.payload.tweets.length +
                    action.payload.shares.length) < 10){
                hasMoreMore = false;
            }
            return {...state,
                posts: newPosts,
                newsFeedTimeStamp: action.payload.time_stamp,
                loading: false,
                hasMore: hasMoreMore};
        case actionTypes.CREATE_POST_START:
            return {...state,
                loading: true};
        case actionTypes.CREATE_POST_SUCCESS:
            let newPostsWithCreated = [...state.posts]
            newPostsWithCreated.unshift(action.payload)
            return {...state,
                posts: newPostsWithCreated,
                loading: false}
        case actionTypes.CREATE_POST_FAIL:
            return {...state,
                loading: false};
        case actionTypes.FETCH_USER_POSTS_SUCCESS:
            let hasMoreUserPosts = true;
            if(action.payload.next){
                hasMoreUserPosts = false;
            }
            return {...state,
                posts: action.payload.results,
                linkToLoadMoreUserPage: action.payload.next,
                loading: false,
                hasMore: hasMoreUserPosts};
        default:
            return state;
    }
}

export default reducer;