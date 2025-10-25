import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    Tawk_API?: any;
  }
}

function AvatarModel({ url, fiber, drei }: { url: string; fiber: any; drei: any }) {
  const { useFrame } = fiber;
  const { useGLTF, Html } = drei;
  // @ts-ignore - useGLTF returns a generic GLTF type
  const { scene } = useGLTF(url, true);
  const group = useRef<any>(null);

  useFrame((state: any) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 1.3) * 0.05;
    group.current.rotation.y = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} position={[0, -0.6, 0]} />
      {/* Typing dots overlay */}
      <Html position={[0, -0.33, 0.43]} center>
        <div className="flex gap-0.5">
          <span className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
          <span className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
          <span className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
      </Html>
    </group>
  );
}

export const Tawk3DLauncher = () => {
  const { getSetting } = useWebsiteSettings();
  const location = useLocation();
  const [r3f, setR3f] = useState<any>(null);
  const [drei, setDrei] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);

  const { enabled, url } = useMemo(() => {
    const chatEnabled = getSetting('tawk_enabled', true);
    const use3D = getSetting('tawk_3d_enabled', false);
    const modelUrl = getSetting('tawk_avatar_url', '');
    return { enabled: chatEnabled && use3D && !!modelUrl, url: modelUrl as string };
  }, [getSetting]);

  const isAdmin = location.pathname.startsWith('/admin');
  const shouldShow = enabled && !!url && !isAdmin;

  useEffect(() => {
    if (!shouldShow) return;
    let mounted = true;
    Promise.all([
      import(/* @vite-ignore */ '@react-three/fiber'),
      import(/* @vite-ignore */ '@react-three/drei')
    ])
      .then(([fiber, dreiModules]) => {
        if (!mounted) return;
        setR3f(fiber);
        setDrei(dreiModules);
      })
      .catch(() => {
        if (!mounted) return;
        setLoadError(true);
      });
    return () => { mounted = false; };
  }, [shouldShow]);

  if (!shouldShow) return null;

  const openChat = () => {
    try {
      if (window.Tawk_API?.maximize) {
        window.Tawk_API.showWidget?.();
        window.Tawk_API.maximize();
        return;
      }
    } catch {}
    try { window.Tawk_API?.showWidget?.(); } catch {}
  };

  // Fallback simple launcher if 3D libraries are unavailable
  if (loadError || !r3f || !drei) {
    return (
      <button
        onClick={openChat}
        aria-label="Open live chat"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg border border-white/10 hover:scale-105 transition-all">
          <span className="text-white text-sm font-medium">Chat</span>
        </div>
        <span className="sr-only">Chat with support</span>
      </button>
    );
  }

  const Canvas = r3f.Canvas;
  return (
    <div
      onClick={openChat}
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
      aria-label="Open live chat"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl border border-white/10 bg-gradient-to-b from-black/40 to-black/10 backdrop-blur">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.6, 1.8], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 2, 2]} intensity={0.8} />
          <AvatarModel url={url} fiber={r3f} drei={drei} />
          {/* Mini keyboard indicator */}
          <mesh position={[0, -0.5, 0.4]} scale={[0.6, 0.05, 0.2]}>
            <boxGeometry />
            <meshStandardMaterial color="#ffffff" emissive="#ff7a1a" emissiveIntensity={0.1} />
          </mesh>
        </Canvas>
      </div>
      <div className="mt-2 text-xs text-center text-white/90">Chat</div>
    </div>
  );
};

export default Tawk3DLauncher;


