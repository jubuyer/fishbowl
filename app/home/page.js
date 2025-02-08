import Image from "next/image"

export default function Page(){
    return (
        <div className="bg-white h-screen flex justify-center items-center text-black">
            <div className="flex flex-col items-center gap-10">
                <Image
                    src="/coral.png"
                    height= {500}
                    width={500}
                    alt="coral"
                />
                <input type="text" placeholder="placeholder" className="w-[50vw] border border-black"></input>
            </div>
        </div>
    )
}