import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MyWork() {
  return (
    <div className="mt-16 mx-4 lg:mx-8">
      <h2 className="text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-white">
        My Work
      </h2>
      <div className="grid grid-cols-8 gap-6">
        {/* Left Column */}
        <div className="flex flex-col col-span-8 lg:col-span-5 gap-y-6">
          {projectListLeft.map((project, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>

        {/* Right Column */}
        <div className="hidden lg:flex flex-col col-span-3 gap-y-6">
          {projectListRight.map((project, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const projectListLeft = [
  {
    href: "https://zesty-merch.vercel.app",
    src: "/zesty.png",
    alt: "Zesty Merch",
    name: "Zesty Merch",
  },
  {
    href: "https://www.pearlearn.live/",
    src: "/peerlearn.png",
    alt: "Peerlearn",
    name: "Peerlearn",
  },
  {
    href: "https://www.pybrowser.vercel.app/",
    src: "/pybrowser.png",
    alt: "PyBrowser",
    name: "PyBrowser",
  },
];

const projectListRight = [
  {
    href: "https://www.raycast.com/GLaDO8/pie-for-pi-hole#install",
    src: "/images/pie.png",
    alt: "Pie for Pi-hole",
    name: "Pie for Pi-hole",
    isVertical: true,
  },
  {
    href: "https://glado8.notion.site/glado8/An-Amateur-s-Guide-to-Leading-a-Sustainable-Lifestyle-in-India-b5b80a9e97c24ee0bf9c660f75ea9fba",
    src: "/images/sustain-long.svg",
    alt: "Sustainable Lifestyle Guide",
    name: "Sustainable Lifestyle Guide",
    isVertical: true,
  },
  {
    href: "https://ss.ss/writings/dissecting-my-workflow",
    src: "/images/tools.png",
    alt: "Tools and Workflow",
    name: "Tools and Workflow",
  },
];

function ProjectCard({
  href,
  src,
  alt,
  name,
  isVertical = false,
}: {
  href: string;
  src: string;
  alt: string;
  name: string;
  isVertical?: boolean;
}) {
  return (
    <Link href={href} passHref>
      <motion.div
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.02 }}
      >
        <Image
          className="rounded-xl object-cover group-hover:opacity-90 transition-opacity duration-200"
          src={src}
          alt={alt}
          width={isVertical ? 360 : 1600}
          height={isVertical ? 493 : 900}
          sizes="100vw"
          priority={true}
          style={{ width: "100%", height: "auto" }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-xl font-semibold text-white">{name}</p>
        </div>
      </motion.div>
    </Link>
  );
}
