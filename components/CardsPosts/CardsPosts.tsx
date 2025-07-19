"use client";
import { useState } from "react";
import CardPost from "../CardPost/CardsPost";

const CardsPosts = () => {
    const [posts, setPosts] = useState([
        1,2,3,4,5,6
    ]);

    return (
        <div className="w-[95%] min-h-screen flex gap-5 flex-wrap">
            {posts.map(post => (
                <CardPost key={post}/>   
            ))}
        </div>
    );
}

export default CardsPosts;