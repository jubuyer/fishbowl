'use client'; 

import ReactMarkdown from 'react-markdown';

const ChatResponse = ({ response }) => {
    return (
        <div
            id="responseDiv"
            className="my-4 p-4 bg-white bg-opacity-75 rounded-lg shadow-lg w-[50vw] border border-gray-200"
        >
            <ReactMarkdown>
                {response}
            </ReactMarkdown>
        </div>
    );
};

export default ChatResponse