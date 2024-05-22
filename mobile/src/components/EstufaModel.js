import React, { useState } from 'react';
import { Float, Gltf } from '@react-three/drei/native';
import { animated, useSpring } from '@react-spring/three';


import EstufaAberta from '../assets/models/EstufaAberta.glb';
import Estufa from '../assets/models/Estufa.glb';
import { Mesh } from 'three';

export const EstufaModel = (props) => {


    const [rotationEstufaAberta, setRotationEstufaAberta] = useState([0, 5, 0]);
    const [scaleEstufaAberta, setScaleEstufaAberta] = useState([0.065, 0.065, 0.065]);
    const [positionEstufaAberta, setPositionEstufaAberta] = useState([-0.3, -0.45, 0]);

    const [rotationEstufa, setRotationEstufa] = useState([0, 0, 0]);
    const [scaleEstufa, setScaleEstufa] = useState([0.025, 0.025, 0.025]);
    const [positionEstufa, setPositionEstufa] = useState([0, 0.15, 0]);

    const { rotationer } = useSpring({
        from: { rotationer: [-0.3, 1, 0.5] },
        to: { rotationer: [0, 0, 0] },
    });



    return (
        <animated.group rotation={rotationer}>
            <Float
                speed={0}
                rotationIntensity={10}
                floatIntensity={0.5} 
                floatingRange={[-0, 0]}>
                    
                {props.estufaAberta ? (
                    <Gltf src={EstufaAberta} scale={scaleEstufaAberta} position={positionEstufaAberta} rotation={rotationEstufaAberta} />
                ) : (
                    <Gltf src={Estufa} scale={scaleEstufa} position={positionEstufa} rotation={rotationEstufa} />
                )}
            </Float>
        </animated.group>
    );
}