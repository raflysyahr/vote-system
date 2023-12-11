import React, { useRef, useState } from 'react';

type SwipeLogoutType = {
    children:React.ReactNode
}

export default function SwipeLogout(props:SwipeLogoutType){

    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [distance, setDistance] = useState<number>(0);
    const wrapperRef = useRef<any>(null);
    const childRef = useRef<any>(null);


    function handleTouchStart(event:any) {
        setDistance(0);
    }

    function handleTouchMove(event:any) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const childRect = childRef.current.getBoundingClientRect();
        const delta = event.touches[0].clientY - wrapperRect.top;
    
        if (delta > 0 && childRect.top <= 0 && delta >= 40) {
          event.preventDefault();
          setDistance(delta);
          
          childRef.current.style.transform = `translateY(${delta}px)`;
        }

        if(childRect.top <= 0 ){
            setDistance(0)
        }
    }


    function handleTouchEnd(event:any) {
        if (distance >= 26) {
          setRefreshing(true);
          setTimeout(() => {
            setRefreshing(false);
            childRef.current.style.transition = 'transform 0.3s ease-in-out';
            childRef.current.style.transform = 'translateY(-100%)';
            setTimeout(() => {
              childRef.current.style.transition = '';
              childRef.current.style.transform = '';
            }, 300);
          }, 1000);
        } else {
          childRef.current.style.transition = 'transform 0.3s ease-in-out';
          childRef.current.style.transform = 'translateY(0)';
          setTimeout(() => {
            childRef.current.style.transition = '';
            setDistance(0);
          }, 300);
        }
    }

    return (
        <div 
        ref={wrapperRef}
        className="w-full h-[100vh] bg-white">
            <div 
                ref={childRef}
            
                className="w-full h-[100vh] pull-down-refresh">
                {refreshing ? 'Refreshing...' : 'Pull down to refresh'}
                <div 
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}

                className='fixed top-0 w-full h-[70px] bg-white'></div>
                <div className="content">
                    {props.children}
                </div>
            </div>
        </div>
    )
}