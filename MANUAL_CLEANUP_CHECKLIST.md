# Manual Cleanup Checklist

## Step 1: Move Useful Components to Backup

**First, move these potentially useful components to `backup/components/`:**

✅ **Copy these files from `components/` to `backup/components/`:**
- [ ] SaveLoad.tsx (alternative save/load system)
- [ ] CanvasToolbar.tsx (toolbar component)
- [ ] Toolbar.tsx (generic toolbar)
- [ ] MiniMap.tsx (minimap for canvas)
- [ ] ZoomControls.tsx (zoom functionality)
- [ ] KeyboardShortcuts.tsx (keyboard shortcuts)
- [ ] FileDropZone.tsx (file drop functionality)

## Step 2: Move Duplicate ReactFlow Files to Backup

**Move these from `src/app/` to `backup/src/`:**
- [ ] ReactFlowCanvas-clean.tsx
- [ ] ReactFlowCanvas-final.tsx  
- [ ] ReactFlowCanvas_working.tsx

## Step 3: Delete Unused Components

**Delete these files from `components/` folder:**

### Canvas Components (Delete):
- [ ] AdvancedCanvasControls.tsx ⚠️ (currently open - close first)
- [ ] AICanvas.tsx
- [ ] Canvas.tsx
- [ ] TldrawCanvas.tsx
- [ ] TldrawCanvas-new.tsx

### Node Components (Delete):
- [ ] AINodeCard.tsx (redundant - you have ReactFlowNodeCard)
- [ ] Node.tsx (redundant)
- [ ] EnhancedNode.tsx (redundant)
- [ ] OutputNodeCard.tsx (redundant)
- [ ] DraggableNode.tsx (redundant)

### Edge Components (Delete):
- [ ] Edge.tsx (redundant - you have ReactFlowAnimatedEdge)
- [ ] EdgeLabel.tsx (redundant)

### UI/Menu Components (Delete):
- [ ] AIContextMenu.tsx
- [ ] AIToolbar.tsx
- [ ] ConnectionTester.tsx
- [ ] ContextMenu.tsx
- [ ] FeatureShowcase.tsx
- [ ] NodeEditor.tsx
- [ ] NodeInspector.tsx
- [ ] NodeTemplates.tsx
- [ ] SelectionTools.tsx
- [ ] SimpleNodeCreator.tsx

## Step 4: Delete Unused App Files

**Delete these files:**
- [ ] App.tsx (root level)
- [ ] src/app/AINode.tsx
- [ ] src/app/page-ai-canvas.tsx
- [ ] src/app/home-redirect.tsx
- [ ] src/app/page_trigger.txt
- [ ] app/page.tsx (if it exists)

## Step 5: Delete Cleanup Scripts

**Delete these cleanup scripts:**
- [ ] cleanup.bat
- [ ] remove_pages.bat
- [ ] clear-storage.js
- [ ] smart_cleanup.bat ⚠️ (currently open - close first)
- [ ] cleanup_files.bat

## Step 6: Delete Unused Directories

**Delete these entire folders (if they exist):**
- [ ] app_new/
- [ ] backend/
- [ ] src/app/ai-canvas/

## ✅ KEEP These Essential Files:

**Main Working Files:**
- ✅ src/app/ReactFlowCanvas.tsx
- ✅ components/ReactFlowNodeCard.tsx
- ✅ components/ReactFlowAnimatedEdge.tsx
- ✅ components/ReactFlowConnectionLine.tsx
- ✅ components/NodeCard.tsx
- ✅ components/ui/ (entire folder)

**Config Files:**
- ✅ package.json
- ✅ next.config.js
- ✅ tsconfig.json
- ✅ tailwind.config.js
- ✅ postcss.config.js

## Progress Tracker:
- [ ] Step 1: Backup useful components (7 files)
- [ ] Step 2: Backup duplicate ReactFlow files (3 files)
- [ ] Step 3: Delete unused components (~20 files)
- [ ] Step 4: Delete unused app files (~5 files)
- [ ] Step 5: Delete cleanup scripts (~5 files)
- [ ] Step 6: Delete unused directories (~3 folders)

**Total files to clean: ~40 files and folders**

## After Cleanup:
Your project will have:
- Clean, focused file structure
- Only working ReactFlow components
- Useful components safely backed up
- All functionality preserved (delete buttons, export/import, etc.)

## Notes:
- Close any open files in VS Code before deleting them
- You can always restore from backup if needed
- The main ReactFlow app will continue working perfectly
