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
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [underlineProps, setUnderlineProps] = useState({
    width: 0,
    left: 0
  });
  const [hovered, setHovered] = useState<string | null>(null);

  const updateUnderline = (href: string) => {
    if (!navRef.current) return;
    
    const navItem = navRef.current.querySelector(`[data-href="${href}"]`) as HTMLElement;
    if (!navItem) return;

    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = navItem.getBoundingClientRect();

    setUnderlineProps({
      width: itemRect.width,
      left: itemRect.left - navRect.left
    });
  };

  useEffect(() => {
    updateUnderline(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => updateUnderline(hovered || pathname);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname, hovered]);

  const handleMouseEnter = (href: string) => {
    setHovered(href);
    updateUnderline(href);
  };

  const handleMouseLeave = () => {
    setHovered(null);
    updateUnderline(pathname);
  };

  return (
    <div className="mt-12 flex flex-col items-center justify-center space-y-6">
      <AnimatePresence mode="wait">
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
          <Link key={item.href} href={item.href}>
            <Button
              data-href={item.href}
              onMouseEnter={() => handleMouseEnter(item.href)}
              onMouseLeave={handleMouseLeave}
              className={`
                relative text-lg shadow-none bg-transparent hover:bg-transparent
                font-medium transition-all duration-200 ease-in-out
                ${pathname === item.href
                  ? 'text-black dark:text-white font-semibold'
                  : 'text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'
                }
              `}
              variant="ghost"
            >
              {item.name}
            </Button>
          </Link>
        ))}

        <motion.div
          className="absolute -bottom-1 h-[2px] bg-neutral-400 dark:bg-neutral-600 rounded-full"
          initial={false}
          animate={{
            width: underlineProps.width,
            x: underlineProps.left,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        />
      </nav>

      <ModeToggle />
    </div>
  );
};

export default Navbar;