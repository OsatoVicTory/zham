import { useCallback, useEffect } from "react";
import throttle from "lodash.throttle";

const useScrollThrottler = (fn, deps = [], cooldown = 500) => {
    const handleScroll = useCallback(throttle((e) => fn(e), cooldown), []);

    useEffect(() => {
        const ele = document.getElementById('main-scroll');

        if(ele) ele.addEventListener('scroll', handleScroll);

        return () => {
            if(ele) ele.removeEventListener('scroll', handleScroll);
        }
    }, deps);
};

export default useScrollThrottler;