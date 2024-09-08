import React from "react";
import type { CustomLink } from "@/types/types";
import Link from "next/link";
import { Button } from "../ui/button";


export function CustomLink( { link, variant, className, target, children }: CustomLink ) {
    return (
        <>
            <Link href={link} target={target}>
                <Button className={className} variant={variant as any}>
                    {children}
                </Button>
            </Link>
        </>
    )
}