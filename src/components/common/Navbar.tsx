'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ModeToggle } from '../ui/theme-switcher';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [underlineProps, setUnderlineProps] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Writings', href: '/writings' },
    { name: 'Links', href: '/links' },
  ];

  useEffect(() => {
    // Mark the component as mounted to avoid hydration issues
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      updateUnderlinePosition(pathname);
    }
  }, [pathname, isMounted]);

  const updateUnderlinePosition = (href: string) => {
    const element = document.querySelector(`[href="${href}"]`) as HTMLElement;
    const container = document.querySelector('.relative') as HTMLElement;

    if (element && container) {
      const { left, width } = element.getBoundingClientRect();
      const containerLeft = container.getBoundingClientRect().left;
      setUnderlineProps({
        left: left - containerLeft,
        width,
      });
    }
  };

  const handleMouseEnter = (href: string) => {
    setHovered(href);
    updateUnderlinePosition(href);
  };

  const handleMouseLeave = () => {
    setHovered(null);
    updateUnderlinePosition(pathname);
  };

  if (!isMounted) return null; // Prevents rendering during SSR

  return (
    <div className="mt-12 flex flex-col items-center justify-center space-y-6">
      <Image
        src={theme === 'dark' ? '/logo-light.png' : '/logo-dark.png'}
        width={150}
        height={150}
        alt="Logo"
        priority
      />
      <div className="relative flex flex-row gap-8 text-lg">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              onMouseEnter={() => handleMouseEnter(item.href)}
              onMouseLeave={handleMouseLeave}
              className={`relative text-lg shadow-none bg-transparent font-medium transition-all duration-200 ease-in-out ${
                pathname === item.href
                  ? 'text-black dark:text-white font-semibold'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {item.name}
            </Button>
          </Link>
        ))}
        <motion.div
          layoutId="underline"
          className="absolute -bottom-1 h-[2px] bg-neutral-400 dark:bg-neutral-600 rounded-full"
          initial={false}
          animate={underlineProps}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        />
      </div>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
