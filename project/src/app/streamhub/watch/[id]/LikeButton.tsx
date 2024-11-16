"use client";

import React, {useState, useEffect} from 'react';
import '../../../../../public/css/watch.css';

interface LikeButtonProps {
    contentId: number;
    userId: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({contentId, userId}) => {
    const [liked, setLiked] = useState(false);
    const [numLikes, setNumLikes] = useState(0);

    useEffect(() => {
        // Fetch the list of liked content IDs from the API
        const fetchLikeStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8080/StreamHub/likes/cliente/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    // Check if the contentId is in the list of liked content IDs
                    setLiked(data.includes(contentId));
                } else {
                    console.error("Failed to fetch like status");
                }
            } catch (error) {
                console.error("Error fetching like status:", error);
            }
        };

        fetchLikeStatus();
    }, [contentId, userId]);


    const toggleLike = async () => {
        try {

            //Verificar si pulsar el boton debe conllevar poner un like o quitarlo
            let response = null;
            if (liked) { //Si ya le dio like, se elimina
                response = await fetch(`http://localhost:8080/StreamHub/likes/${contentId}/${userId}`,
                    {method: 'DELETE'});
            } else { //Si no le ha dado like, se agrega
                response = await fetch(`http://localhost:8080/StreamHub/likes`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify({id_de_usuario: userId, id_de_contenido: contentId})
                    });
            }

            if (response.ok) {
                setLiked(!liked);
                //Actualizar el numero de likes
                if(liked){
                    if(numLikes>0){
                        setNumLikes(numLikes-1);
                    }
                }else{
                    setNumLikes(numLikes+1);
                }
            } else {
                console.error("Failed to update like status");
            }
        } catch (error) {
            console.error("Error updating like status:", error);
        }
    };

    return (
        <div className="like-button-container">
            <span className="num-likes">{numLikes}</span>
            <button className={`like-button ${liked ? 'liked' : ''}`} onClick={toggleLike}>
                &#10084;
            </button>
        </div>
    );
};

export default LikeButton;