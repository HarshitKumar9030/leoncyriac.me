'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ModeToggle } from '../ui/theme-switcher';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Writings', href: '/writings' },
  { name: 'Links', href: '/links' },
];

const Navbar = () => {
  const { theme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [underlineProps, setUnderlineProps] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateUnderlinePosition(pathname);
  }, [pathname]);

  const updateUnderlinePosition = (href: string) => {
    if (typeof window === 'undefined') return; // Guard against SSR

    const element = document.querySelector(`[href="${href}"]`) as HTMLElement;
    const container = navRef.current;

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

  return (
    <div className="mt-12 flex flex-col items-center justify-center space-y-6">
      <AnimatePresence>
        <motion.div
          key={resolvedTheme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={resolvedTheme === 'light' ? '/logo-dark.png' : '/logo-light.png'}
            width={150}
            height={150}
            alt="Logo"
            priority
          />
        </motion.div>
      </AnimatePresence>
      <nav ref={navRef} className="relative flex flex-row gap-8 text-lg">
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
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.name}
            </Button>
          </Link>
        ))}
        <motion.div
          layout
          className="absolute -bottom-1 h-[2px] bg-neutral-400 dark:bg-neutral-600 rounded-full"
          initial={false}
          animate={underlineProps}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        />
      </nav>
      <ModeToggle />
    </div>
  );
};

export default Navbar;