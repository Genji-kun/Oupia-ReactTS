import React from 'react';

interface RightMessageProps {
    content: string | null
    image: string | null
}

const RightMessage: React.FC<RightMessageProps> = (props) => {
    const { content, image } = props;
    return (
        <>
            <div className="flex flex-col gap-y-2">
                {content && (
                    <div className="w-fit ml-auto">
                        <div className="py-2 px-3 rounded-xl bg-primary/25 border border-primary/25">
                            {content}
                        </div>
                    </div>
                )}

                {image && (
                    <div className="h-fit flex justify-end items-center">
                        <img className="h-32 rounded-lg" src={image} />
                    </div>
                )}
            </div>


        </>
    );
};

export default RightMessage;
