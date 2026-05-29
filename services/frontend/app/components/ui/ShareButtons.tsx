"use client";

import { Facebook, Twitter, MessageCircle, Link2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { cn } from "@/app/lib/utils";

interface ShareButtonsProps {
    url: string;
    title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const platforms = [
        { icon: Twitter, href: `https://twitter.com/intent/tweet?url=${url}&text=${title}`, color: "hover:text-[#1DA1F2]" },
        { icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, color: "hover:text-[#4267B2]" },
        { icon: MessageCircle, href: `https://wa.me/?text=${title} ${url}`, color: "hover:text-[#25D366]" },
    ];

    return (
        <div className="flex items-center gap-2">
            {platforms.map((p, i) => (
                <a key={i} href={p.href} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="icon" className={cn("rounded-full h-9 w-9", p.color)}>
                        <p.icon className="h-4 w-4" />
                    </Button>
                </a>
            ))}
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
            </Button>
        </div>
    );
}