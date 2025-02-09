"use client"
import React from 'react';
import { useUser } from '@clerk/nextjs';

export function Score() {
    const { user } = useUser();
    return (
        <>
            <h1 className="text-3xl font-bold text-center">Score: {user?.unsafeMetadata.points}</h1>
        </>
    )
}