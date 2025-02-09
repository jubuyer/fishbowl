'use client'; 

import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button"
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"


const ChatResponse = ({ response, setShowResponse }) => {
    console.log(response)
    const { user } = useUser()
    const [showButtons, setShowButtons] = useState(true)
    const [currentResponseIndex, setCurrentResponseIndex] = useState(0)
    const [currentResponse, setCurrentResponse] = useState(response[0])

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

    const prevResponse = () => {
        if(currentResponseIndex === 0){
            setCurrentResponseIndex(response.length-1)
            setCurrentResponse(response[response.length-1])
        }else{
            setCurrentResponseIndex(currentResponseIndex-1)
            setCurrentResponse(response[currentResponseIndex-1])

        }
    }

    const nextResponse = () => {
        if(currentResponseIndex === response.length-1){
            setCurrentResponseIndex(0)
            setCurrentResponse(response[0])
        }else{
            setCurrentResponseIndex(currentResponseIndex+1)
            setCurrentResponse(response[currentResponseIndex+1])

        }
    }

    useEffect((response) => {
        setShowButtons(true)
    }, [response])
    return (
        <div
            id="responseDiv"
            className="my-4 p-4 bg-white bg-opacity-25 rounded-lg shadow-lg w-[65vw] border border-gray-200 max-h-[85vh] overflow-y-auto"
        >
            <div className='flex justify-between gap-5'>
                {
                    response.length > 1 && showButtons &&
                    <Button onClick={prevResponse}>
                        <ChevronLeft/>
                    </Button>
                }
                <div>
                    <ReactMarkdown>
                        {currentResponse}
                    </ReactMarkdown>
                </div>
                {
                    response.length > 1 && showButtons &&
                    <Button onClick={nextResponse}>
                        <ChevronRight/>
                    </Button>
                }
            </div>
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