import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { prototypeParts } from "./prototype-parts";
import "./prototype-viewer.css";

type ViewerCommands = {
  reset: () => void;
  zoom: (factor: number) => void;
  rotate: (angle: number) => void;
};
type NamedMesh = { mesh: THREE.Mesh; baseY: number; id: string; lift: number };

export default function PrototypeViewer() {
  const host = useRef<HTMLDivElement>(null);
  const commands = useRef<ViewerCommands | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [spread, setSpread] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const state = useRef({ selected, spread });
  state.current = { selected, spread };
  const active = prototypeParts.find((p) => p.id === selected);

  useEffect(() => {
    const container = host.current!;
    let disposed = false;
    let visible = true;
    let renderer: THREE.WebGLRenderer;
    setStatus("loading");
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setStatus("error");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.001, 5);
    const target = new THREE.Vector3(0, 0.008, 0.02);
    camera.position.set(0.095, 0.15, 0.185);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 0.085;
    controls.maxDistance = 0.55;
    controls.update();
    scene.add(new THREE.AmbientLight(0xffffff, .7));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x626b73, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 2);
    key.position.set(2, 4, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffe4c8, 0.9);
    fill.position.set(-2, 1, -2);
    scene.add(fill);
    const meshes: NamedMesh[] = [];
    const cleanupModel = (object: THREE.Object3D) =>
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((material) => material.dispose());
        }
      });
    let model: THREE.Object3D | undefined;
    new GLTFLoader().load(
      "/models/bitebud-concept-v1.glb",
      (gltf) => {
        if (disposed) {
          cleanupModel(gltf.scene);
          return;
        }
        model = gltf.scene;
        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          let parent: THREE.Object3D | null = child;
          let part;
          while (parent && !part) {
            part = prototypeParts.find((p) => p.id === parent!.name);
            parent = parent.parent;
          }
          if (!part) return;
          const old = Array.isArray(child.material)
            ? child.material
            : [child.material];
          old.forEach((material) => material.dispose());
          child.material = new THREE.MeshStandardMaterial({
            color: part.color,
            roughness: 0.52,
            metalness: part.id === "08_usb_connector" ? 0.6 : 0.04,
          });
          child.userData.partId = part.id;
          meshes.push({
            mesh: child,
            id: part.id,
            baseY: child.position.y,
            lift: part.lift / 1000,
          });
        });
        scene.add(model);
        setStatus("ready");
      },
      undefined,
      () => {
        if (!disposed) setStatus("error");
      },
    );
    const resize = new ResizeObserver(() => {
      const width = container.clientWidth,
        height = container.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resize.observe(container);
    const visibility = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    });
    visibility.observe(container);
    commands.current = {
      reset: () => {
        camera.position.set(0.095, 0.15, 0.185);
        controls.target.copy(target);
        controls.update();
      },
      zoom: (factor) => {
        const offset = camera.position.clone().sub(controls.target);
        offset.setLength(
          THREE.MathUtils.clamp(
            offset.length() * factor,
            controls.minDistance,
            controls.maxDistance,
          ),
        );
        camera.position.copy(controls.target).add(offset);
        controls.update();
      },
      rotate: (angle) => {
        const offset = camera.position
          .clone()
          .sub(controls.target)
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        camera.position.copy(controls.target).add(offset);
        controls.update();
      },
    };
    let down = { x: 0, y: 0 };
    const onDown = (event: PointerEvent) => {
      down = { x: event.clientX, y: event.clientY };
    };
    const onUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5)
        return;
      const rect = renderer.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      const ray = new THREE.Raycaster();
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObjects(
        meshes.map((p) => p.mesh),
        false,
      )[0];
      setSelected(hit ? hit.object.userData.partId : null);
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    const lost = (event: Event) => {
      event.preventDefault();
      setStatus("error");
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    let previous = performance.now();
    renderer.setAnimationLoop((time) => {
      const dt = Math.min((time - previous) / 1000, 0.05);
      previous = time;
      if (!visible || document.hidden) return;
      for (const item of meshes) {
        const y = item.baseY + item.lift * state.current.spread;
        item.mesh.position.y = THREE.MathUtils.damp(
          item.mesh.position.y,
          y,
          12,
          dt,
        );
        const material = item.mesh.material as THREE.MeshStandardMaterial;
        material.emissive.setHex(
          state.current.selected === item.id ? 0x437b70 : 0x000000,
        );
        material.emissiveIntensity =
          state.current.selected === item.id ? 0.42 : 0;
      }
      controls.update();
      renderer.render(scene, camera);
    });
    return () => {
      disposed = true;
      commands.current = null;
      resize.disconnect();
      visibility.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      if (model) cleanupModel(model);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [attempt]);

  return (
    <div className="prototype-viewer">
      <div className="prototype-stage-column">
        <div className="prototype-toolbar">
          <div className="prototype-view-modes" aria-label="Assembly view">
            <button aria-pressed={spread === 0} onClick={() => setSpread(0)}>
              Assembled
            </button>
            <button aria-pressed={spread > 0} onClick={() => setSpread(1)}>
              Exploded view
            </button>
          </div>
          <button
            onClick={() => {
              setSelected(null);
              setSpread(0);
              commands.current?.reset();
            }}
          >
            Reset view
          </button>
        </div>
        <div className="prototype-stage">
          <div
            ref={host}
            className="prototype-canvas"
            role="img"
            aria-label="Interactive BiteBud concept. Drag to rotate, scroll or pinch to zoom. Use the part list to inspect components with a keyboard."
          />
          {status === "loading" && (
            <div className="prototype-overlay" role="status">
              Loading 3D model…
            </div>
          )}
          {status === "error" && (
            <div className="prototype-overlay">
              <img
                src="/models/bitebud-concept-preview.png"
                alt="Assembled and exploded BiteBud concept showing the sensor in the mouthguard and board in the loop"
              />
              <p>The interactive view could not load.</p>
              <button onClick={() => setAttempt((a) => a + 1)}>
                Try again
              </button>
            </div>
          )}
          <span className="prototype-model-label">BiteBud · Concept 01</span>
          <div
            className="prototype-camera-controls"
            aria-label="Camera controls"
          >
            <button
              aria-label="Rotate left"
              disabled={status !== "ready"}
              onClick={() => commands.current?.rotate(-Math.PI / 8)}
            >
              ↶
            </button>
            <button
              aria-label="Rotate right"
              disabled={status !== "ready"}
              onClick={() => commands.current?.rotate(Math.PI / 8)}
            >
              ↷
            </button>
            <button
              aria-label="Zoom in"
              disabled={status !== "ready"}
              onClick={() => commands.current?.zoom(0.8)}
            >
              +
            </button>
            <button
              aria-label="Zoom out"
              disabled={status !== "ready"}
              onClick={() => commands.current?.zoom(1.25)}
            >
              −
            </button>
          </div>
        </div>
        <div className="prototype-bottom">
          <p>
            Drag to rotate · Scroll or pinch to zoom · Click a part to inspect
          </p>
          <label>
            Separate parts
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={spread}
              onChange={(e) => setSpread(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
      <aside className="prototype-parts-panel" aria-label="Prototype parts">
        <p className="prototype-eyebrow">INSIDE THE PROTOTYPE</p>
        <h3>Every part has a place.</h3>
        <p className="prototype-intro">
          The pressure sensor sits in the mouthguard. The board stays in the
          outside loop.
        </p>
        <div className="prototype-part-list">
          {prototypeParts.map((part, index) => (
            <button
              key={part.id}
              aria-pressed={selected === part.id}
              onClick={() => {
                setSelected(part.id);
                setSpread(1);
              }}
            >
              <span
                className="prototype-swatch"
                style={{ background: part.color }}
              />
              <span>{part.name}</span>
              <small>{String(index + 1).padStart(2, "0")}</small>
            </button>
          ))}
        </div>
        <div className="prototype-description" aria-live="polite">
          <strong>{active?.name ?? "Take a closer look"}</strong>
          <p>
            {active?.description ??
              "Choose a part above to highlight it and open the model. You can also click directly on any visible part."}
          </p>
        </div>
        <p className="prototype-disclaimer">
          Concept model with provisional dimensions and simplified hardware. Not
          validated for baby use.
        </p>
      </aside>
    </div>
  );
}
