"use client"
import React from 'react';
import { useUser } from '@clerk/nextjs';

export function Score() {
    const { user } = useUser();
    return (
        <>
            <h1 className="text-lg font-bold text-center">Score: {user?.unsafeMetadata.points}</h1>
        </>
    )
}