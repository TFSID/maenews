"use client";

import { useState, useEffect } from "react";

export function ReadingProgress() {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            if (scrollHeight > 0) {
                setWidth((scrollTop / scrollHeight) * 100);
            }
        };

        window.addEventListener("scroll", updateProgress, { passive: true });
        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 h-1 bg-primary z-[100] transition-all duration-150"
            style={{ width: `${width}%` }}
        />
    );
}
