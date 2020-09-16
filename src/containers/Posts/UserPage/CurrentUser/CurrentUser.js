import React, {Component} from "react";
import classes from '../UserPage.module.css';
import {connect} from 'react-redux';
import {fetchUserPosts, fetchMoreUserPosts} from '../../../../store/actions/posts';
import {loadCurrentUser} from '../../../../store/actions/auth';
import UserDetail from "../../../../components/UserDetail/UserDetail";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from "../../../../components/UI/Spinner/Spinner";
import Post from "../../../../components/Post/Post";
import SharedPost from "../../../../components/Post/SharedPost";


class UserPage extends Component{
    componentDidMount() {
        if(this.props.user) {
            this.props.startFetching(this.props.user.uuid);
        }
        else{
            this.props.loadCurrentUser();
        }
    }

    loadMore = () => {
        this.props.fetchMore(this.props.linkLoadMore,
            this.props.user.uuid);
    }

    render() {
        let userDetail = <UserDetail loading={true} />;
        if(this.props.user){
            userDetail = (
                <UserDetail
                    user={this.props.user}
                />
            );
        }
        return(
            <div className={classes.UserPage}>
                {userDetail}
                {this.props.user ? (<InfiniteScroll
                    next={() => {
                        if(this.props.linkLoadMore) {
                            this.loadMore();
                        }
                    }}
                    hasMore={this.props.hasMore}
                    loader={<Spinner />}
                    dataLength={this.props.posts.length}
                    endMessage={ this.props.posts.length > 0 ?
                        (<p style={{textAlign: 'center',
                            marginBottom: '4em',
                            color: '#AAB8C2'}}>
                            You have seen it all!
                        </p>) :
                        (<h2
                            style={{
                                textAlign: 'center',
                                margin: '2em 0'
                            }}>
                            No tweets to show.
                        </h2>)
                    }
                >
                    {this.props.posts.map(
                        singlePost => {
                            if(singlePost.user && this.props.user) {
                                if (`${singlePost.user}`.substring(36, singlePost.user.length - 1)
                                    === this.props.user.uuid) {
                                    return (<Post key={singlePost.id}
                                                  post={singlePost}
                                                  user={this.props.user}/>);
                                } else {
                                    if (this.props.users[`${singlePost.user}`.substring(36,
                                        singlePost.user.length - 1)]) {
                                        return (<SharedPost key={singlePost.id}
                                                            post={singlePost}
                                                            user={this.props.users[`${singlePost.user}`
                                                                .substring(36, singlePost.user.length - 1)]}
                                                            userWhoShared={this.props.user}/>);
                                    } else {
                                        return (<SharedPost
                                            key={singlePost.id}
                                            post={singlePost}
                                            loading={true}/>);
                                    }
                                }
                            }
                        }
                    )}
                </InfiniteScroll>) : <Spinner />}
            </div>
        );
    }
}


const mapStateToProps = state => ({
    user: state.auth.user,
    posts: state.posts.posts,
    linkLoadMore: state.posts.linkToLoadMoreUserPage,
    users: state.users.users,
    hasMore: state.posts.hasMore
});

const mapDispatchToProps = dispatch => ({
    loadCurrentUser: () => dispatch(loadCurrentUser(true)),
    startFetching: (userUuid) => dispatch(fetchUserPosts(userUuid)),
    fetchMore: (link, userUuid) => dispatch(fetchMoreUserPosts(link, userUuid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);