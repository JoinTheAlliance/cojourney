import React from "react";
import Image from "next/image";

export default function AboutCojourney() {
  const infos = [
    {
      title: "A friend who always has time for you.",
      summary: `There are eight billion people. Why is it so hard to find the
      ones you really want to meet? We’re changing this with AI.
      Whether you’re looking for friends, romance, career advice or
      you just want to connect with someone new who cares about what
      you care about, CJ will help you find it.`,
      image: "image 5.png",
    },
    {
      title: "Find what you’re looking for",
      summary: `CJ will help you identify where you are in life, where you want to be and what you need to get there. Along the way she’ll connect you to people she thinks you will have a strong bond with. We’re all on a journey of personal growth, but we don’t have to do it alone!`,
      image: "image 5.png",
    },
    {
      title: "State-of-the-art AI matchmaking",
      summary: `Humans are busy and can’t always be there for you 24/7.
      When you need a friend, CJ is there to talk to you or connect you to someone.`,
      image: "image 5.png",
    },
  ];
  return (
    <div className="bg-[#0D121F] w-full p-8 flex flex-col xl:mx-auto items-center gap-8">
      <h1 className={"mb-8 text-4xl text-white"}>
        Powered by AI. Made for Humanity.
      </h1>
      <div className="bg-[#87888F] rounded-3xl p-8 max-w-7xl w-4/5">
        <div className="flex">
          <Image
            src="/images/profile.png"
            width={70}
            height={70}
            className="w-20 h-20 mr-8"
            alt="profile"
          />
          <div className="flex flex-col justify-around">
            <h1 className="mb-4 text-4xl font-bold">CJ</h1>
            <p>I’m here to help you make the most of your time here.</p>
          </div>
        </div>
      </div>
      {infos.map((info, index) => {
        return (
          <div
            key={index}
            className={`flex ${index % 2 != 0 ? "flex-row-reverse" : ""} flex-wrap  items-center justify-between max-w-7xl w-4/5 mt-16`}
          >
            <div className="flex flex-col items-start gap-6">
              <h1 className="text-[24px] text-white font-semibold">
                {info.title}
              </h1>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2">
                  <p className="text-[#18] font-normal text-white w-[650px] mt-[-2px]">
                    {info.summary}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Image
                src={`/images/${info.image}`}
                height={300}
                width={300}
                alt=""
              />
            </div>
          </div>
        );
      })}
      {/* <div className="flex w-11/12 py-16">
        <div className="w-1/2 mr-16">
          <h1 className="mb-4 font-bold text-white">
            State-of-the-art AI matchmaking
          </h1>
          <p className="text-sm text-white">
            There are eight billion people. Why is it so hard to find the ones
            you really want to meet? We’re changing this with AI. Whether you’re
            looking for friends, romance, career advice or you just want to
            connect with someone new who cares about what you care about, CJ
            will help you find it.
          </p>
        </div>
        <div className="flex w-1/2">
          <Image
            src="/images/image 5.png"
            alt="image"
            width={300}
            height={300}
            // className="w-full"
          />
        </div>
      </div> */}
    </div>
  );
}
