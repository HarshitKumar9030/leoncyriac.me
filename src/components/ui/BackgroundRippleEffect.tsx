"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface PatternProps {
  className?: string
  cellClassName?: string
  rows?: number
  columns?: number
  cellSize?: number
  hoverColor?: string
  clickColor?: string
}

const BackgroundCellCore: React.FC<PatternProps> = ({
  rows = 30,
  columns = 47,
  cellSize = 48,
  hoverColor = "rgba(14,165,233,0.3)",
  clickColor = "rgba(14,165,233,0.6)",
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
    }
  }

  const size = 300

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 h-full overflow-hidden"
    >
      <div className="absolute inset-y-0 h-[20rem] overflow-hidden">
        <div className="pointer-events-none absolute -bottom-2 z-40 h-full w-full bg-slate-950 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
        <div
          className="absolute inset-0 z-20 bg-transparent"
          style={{
            maskImage: `radial-gradient(${size / 4}px circle at center, white, transparent)`,
            WebkitMaskImage: `radial-gradient(${
              size / 4
            }px circle at center, white, transparent)`,
            WebkitMaskPosition: `${mousePosition.x - size / 2}px ${
              mousePosition.y - size / 2
            }px`,
            WebkitMaskSize: `${size}px`,
            maskSize: `${size}px`,
            pointerEvents: "none",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          <Pattern
            cellClassName="border-blue-600 relative z-[100]"
            rows={rows}
            columns={columns}
            cellSize={cellSize}
            hoverColor={hoverColor}
            clickColor={clickColor}
          />
        </div>
        <Pattern
          className="opacity-[0.5]"
          cellClassName="border-neutral-700"
          rows={rows}
          columns={columns}
          cellSize={cellSize}
          hoverColor={hoverColor}
          clickColor={clickColor}
        />
      </div>
    </div>
  )
}

const Pattern: React.FC<PatternProps> = ({
  className,
  cellClassName,
  rows = 30,
  columns = 47,
  cellSize = 48,
  hoverColor = "rgba(14,165,233,0.3)",
  clickColor = "rgba(14,165,233,0.6)",
}) => {
  const [clickedCell, setClickedCell] = useState<[number, number] | null>(null)
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null)

  const matrix = useMemo(
    () =>
      Array.from({ length: columns }, (_, i) =>
        Array.from({ length: rows }, (_, j) => [i, j])
      ),
    [rows, columns]
  )

  return (
    <div className={cn("relative z-30 flex flex-row", className)}>
      {matrix.map((row, rowIdx) => (
        <div
          key={`matrix-row-${rowIdx}`}
          className="relative z-20 flex flex-col border-b"
        >
          {row.map((_, colIdx) => (
            <Cell
              key={`matrix-col-${colIdx}`}
              rowIdx={rowIdx}
              colIdx={colIdx}
              clickedCell={clickedCell}
              setClickedCell={setClickedCell}
              hoveredCell={hoveredCell}
              setHoveredCell={setHoveredCell}
              cellClassName={cellClassName}
              cellSize={cellSize}
              hoverColor={hoverColor}
              clickColor={clickColor}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface CellProps {
  rowIdx: number
  colIdx: number
  clickedCell: [number, number] | null
  setClickedCell: React.Dispatch<React.SetStateAction<[number, number] | null>>
  hoveredCell: [number, number] | null
  setHoveredCell: React.Dispatch<React.SetStateAction<[number, number] | null>>
  cellClassName?: string
  cellSize: number
  hoverColor: string
  clickColor: string
}

const Cell: React.FC<CellProps> = ({
  rowIdx,
  colIdx,
  clickedCell,
  setClickedCell,
  hoveredCell,
  setHoveredCell,
  cellClassName,
  cellSize,
  hoverColor,
  clickColor,
}) => {
  const controls = useAnimation()

  useEffect(() => {
    if (clickedCell) {
      const distance = Math.sqrt(
        Math.pow(clickedCell[0] - rowIdx, 2) + Math.pow(clickedCell[1] - colIdx, 2)
      )
      controls.start({
        opacity: [0, 1 - distance * 0.1, 0],
        scale: [1, 1.2, 1],
        transition: { duration: distance * 0.2 },
      })
    }
  }, [clickedCell, rowIdx, colIdx, controls])

  const isHovered = hoveredCell && hoveredCell[0] === rowIdx && hoveredCell[1] === colIdx

  return (
    <div
      className={cn(
        "border-l border-b border-neutral-600 bg-transparent",
        cellClassName
      )}
      style={{ width: cellSize, height: cellSize }}
      onClick={() => setClickedCell([rowIdx, colIdx])}
      onMouseEnter={() => setHoveredCell([rowIdx, colIdx])}
      onMouseLeave={() => setHoveredCell(null)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
            style={{ backgroundColor: hoverColor }}
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={controls}
        className="h-full w-full"
        style={{ backgroundColor: clickColor }}
      />
    </div>
  )
}

export default BackgroundCellCore;