import React from 'react';

interface LeftMesssageProps {
    content: string | null,
    avatar: string,
    image: string | null
}

const LeftMesssage: React.FC<LeftMesssageProps> = (props) => {

    const { content, avatar, image } = props;

    return (<>
        <div className="w-fit flex gap-3 items-start">
            <div className="z-999 w-10 h-10 rounded-full">
                <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full rounded-full"
                />
            </div>
            <div className="flex flex-col justify-start gap-y-2">
                {content && <p className="py-2 px-3 rounded-xl border border-gray-300 w-fit max-w-[400px] whitespace-normal">{content}</p>
                }
                {image && (
                    <div className="h-fit flex justify-start max-w-[400px] items-center">
                        <img className="h-32 rounded-lg object-contain" src={image} />
                    </div>
                )}
            </div>
        </div>



    </>);

};

export default LeftMesssage;
