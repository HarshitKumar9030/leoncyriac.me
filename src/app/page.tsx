"use client";

import React, { useState } from "react";
import Image from "next/image";
import Highlight from "@/components/common/Highlight";
import Link from "next/link";

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      <div className="my-8 flex max-w-xl flex-col items-center justify-center space-y-8 mx-auto text-justify">
        {/* Always shows */}
        <div className="text text-base font-light md:text-lg text-gray-700 dark:text-gray-300">
          Hello there! This is Harshit, also known as{" "}
          <Highlight href="https://leoncyriac.me">LeonCyriac</Highlight>.
          I&apos;m a self-taught <Highlight>full-stack developer</Highlight> and
          a student from{" "}
          <Highlight href="https://en.wikipedia.org/wiki/India">
            India
          </Highlight>
          , with a passion for crafting modern web technologies. My journey is
          rooted in a deep fascination for <Highlight>JavaScript</Highlight>,
          exploring the vast landscape of{" "}
          <Highlight>LLMs (Large Language Models)</Highlight>, and creating
          intelligent solutions with{" "}
          <Highlight href="https://openai.com/">AI</Highlight>.
        </div>

        {isExpanded && (
          <>
            <div className="text text-base font-light md:text-lg text-gray-700 dark:text-gray-300">
              My expertise lies in building responsive and high-performance
              applications using{" "}
              <Highlight href="https://nextjs.org/">Next.js</Highlight>,{" "}
              <Highlight href="https://reactjs.org/">React</Highlight>, and{" "}
              <Highlight href="https://tailwindcss.com/">
                Tailwind CSS
              </Highlight>
              . I also have a strong command of{" "}
              <Highlight>TypeScript</Highlight> and{" "}
              <Highlight href="https://nodejs.org/">Node.js</Highlight>,
              enabling me to develop scalable and maintainable solutions. My
              journey began as a curious student, and over time, I have
              sharpened my skills through hands-on projects, continuous
              learning, and active participation in the developer community.
            </div>

            <div className="text text-base font-light md:text-lg text-gray-700 dark:text-gray-300">
              I am driven by the ever-evolving world of technology and
              constantly seek to explore new trends, particularly in{" "}
              <Highlight href="https://www.ibm.com/cloud/learn/machine-learning">
                AI
              </Highlight>{" "}
              and{" "}
              <Highlight href="https://en.wikipedia.org/wiki/Machine_learning">
                machine learning
              </Highlight>
              . I am currently delving into advanced concepts like{" "}
              <Highlight href="https://en.wikipedia.org/wiki/Large_language_model">
                large language models (LLMs)
              </Highlight>{" "}
              and integrating AI-powered features into web applications. My goal
              is to combine aesthetics and functionality to create{" "}
              <Highlight href="https://tailwindcss.com/">
                beautiful applications
              </Highlight>{" "}
              that are both intuitive and powerful.
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-between flex-row w-full">
          <Link href={"https://x.com/OhHarshit"}>
            <button className="mt-4 px-6 py-2 dark:text-black flex items-center text-sm gap-2 font-medium text-neutral-900  bg-neutral-100 cursor-nesw-resize dark:bg-white rounded-lg transition-all duration-300 transform hover:scale-105">
              <span className="w-6 h-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="rgb(0,0,0)"
                  shapeRendering="geometricPrecision"
                  textRendering="geometricPrecision"
                  imageRendering="optimizeQuality"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  viewBox="0 0 512 462.799"
                >
                  <path
                    fillRule="nonzero"
                    d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                  />
                </svg>
              </span>
              Find me on X.
            </button>
          </Link>

          <button
            onClick={toggleExpansion}
            className="mt-4 px-4 py-2 text-sm font-medium text-neutral-900 dark:text-neutral-50 hover:text-neutral-950 hover:dark:text-white p-2 underline underline-offset-1  rounded-lg transition duration-300"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        </div>
      </div>
    </>
  );
}
