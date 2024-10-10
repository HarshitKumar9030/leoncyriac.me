"use client"

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Sky,
  Stars,
  Html,
} from '@react-three/drei'
import { Physics, useBox, usePlane } from '@react-three/cannon'
import { EffectComposer, Bloom, DepthOfField, SSAO } from '@react-three/postprocessing'
import * as THREE from 'three'
import { create } from 'zustand'

// Game constants
const TRACK_RADIUS = 100
const TRACK_WIDTH = 20
const NUM_SEGMENTS = 200
const RACE_LAPS = 3

// Zustand store for game state management
const useGameStore = create((set) => ({
  lap: 1,
  speed: 0,
  position: [0, 0, 0],
  raceComplete: false,
  leaderboard: [],
  setLap: (lap) => set({ lap }),
  setSpeed: (speed) => set({ speed }),
  setPosition: (position) => set({ position }),
  setRaceComplete: (status) => set({ raceComplete: status }),
  updateLeaderboard: (entry) =>
    set((state) => ({ leaderboard: [...state.leaderboard, entry].sort((a, b) => a.time - b.time) })),
}))

// Vehicle Component
function Vehicle({ isPlayer = false, position = [TRACK_RADIUS, 1, 0], color = 'red', aiDifficulty = 0.5 }) {
  const meshRef = useRef()
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    rotation: [0, Math.PI / 2, 0],
    args: [2, 1, 4],
    angularDamping: 0.5,
    linearDamping: 0.5,
  }))
  const { camera } = useThree()
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false })
  const { lap, setLap, setSpeed, setPosition, setRaceComplete, raceComplete, updateLeaderboard } = useGameStore()
  const [checkpointsPassed, setCheckpointsPassed] = useState(0)
  const [raceTime, setRaceTime] = useState(0)
  const startTime = useRef(Date.now())

  useEffect(() => {
    if (!isPlayer) return

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
      }
      if (e.key === 'ArrowUp') setMovement((m) => ({ ...m, forward: true }))
      if (e.key === 'ArrowDown') setMovement((m) => ({ ...m, backward: true }))
      if (e.key === 'ArrowLeft') setMovement((m) => ({ ...m, left: true }))
      if (e.key === 'ArrowRight') setMovement((m) => ({ ...m, right: true }))
    }

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
      }
      if (e.key === 'ArrowUp') setMovement((m) => ({ ...m, forward: false }))
      if (e.key === 'ArrowDown') setMovement((m) => ({ ...m, backward: false }))
      if (e.key === 'ArrowLeft') setMovement((m) => ({ ...m, left: false }))
      if (e.key === 'ArrowRight') setMovement((m) => ({ ...m, right: false }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isPlayer])

  useFrame((state, delta) => {
    if (!meshRef.current || raceComplete) return

    const velocity = new THREE.Vector3()
    api.velocity.subscribe((v) => velocity.fromArray(v))
    const speed = velocity.length()
    setSpeed(Math.round(speed * 20))

    const position = meshRef.current.position
    const rotation = meshRef.current.rotation

    const forceMagnitude = isPlayer ? 150 : 100 * aiDifficulty
    const torqueMagnitude = 15

    if (isPlayer) {
      if (movement.forward) {
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(meshRef.current.quaternion)
        api.applyForce(forward.multiplyScalar(forceMagnitude).toArray(), [0, 0, 0])
      }
      if (movement.backward) {
        const backward = new THREE.Vector3(0, 0, 1).applyQuaternion(meshRef.current.quaternion)
        api.applyForce(backward.multiplyScalar(forceMagnitude).toArray(), [0, 0, 0])
      }
      if (movement.left) {
        api.applyTorque([0, torqueMagnitude, 0])
      }
      if (movement.right) {
        api.applyTorque([0, -torqueMagnitude, 0])
      }

      // Update camera position
      const cameraOffset = new THREE.Vector3(0, 5, 10).applyQuaternion(meshRef.current.quaternion)
      camera.position.lerp(meshRef.current.position.clone().add(cameraOffset), 0.1)
      camera.lookAt(meshRef.current.position)
    } else {
      // Advanced AI Logic
      const targetAngle = Math.atan2(position.z, position.x) + Math.PI / 2
      const angleDifference = targetAngle - rotation.y
      api.applyTorque([0, angleDifference * torqueMagnitude * aiDifficulty, 0])

      // Apply forward force
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(meshRef.current.quaternion)
      api.applyForce(forward.multiplyScalar(forceMagnitude).toArray(), [0, 0, 0])
    }

    // Keep the vehicle on the track
    const distanceFromCenter = Math.sqrt(position.x ** 2 + position.z ** 2)
    if (Math.abs(distanceFromCenter - TRACK_RADIUS) > TRACK_WIDTH / 2) {
      const angle = Math.atan2(position.z, position.x)
      api.position.set(Math.cos(angle) * TRACK_RADIUS, position.y, Math.sin(angle) * TRACK_RADIUS)
    }

    // Check for lap completion and checkpoints
    const angle = (Math.atan2(position.z, position.x) + Math.PI * 2) % (Math.PI * 2)
    const segment = Math.floor(angle / (Math.PI * 2 / NUM_SEGMENTS))

    if (segment === 0 && checkpointsPassed >= NUM_SEGMENTS - 1) {
      setLap(lap + 1)
      setCheckpointsPassed(0)
      if (lap + 1 > RACE_LAPS) {
        setRaceComplete(true)
        setRaceTime((Date.now() - startTime.current) / 1000)
        updateLeaderboard({ color, time: (Date.now() - startTime.current) / 1000 })
      }
    } else if (segment === (checkpointsPassed + 1) % NUM_SEGMENTS) {
      setCheckpointsPassed(segment)
    }

    // Update player's position
    setPosition(meshRef.current.position.toArray())
  })

  return (
    <group ref={(mesh) => { meshRef.current = mesh; ref.current = mesh }} castShadow>
      <mesh castShadow>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Wheels */}
      {[[-0.9, -0.5, 1.5], [0.9, -0.5, 1.5], [-0.9, -0.5, -1.5], [0.9, -0.5, -1.5]].map((pos, idx) => (
        <mesh key={idx} position={pos} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      ))}
    </group>
  )
}

// Track Component
function Track() {
  const trackRef = useRef()

  // Create a circular track using TubeGeometry
  const curve = useMemo(() => {
    return new THREE.Curve()
  }, [])

  curve.getPoint = (t) => {
    const angle = t * Math.PI * 2
    const x = Math.cos(angle) * TRACK_RADIUS
    const z = Math.sin(angle) * TRACK_RADIUS
    return new THREE.Vector3(x, 0, z)
  }

  const trackGeometry = new THREE.TubeGeometry(curve, NUM_SEGMENTS, TRACK_WIDTH / 2, 20, true)
  const trackMaterial = new THREE.MeshStandardMaterial({ color: '#555', side: THREE.DoubleSide })

  return (
    <group ref={trackRef}>
      <mesh geometry={trackGeometry} material={trackMaterial} receiveShadow />
    </group>
  )
}

// Trees and Environment
function Trees() {
  const treePositions = useMemo(() => {
    const positions = []
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = TRACK_RADIUS + TRACK_WIDTH + 10 + Math.random() * 50
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      positions.push([x, 0, z])
    }
    return positions
  }, [])

  return (
    <group>
      {treePositions.map((position, index) => (
        <Tree key={index} position={position} />
      ))}
    </group>
  )
}

function Tree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 5, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 6, 0]} castShadow>
        <sphereGeometry args={[2, 8, 8]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  )
}

// Heads-Up Display (HUD)
function HUD() {
  const lap = useGameStore((state) => state.lap)
  const speed = useGameStore((state) => state.speed)
  const raceComplete = useGameStore((state) => state.raceComplete)
  const leaderboard = useGameStore((state) => state.leaderboard)

  return (
    <div className="absolute top-4 left-4 text-white">
      {!raceComplete ? (
        <>
          <div className="text-2xl">Lap: {lap} / {RACE_LAPS}</div>
          <div className="text-2xl">Speed: {speed} km/h</div>
        </>
      ) : (
        <div className="text-2xl">Race Complete!</div>
      )}
      {/* Leaderboard */}
      {raceComplete && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Leaderboard</h2>
          <ul>
            {leaderboard.map((entry, index) => (
              <li key={index}>
                {index + 1}. {entry.color} - {entry.time.toFixed(2)}s
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Main Game Component
export default function UltimateCarRacingGame() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows camera={{ position: [0, 15, 30], fov: 60 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 50, 0]} intensity={1} castShadow />
        <Stars />
        <Physics allowSleep={false} gravity={[0, -9.81, 0]}>
          {/* Player Vehicle */}
          <Vehicle isPlayer={true} color="red" />
          {/* AI Vehicles */}
          <Vehicle position={[TRACK_RADIUS, 1, 10]} color="blue" aiDifficulty={0.8} />
          <Vehicle position={[TRACK_RADIUS + 10, 1, 0]} color="green" aiDifficulty={0.7} />
          <Vehicle position={[TRACK_RADIUS - 10, 1, -10]} color="yellow" aiDifficulty={0.6} />
          {/* Environment */}
          <Track />
          <Trees />
          {/* Ground Plane */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2000, 2000]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </Physics>
        {/* Effects */}
        <EffectComposer>
          <DepthOfField focusDistance={0.01} focalLength={0.2} bokehScale={2} />
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
          <SSAO samples={31} radius={20} intensity={20} luminanceInfluence={0.6} color="black" />
        </EffectComposer>
      </Canvas>
      {/* Heads-Up Display */}
      <HUD />
    </div>
  )
}
