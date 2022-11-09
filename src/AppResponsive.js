import {useEffect, useState} from "react";

import {Logo, ThumbUp, ThumbDown, ArrowRight, ArrowLeft} from "./Assets";
import {useLocalStorage} from "./Hooks/useLocalStorage";
import "./style-responsive.css";

const AppResponsive = () => {
    const [posts, setPosts] = useState([]);
    const [index, setIndex] = useState(0);
    const [storage, setStorage] = useLocalStorage("storage", []);

    console.log("Storage Array = ",storage);

    // Swipe Controls for mobile -- START
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    // The required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null); // Otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX);
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe || isRightSwipe);

        if(isLeftSwipe) {
            LikesDislikes(posts[index].id, posts[index].title, "dislike");
            nextCard();
        }
        if(isRightSwipe) {
            LikesDislikes(posts[index].id, posts[index].title, "like");
            nextCard();
        }
    }
    // Swipe Controls for mobile -- END

    // Fetching data from API
    useEffect(() => {
        fetch('https://creative-tech-code-quest.vercel.app/api/swipe')
            .then((response) => response.json()).then((data) => {
            setPosts(data);
        }).catch((err) => {
            console.log(err.message);
        });
    }, []);

    //  Checking to see if there is a next card, if there is one, then increment the index, optionally you can return to the end - last card
    const nextCard = () =>{
        if(index >= posts.length){
            // Optionally - You can just end it at posts.length-1
            setIndex(0);
        }else{
            setIndex(prevState => prevState + 1);
        }
    }

    //  Checking to see if there is a previous card, if there is one, then decrement the index, optionally you can return to the beginning - first card
    const prevCard = () =>{
        if(index === 0){
            return;
            // Optionally - If you want to get to the end
            // setIndex(posts.length-1);
        }else{
            setIndex(prevState => prevState - 1);
        }
    }

    //  Like - Dislike button logic
    const LikesDislikes = (id, title, status) =>{
        setStorage((storageItem) =>{
            //  Checking if the item already exsists in the array
            if(storageItem.find((item) => item.id === id) == null){
                // If returned false, then add it to the array
                return [...storageItem, {id, title, status}];
            }else{
                // Otherwise change the items status to the current one
                return storageItem.map((item) =>{
                    if(item.id === id){
                        return { ...item, id, title, status: status}
                    }else{
                        return item;
                    }
                })
            }
        })
    }

    // Optional window resize
    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    function getWindowSize() {
        const {innerWidth, innerHeight} = window;
        return {innerWidth, innerHeight};
    }

    return (
        <div className={"swipe-design"}>

            <div className={"logo"}>
                <Logo/>
            </div>

            <div className={"thumb-down"} onClick={()=> LikesDislikes(posts[index].id, posts[index].title, "dislike")}>
                <ThumbDown/>
            </div>

            <div className={"arrow-left"} onClick={()=> prevCard()}>
                <ArrowLeft/>
            </div>

            {posts.map((item, i)=>(
                <div key={item.id} className={`card  ${i < index ? 'none' : 'back'}`}
                     style={{zIndex:posts.length-i,
                         left: windowSize.innerWidth > 549 ? `${windowSize.innerWidth/2 - 182.64/2 - 13 * i}px` : `${windowSize.innerWidth/2 - 125.6/2 - 8.94 * i}px`,
                         top: windowSize.innerWidth > 549 ?`${windowSize.innerHeight/2 - 306.04/2 - 13 * i}px` : `${windowSize.innerHeight/2 - 210.47/2 - 8.94 * i}px`}}
                     onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                    <div className={"card-text"}>
                        <div className={"card-text-wrapper"}>
                            {item.title}
                        </div>
                    </div>
                </div>
            ))}

        {/* Optional Reset button

        <button className={"reset"} onClick={()=>setIndex(0)}
        style={{
            left: windowSize.innerWidth > 549 ? `${windowSize.innerWidth/2 - 182.64/2 - 13 * (posts.length)}px` : `${windowSize.innerWidth/2 - 125.6/2 - 8.94 * (posts.length)}px`,
            top: windowSize.innerWidth > 549 ?`${windowSize.innerHeight/2 - 306.04/2 - 13 * (posts.length)}px` : `${windowSize.innerHeight/2 - 210.47/2 - 8.94 * (posts.length)}px`}}>
            Out of cards
            <div className={"reset-description"}>Click to reset</div>
        </button>

        */}

            <div className={"arrow-right"} onClick={()=> nextCard()}>
                <ArrowRight/>
            </div>

            <div className={"thumb-up"} onClick={()=> LikesDislikes(posts[index].id, posts[index].title, "like")}>
                <ThumbUp/>
            </div>

        </div>
    );
}

export default AppResponsive;
