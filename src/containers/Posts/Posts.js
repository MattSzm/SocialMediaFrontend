import React from "react";
import classes from './Posts.module.css';
import Post from "../../components/Post/Post";
import CreatePost from "./CreatePost/CreatePost";
import {connect} from 'react-redux';
import * as newsFeedActions from '../../store/actions/newsFeed';
import Spinner from '../../components/UI/Spinner/Spinner';


class Posts extends React.Component{
    componentDidMount() {
        this.props.fetchNewsFeed();
    }

    render() {
        let posts = <Spinner />
        if(!this.props.loading){
            console.log(this.props.posts);
            posts = (<Post />);
        }
        return(
            <div className={classes.Posts}>
                {/*NewsFeed*/}
                <h2>Home</h2>
                <CreatePost />

                {posts}


            </div>
        );
    }
}

const mapStateToProps = state => ({
    posts: state.posts.posts,
    loading: state.posts.loading
});

const mapDispatchToProps = dispatch => ({
   fetchNewsFeed: () => dispatch(newsFeedActions.fetchNewsFeed())
});

export default connect(mapStateToProps, mapDispatchToProps)(Posts);