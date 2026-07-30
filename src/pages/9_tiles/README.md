# Drag & Drop Tiles System

A 2D drag-and-drop mechanic in Three.js with snapping and merging functionality built with React Three Fiber.

## Features

- **Drag and Drop**: Click and drag tiles around the 2D plane
- **Auto-Snapping**: Tiles automatically snap together when they get close
- **Merging**: When tiles snap, they merge into a single entity with combined size
- **Real-time Tracking**: Live display of tiles and their properties
- **Visual Feedback**: Selected tiles highlight with emissive glow

## Architecture

### Core Components

1. **tiles.store.ts** - Zustand store managing tile state
   - `Tile` interface with position, size, color, and merged IDs
   - Store methods: add, remove, update position, merge, get

2. **Tile.tsx** - Individual tile component
   - Handles mouse interaction and dragging
   - Raycasting for 3D-to-2D plane projection
   - Snap detection on drag
   - Visual selection state

3. **Tiles.tsx** - Main scene component
   - Canvas setup with Three.js
   - Grid background
   - Info panel showing all tiles
   - Initializes tiles on first render

4. **utils.ts** - Utility functions
   - Snap detection logic
   - Tile generators (grid, circular)
   - Color utilities

## Customization

### Change Snap Distance

Edit `SNAP_DISTANCE` in `Tile.tsx`:

```typescript
const SNAP_DISTANCE = 2; // Adjust this value (in world units)
```

### Customize Initial Layout

In `Tiles.tsx`, modify the initialization:

**Grid layout:**

```typescript
import { generateGridTiles } from "./utils";

// In useEffect:
const tiles = generateGridTiles(4, 4, 3); // 4x4 grid, 3 units spacing
tiles.forEach((tile) => store.addTile(tile));
```

**Circular layout:**

```typescript
import { generateCircularTiles } from "./utils";

const tiles = generateCircularTiles(12, 15); // 12 tiles in circle, radius 15
tiles.forEach((tile) => store.addTile(tile));
```

### Modify Tile Appearance

In `Tile.tsx` mesh section:

```typescript
<boxGeometry args={[currentSize, currentSize, 0.1]} /> {/* Change dimensions */}
<meshStandardMaterial
  color={color}
  metalness={0.5}    {/* Add metallic effect */}
  roughness={0.4}    {/* Add roughness */}
  emissive={isSelected ? 0x444444 : 0x000000}
/>
```

### Add Physics or Constraints

Edit the `handleMouseMove` function in `Tile.tsx` to add:

- Boundary constraints
- Rotation while dragging
- Velocity/momentum effects
- Collision reactions

### Customize Merge Behavior

Modify `store.mergeTiles()` in `tiles.store.ts`:

```typescript
// Current: size grows by Pythagorean theorem
const newSize = Math.sqrt(target.size ** 2 + source.size ** 2);

// Alternative: additive growth
const newSize = target.size + source.size * 0.5;

// Alternative: constant size
const newSize = 1.5;
```

## Usage

1. **Drag** a tile by clicking and holding
2. **Move** the tile near another tile
3. **Snap** occurs automatically when within snap distance
4. **Merged** tiles combine and the source tile disappears
5. **Track** all tiles in the info panel

## Technical Details

- **Raycasting**: Uses Three.js Raycaster for mouse-to-world conversion
- **2D Plane Intersection**: Projects 3D mouse movement onto z=0 plane
- **State Management**: Zustand for reactive tile updates
- **Performance**: Only updates tile being dragged each frame

## Expanding the System

### Add Tile Types

```typescript
interface Tile extends BaseTile {
  type: "normal" | "heavy" | "magnetic";
  properties?: Record<string, any>;
}
```

### Add Snap Rules

```typescript
const canSnap = (source: Tile, target: Tile) => {
  // Custom logic
  return source.type !== "magnetic" || target.type !== "magnetic";
};
```

### Add Animations

Use React Spring or Framer Motion for merge animations when `mergeTiles` is called.

### Add Sound Effects

Play audio when tiles snap or merge in the `checkSnapping` function.
