/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const AntigravityInner = ({
    count = 300,
    magnetRadius = 10,
    ringRadius = 10,
    waveSpeed = 0.4,
    waveAmplitude = 1,
    particleSize = 2,
    lerpSpeed = 0.1,
    color = '#FF9FFC',
    autoAnimate = false,
    particleVariance = 1,
    rotationSpeed = 0,
    depthFactor = 1,
    pulseSpeed = 3,
    particleShape = 'capsule',
    fieldStrength = 10
}) => {
    const meshRef = useRef(null);
    const { viewport } = useThree();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const lastMousePos = useRef({ x: 0, y: 0 });
    const lastMouseMoveTime = useRef(0);
    const virtualMouse = useRef({ x: 0, y: 0 });

    const particles = useMemo(() => {
        const temp = [];
        const width = viewport.width || 100;
        const height = viewport.height || 100;

        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;

            const x = (Math.random() - 0.5) * width;
            const y = (Math.random() - 0.5) * height;
            const z = (Math.random() - 0.5) * 20;

            const randomRadiusOffset = (Math.random() - 0.5) * 2;

            temp.push({
                t,
                factor,
                speed,
                xFactor,
                yFactor,
                zFactor,
                mx: x,
                my: y,
                mz: z,
                cx: x,
                cy: y,
                cz: z,
                vx: 0,
                vy: 0,
                vz: 0,
                randomRadiusOffset
            });
        }
        return temp;
    }, [count, viewport.width, viewport.height]);

    useFrame(state => {
        const mesh = meshRef.current;
        if (!mesh) return;

        const { viewport: v, pointer: m } = state;

        // Optimization: dX * dX instead of Math.pow
        const mouseDx = m.x - lastMousePos.current.x;
        const mouseDy = m.y - lastMousePos.current.y;
        const mouseDistSq = mouseDx * mouseDx + mouseDy * mouseDy;

        // 0.001 ^ 2 = 0.000001
        if (mouseDistSq > 0.000001) {
            lastMouseMoveTime.current = Date.now();
            lastMousePos.current.x = m.x;
            lastMousePos.current.y = m.y;
        }

        let destX = (m.x * v.width) * 0.5;
        let destY = (m.y * v.height) * 0.5;

        if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
            const time = state.clock.getElapsedTime();
            destX = Math.sin(time * 0.5) * (v.width * 0.25);
            destY = Math.cos(time * 1.0) * (v.height * 0.25);
        }

        const smoothFactor = 0.05;
        virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
        virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

        const targetX = virtualMouse.current.x;
        const targetY = virtualMouse.current.y;

        const globalRotation = state.clock.getElapsedTime() * rotationSpeed;
        const magRadiusSq = magnetRadius * magnetRadius;

        for (let i = 0; i < count; i++) {
            const particle = particles[i];
            let { mx, my, mz, cz, randomRadiusOffset, speed } = particle;

            particle.t += speed * 0.5;
            const t = particle.t;

            const projectionFactor = 1 - cz * 0.02; // cz / 50
            const projectedTargetX = targetX * projectionFactor;
            const projectedTargetY = targetY * projectionFactor;

            const dx = mx - projectedTargetX;
            const dy = my - projectedTargetY;
            const distSq = dx * dx + dy * dy;

            let targetPosX = mx;
            let targetPosY = my;
            let targetPosZ = mz * depthFactor;

            if (distSq < magRadiusSq) {
                const angle = Math.atan2(dy, dx) + globalRotation;

                const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
                const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));

                const currentRingRadius = ringRadius + wave + deviation;

                targetPosX = projectedTargetX + currentRingRadius * Math.cos(angle);
                targetPosY = projectedTargetY + currentRingRadius * Math.sin(angle);
                targetPosZ = mz * depthFactor + Math.sin(t) * (waveAmplitude * depthFactor);
            }

            particle.cx += (targetPosX - particle.cx) * lerpSpeed;
            particle.cy += (targetPosY - particle.cy) * lerpSpeed;
            particle.cz += (targetPosZ - particle.cz) * lerpSpeed;

            dummy.position.set(particle.cx, particle.cy, particle.cz);
            dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
            dummy.rotateX(Math.PI * 0.5);

            // Fast distance calculation
            const pDx = particle.cx - projectedTargetX;
            const pDy = particle.cy - projectedTargetY;
            const currentDistToMouse = Math.sqrt(pDx * pDx + pDy * pDy);

            const distFromRing = Math.abs(currentDistToMouse - ringRadius);
            let scaleFactor = 1 - distFromRing * 0.1; // / 10

            if (scaleFactor < 0) scaleFactor = 0;
            if (scaleFactor > 1) scaleFactor = 1;

            const finalScale = scaleFactor * (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
            dummy.scale.set(finalScale, finalScale, finalScale);

            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }

        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {particleShape === 'capsule' && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
            {particleShape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
            {particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
            {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
            <meshBasicMaterial color={color} />
        </instancedMesh>
    );
};

const Antigravity = props => {
    return (
        <Canvas camera={{ position: [0, 0, 50], fov: 35 }}>
            <AntigravityInner {...props} />
        </Canvas>
    );
};

export default Antigravity;
