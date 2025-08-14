import React from 'react'
import { useLoader } from '@react-three/fiber'
import { useGLTF, Text } from '@react-three/drei'
import * as THREE from 'three'

export function Frame({ imgLink, rotation, item, ...props }) {
  const { nodes, materials } = useGLTF('./models/items/frame.glb')
  const texture = useLoader(THREE.TextureLoader, imgLink)
  if(item.sold==true){
    return (<></>)
  }else{
    return (
      <group {...props} dispose={null} rotation-y={((rotation || 0) * Math.PI) / 2}>
        <group
          position={[-0.200, 1.786, 0.064]}
          rotation={[Math.PI / 2, 0, -Math.PI / 2]}
          scale={0.855}>
          
          {/* Use the image texture as the material */}
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane002.geometry}
            position={[0.2, 0, 0.4]}
            rotation={[Math.PI, 0, Math.PI]}>
            <meshStandardMaterial map={texture} />
          </mesh>
  
          {/* Keep the frame material unchanged */}
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane002_1.geometry}
            material={materials.frame}
          />
  
          {/* Show "For Auction" text if auctionActive is true */}
{item.auctionActive && (
  <Text
    position={[0.285, 0.5, -0.65]}
    rotation={[-Math.PI / 2, 0, 0]}
    fontSize={0.18}
    color="#ffffff"
    anchorX="center"
    anchorY="middle"
    fontWeight="bold"
  >
    LIVE AUCTION
  </Text>
)}
        </group>
      </group>
    )
  }
}

// Preload the GLTF model
useGLTF.preload('./models/items/frame.glb')
