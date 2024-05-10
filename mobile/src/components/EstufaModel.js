import React, { useState } from 'react';
import { Float, Gltf } from '@react-three/drei/native';
import { animated, useSpring } from '@react-spring/three';

import Bread from '../assets/models/Bread_Slice_Bread_0.glb';
import { Mesh } from 'three';

export const EstufaModel = (props) => {
    const [rotation, setRotation] = useState([0, 0, 0]);
    const [scale, setScale] = useState([6, 12, 6]);
    const [position, setPosition] = useState([0, 0, 0]);

    const { rotationer } = useSpring({
        from: { rotationer: [0, 0, 0] },
        to: { rotationer: [1, 1, 1] },
    });



    return (
        <animated.group rotation={rotationer}>
            <Float
                speed={1}
                rotationIntensity={10}
                floatIntensity={0.5} 
                floatingRange={[-0.2, 0.2]}>
                    
                <Gltf src={Bread} scale={scale} position={position} rotation={rotation} />
            </Float>
        </animated.group>
    );
}