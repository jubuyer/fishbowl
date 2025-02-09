'use client'; 

import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button"
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from "react"

const ChatResponse = ({ response, setShowResponse }) => {
    const { user } = useUser()
    const [showButtons, setShowButtons] = useState(true)
    const acceptedResponse = () => {
        const {searchCount , points} = user.unsafeMetadata
        user?.update({unsafeMetadata : { points : points + 10, searchCount : searchCount + 1}})
        console.log(user?.unsafeMetadata.points)
        setShowButtons(false)

    }
    
    const regenerateResponse = () => {
        const {searchCount , points} = user.unsafeMetadata
        user?.update({unsafeMetadata : { points : points - 10, searchCount : searchCount + 1}})
        console.log(user?.unsafeMetadata.points)
    }

    useEffect((response) => {
        setShowButtons(true)
    }, [response])
    return (
        <div
            id="responseDiv"
            className="my-4 p-4 bg-white bg-opacity-75 rounded-lg shadow-lg w-[50vw] border border-gray-200"
        >
            <ReactMarkdown>
                {response}
            </ReactMarkdown>
            <br/>
            {   showButtons &&
                <div className='flex gap-2 justify-end'>
                    <Button onClick={acceptedResponse} >Accept Cached</Button>
                    <Button onClick={regenerateResponse} variant="destructive">Regenerate</Button>
                </div>
            }
        </div>
    );
};

export default ChatResponse