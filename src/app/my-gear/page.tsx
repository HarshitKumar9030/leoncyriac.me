'use client'

import React, { useState } from 'react'
import { Laptop, Smartphone, Keyboard, Mouse, RockingChair, Server, Headphones } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

interface GearItem {
  name: string
  description: string
  icon: React.ReactNode
  specs: string[]
  category: 'computer' | 'peripheral' | 'mobile' | 'other'
  funFact: string
}

export default function Gear() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const gearItems: GearItem[] = [
    {
      name: 'MacBook Pro M1',
      description: 'Powerful and efficient laptop for all my development needs.',
      icon: <Laptop className="w-8 h-8" />,
      specs: ['Apple M1 chip', '16GB RAM', '512GB SSD', '13-inch Retina display'],
      category: 'computer',
      funFact: 'This little powerhouse can compile code faster than I can say "Hello, World!"'
    },
    {
      name: 'Dell Latitude 3400',
      description: 'Reliable work laptop for office tasks and light development. Also where I store all my data.',
      icon: <Laptop className="w-8 h-8" />,
      specs: ['Intel Core i5 processor', '16GB RAM', '1TB SSD', '14-inch Full HD display'],
      category: 'computer',
      funFact: 'It\'s seen more coffee spills than a barista on their first day!'
    },
    {
      name: 'OnePlus Nord 4',
      description: 'Feature-packed smartphone for on-the-go productivity and entertainment.',
      icon: <Smartphone className="w-8 h-8" />,
      specs: ['Snapdragon 695 5G', '8GB RAM', '128GB storage', '6.56-inch 120Hz AMOLED display'],
      category: 'mobile',
      funFact: 'It\'s so fast, it finishes loading apps before I even think about opening them!'
    },
    {
      name: 'Dell Wireless Keyboard',
      description: 'Comfortable and responsive keyboard for extended typing sessions.',
      icon: <Keyboard className="w-8 h-8" />,
      specs: ['Wireless connectivity', 'Ergonomic design', 'Long battery life', 'Compatible with Windows and macOS'],
      category: 'peripheral',
      funFact: 'Legend has it, Shakespeare would have written 10 more plays if he had this keyboard!'
    },
    {
      name: "Kreo's Mouse",
      description: 'Precise and ergonomic mouse for improved productivity.',
      icon: <Mouse className="w-8 h-8" />,
      specs: ['Wireless', 'Adjustable DPI', 'Ergonomic design', 'Programmable buttons'],
      category: 'peripheral',
      funFact: 'This mouse has traveled more miles on my desk than I have in my car!'
    },
    {
      name: 'Semi-Gaming Chair',
      description: 'Comfortable chair for long work and gaming sessions.',
      icon: <RockingChair className="w-8 h-8" />,
      specs: ['Adjustable height', 'Lumbar support', 'Breathable mesh back', 'Padded armrests'],
      category: 'other',
      funFact: 'It\'s so comfy, sometimes I forget to get up and stretch!'
    },
    {
      name: 'Raspberry Pi 4',
      description: 'Versatile single-board computer for various projects and experiments.',
      icon: <Server className="w-8 h-8" />,
      specs: ['Quad-core Cortex-A72 (ARM v8) 64-bit SoC @ 1.5GHz', '4GB LPDDR4-3200 SDRAM', 'Dual-band 2.4/5.0 GHz wireless LAN', 'Bluetooth 5.0, BLE'],
      category: 'computer',
      funFact: 'This tiny computer has a bigger imagination than most sci-fi writers!'
    },
    {
      name: 'HyperX Cloud II',
      description: 'High-quality headphones for immersive audio experience during work and gaming.',
      icon: <Headphones className="w-8 h-8" />,
      specs: ['7.1 virtual surround sound', 'Memory foam ear cushions', 'Detachable microphone', 'Multi-platform compatibility'],
      category: 'peripheral',
      funFact: 'These headphones are so good, they make my terrible singing sound almost bearable!'
    }
  ]

  const filteredGearItems = selectedCategory === 'all' 
    ? gearItems 
    : gearItems.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-6xl font-extrabold mb-6 text-neutral-800 dark:text-neutral-100">My Awesome Gear</h1>
          <p className="text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Welcome to my tech playground! Here&apos;s the cool stuff I use for work, development, and entertainment.
          </p>
        </header>

        <Tabs defaultValue="all" className="mb-16">
          <TabsList className="flex justify-center space-x-4 p-1">
            <TabsTrigger value="all" onClick={() => setSelectedCategory('all')} className="px-6 py-3 text-lg font-medium transition-colors duration-200 focus:outline-none">All</TabsTrigger>
            <TabsTrigger value="computer" onClick={() => setSelectedCategory('computer')} className="px-6 py-3 text-lg font-medium transition-colors duration-200 focus:outline-none">Computers</TabsTrigger>
            <TabsTrigger value="peripheral" onClick={() => setSelectedCategory('peripheral')} className="px-6 py-3 text-lg font-medium transition-colors duration-200 focus:outline-none">Peripherals</TabsTrigger>
            <TabsTrigger value="mobile" onClick={() => setSelectedCategory('mobile')} className="px-6 py-3 text-lg font-medium transition-colors duration-200 focus:outline-none">Mobile</TabsTrigger>
            <TabsTrigger value="other" onClick={() => setSelectedCategory('other')} className="px-6 py-3 text-lg font-medium transition-colors duration-200 focus:outline-none">Other</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredGearItems.map((item, index) => (
            <Card 
              key={index} 
              className="bg-white dark:bg-neutral-800 overflow-hidden transition-all duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <CardHeader className="flex flex-row items-center gap-4 p-6">
                <div className="bg-neutral-100 dark:bg-neutral-700 p-3 rounded-full">{item.icon}</div>
                <CardTitle className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">{item.description}</p>
                <ul className="list-disc list-inside text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  {item.specs.map((spec, specIndex) => (
                    <li key={specIndex}>{spec}</li>
                  ))}
                </ul>
                {hoveredItem === item.name && (
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">{item.funFact}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mt-20 text-center">
          <p className="text-neutral-600 dark:text-neutral-400 text-xl">
            That&apos;s all, folks! Thanks for checking out my gear. May your code be bug-free and your coffee always hot! ☕️💻
          </p>
        </footer>
      </div>
    </div>
  )
}