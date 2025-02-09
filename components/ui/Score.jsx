"use client"
import React from 'react';
import { useUser } from '@clerk/nextjs';

export function Score() {
    const { user } = useUser();
    return (
        <>
            {console.log(user?.unsafeMetadata.coralPlanted, "coralPlanted")}
            <div className = "flex items-center gap-4">
                <h1 className="text-lg font-bold text-center">Score: {user?.unsafeMetadata.points || 0} </h1>
                <h1 className="text-lg font-bold text-center">Coral Planted: {user?.unsafeMetadata.coralPlanted || 0} </h1>
            </div>
        </>
    )
}