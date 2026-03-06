import React, { useState, useRef, useEffect } from 'react';
import { Server, Shield, Router, Plus, Minus, Trash2, Unplug, Activity, Cpu, Settings, ZoomIn, ZoomOut, Download, Upload, Image as ImageIcon, Layers, Wifi, Monitor, HardDrive, AlertTriangle, Save, Zap, ZapOff, Video, Phone, X, Edit2, MoreVertical, PanelLeftClose, PanelLeftOpen, ChevronDown, ChevronUp, Copy, Table, Eye, FileText, SquareDashed, MousePointer2, BoxSelect, Undo, Redo, Cable, Box, StickyNote, Move } from 'lucide-react';

const DEVICE_MODELS = {
  SW12: { type: 'SW', name: 'Коммутатор 12P', ports: { eth: 12, sfp: 2, sfpPlus: 0, sfp28: 0 }, poeBudget: 120, poePerPort: 30, poeDraw: 0, color: 'bg-blue-500' },
  SW24: { type: 'SW', name: 'Коммутатор 24P', ports: { eth: 24, sfp: 4, sfpPlus: 0, sfp28: 0 }, poeBudget: 370, poePerPort: 30, poeDraw: 0, color: 'bg-indigo-500' },
  SW48: { type: 'SW', name: 'Коммутатор 48P', ports: { eth: 48, sfp: 0, sfpPlus: 4, sfp28: 0 }, poeBudget: 740, poePerPort: 30, poeDraw: 0, color: 'bg-violet-500' },
  ROUTER: { type: 'ROUTER', name: 'Роутер', ports: { eth: 4, sfp: 2, sfpPlus: 0, sfp28: 0 }, poeBudget: 0, poePerPort: 0, poeDraw: 0, color: 'bg-emerald-500' },
  FW: { type: 'FW', name: 'МСЭ', ports: { eth: 6, sfp: 2, sfpPlus: 0, sfp28: 0 }, poeBudget: 0, poePerPort: 0, poeDraw: 0, color: 'bg-rose-500' },
  AP: { type: 'AP', name: 'Точка доступа', ports: { eth: 1, sfp: 0, sfpPlus: 0, sfp28: 0 }, poeBudget: 0, poePerPort: 0, poeDraw: 15, color: 'bg-sky-500' },
  PC: { type: 'PC', name: 'Компьютер', ports: { eth: 1, sfp: 0, sfpPlus: 0, sfp28: 0 }, poeBudget: 0, poePerPort: 0, poeDraw: 0, color: 'bg-slate-500' },
  SERVER: { type: 'SERVER', name: 'Сервер', ports: { eth: 2, sfp: 0, sfpPlus: 4, sfp28: 0 }, poeBudget: 0, poePerPort: 0, poeDraw: 0, color: 'bg-zinc-700' },
  CAMERA: { type: 'CAMERA', name: 'IP Камера', ports: { eth: 1, sfp: 0, sfpPlus: 0, sfp28: 0 }, poeBudget: 0, poePerPort: 0, poeDraw: 10, color: 'bg-teal-500' },
  PHONE: { type: 'PHONE', name: 'IP Телефон', ports: { eth: 1, sfp: 0, sfpPlus: 0, sfp28: 0 }, poeBudget: 0, poePerPort: 0, poeDraw: 7, color: 'bg-cyan-500' },
};

const PORT_LABELS = { eth: 'Eth', sfp: 'SFP', sfpPlus: 'SFP+', sfp28: 'SFP28' };
const PORT_COLORS = { eth: '#10b981', sfp: '#3b82f6', sfpPlus: '#8b5cf6', sfp28: '#ec4899' };
const ICONS = { SW: Server, ROUTER: Router, FW: Shield, AP: Wifi, PC: Monitor, SERVER: HardDrive, CAMERA: Video, PHONE: Phone, OTHER: Box };

const TYPE_NAMES = {
  SW: 'Коммутатор', ROUTER: 'Роутер', FW: 'МСЭ', AP: 'Точка доступа',
  PC: 'Компьютер', SERVER: 'Сервер', CAMERA: 'Камера', PHONE: 'IP Телефон', OTHER: 'Другое'
};

const ZONE_THEMES = {
  indigo: { bg: 'bg-indigo-50/40', border: 'border-indigo-300', header: 'bg-indigo-100/80', text: 'text-indigo-800', handle: 'text-indigo-500 hover:text-indigo-700 bg-indigo-200/30 hover:bg-indigo-200/80', resize: 'bg-indigo-300' },
  rose: { bg: 'bg-rose-50/40', border: 'border-rose-300', header: 'bg-rose-100/80', text: 'text-rose-800', handle: 'text-rose-500 hover:text-rose-700 bg-rose-200/30 hover:bg-rose-200/80', resize: 'bg-rose-300' },
  emerald: { bg: 'bg-emerald-50/40', border: 'border-emerald-300', header: 'bg-emerald-100/80', text: 'text-emerald-800', handle: 'text-emerald-500 hover:text-emerald-700 bg-emerald-200/30 hover:bg-emerald-200/80', resize: 'bg-emerald-300' },
  blue: { bg: 'bg-blue-50/40', border: 'border-blue-300', header: 'bg-blue-100/80', text: 'text-blue-800', handle: 'text-blue-500 hover:text-blue-700 bg-blue-200/30 hover:bg-blue-200/80', resize: 'bg-blue-300' },
  purple: { bg: 'bg-purple-50/40', border: 'border-purple-300', header: 'bg-purple-100/80', text: 'text-purple-800', handle: 'text-purple-500 hover:text-purple-700 bg-purple-200/30 hover:bg-purple-200/80', resize: 'bg-purple-300' },
  amber: { bg: 'bg-amber-50/40', border: 'border-amber-300', header: 'bg-amber-100/80', text: 'text-amber-800', handle: 'text-amber-500 hover:text-amber-700 bg-amber-200/30 hover:bg-amber-200/80', resize: 'bg-amber-300' },
};
const ZONE_COLORS = Object.keys(ZONE_THEMES);

export default function App() {
  const [devices, setDevices] = useState([]);
  const [connections, setConnections] = useState([]);
  const [zones, setZones] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [availableZoneColors, setAvailableZoneColors] = useState([...ZONE_COLORS]);
  
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 500, y: 400 });
  const [isPanning, setIsPanning] = useState(false);
  
  const [draggingDevice, setDraggingDevice] = useState(null);
  const [draggingZone, setDraggingZone] = useState(null);
  const [resizingZone, setResizingZone] = useState(null);
  const [draggingSticker, setDraggingSticker] = useState(null);
  const [resizingSticker, setResizingSticker] = useState(null);
  
  const [interactionMode, setInteractionMode] = useState('cursor'); 
  const [cableSource, setCableSource] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [selectionBoxState, setSelectionBoxState] = useState(null);
  const selectionBoxRef = useRef(null);
  const updateSelectionBox = (box) => {
    selectionBoxRef.current = box;
    setSelectionBoxState(box);
  };

  const [isGroupDeleteModalOpen, setIsGroupDeleteModalOpen] = useState(false);
  const [connectingMode, setConnectingMode] = useState(null);
  const [pendingConn, setPendingConn] = useState(null);
  const [editingDevice, setEditingDevice] = useState(null);
  const [expandedDevices, setExpandedDevices] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSummary, setShowSummary] = useState(true);
  const [screenshotMode, setScreenshotMode] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  
  const [customModels, setCustomModels] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sfp_custom_models')) || []; } 
    catch (e) { return []; }
  });
  
  const [customDev, setCustomDev] = useState({
    name: 'Коммутатор', type: 'SW', count: 1, poeBudget: 370, poePerPort: 30, poeDraw: 0,
    ports: { eth: 24, sfp: 4, sfpPlus: 0, sfp28: 0 }
  });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const schemaInputRef = useRef(null);
  const coordsRef = useRef(null);
  const isDraggingRef = useRef(false);
  
  const dragInfo = useRef({ startX: 0, startY: 0, initialPositions: {}, initialState: null });
  const panInfo = useRef({ startX: 0, startY: 0, initialPanX: 0, initialPanY: 0 });
  const activePointers = useRef(new Map());
  const lastPinchDist = useRef(null);
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialPan = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      setPan(initialPan);
      panRef.current = initialPan;
    }
  }, []);

  useEffect(() => { 
    zoomRef.current = zoom; 
    panRef.current = pan;
  }, [zoom, pan]);

  const getDeepState = () => ({
    devices: JSON.parse(JSON.stringify(devices)),
    connections: JSON.parse(JSON.stringify(connections)),
    zones: JSON.parse(JSON.stringify(zones)),
    stickers: JSON.parse(JSON.stringify(stickers))
  });

  const takeSnapshot = () => {
    setPast(prev => [...prev, getDeepState()]);
    setFuture([]);
  };

  const handleUndo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    if (!previous || !previous.devices) {
      setPast(prev => prev.slice(0, -1));
      return;
    }
    setFuture(prev => [...prev, getDeepState()]);
    setDevices(previous.devices);
    setConnections(previous.connections);
    setZones(previous.zones);
    setStickers(previous.stickers || []);
    setPast(prev => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[future.length - 1];
    if (!next || !next.devices) {
      setFuture(prev => prev.slice(0, -1));
      return;
    }
    setPast(prev => [...prev, getDeepState()]);
    setDevices(next.devices);
    setConnections(next.connections);
    setZones(next.zones);
    setStickers(next.stickers || []);
    setFuture(prev => prev.slice(0, -1));
  };

  const clampPan = (p) => {
    const limit = 6000;
    return {
      x: Math.max(-limit, Math.min(limit, p.x)),
      y: Math.max(-limit, Math.min(limit, p.y))
    };
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    let newDev = { ...customDev, type: newType, name: TYPE_NAMES[newType] || 'Устройство' };
    
    if (newType === 'OTHER') {
      newDev.ports = { eth: 2, sfp: 2, sfpPlus: 2, sfp28: 2 };
      newDev.poeBudget = 370; newDev.poePerPort = 30; newDev.poeDraw = 15;
    } else if (['AP', 'CAMERA', 'PHONE'].includes(newType)) {
      newDev.ports = { eth: 1, sfp: 0, sfpPlus: 0, sfp28: 0 };
      newDev.poeBudget = 0; newDev.poePerPort = 0;
      if (newType === 'AP') newDev.poeDraw = 15;
      else if (newType === 'CAMERA') newDev.poeDraw = 10;
      else if (newType === 'PHONE') newDev.poeDraw = 7;
    } else if (['PC', 'SERVER'].includes(newType)) {
      if (newType === 'SERVER') newDev.ports = { eth: 2, sfp: 0, sfpPlus: 4, sfp28: 0 };
      else newDev.ports = { eth: 1, sfp: 0, sfpPlus: 0, sfp28: 0 };
      newDev.poeBudget = 0; newDev.poePerPort = 0; newDev.poeDraw = 0;
    } else {
      newDev.ports = { eth: 24, sfp: 4, sfpPlus: 0, sfp28: 0 };
      newDev.poeDraw = 0;
      if (newType === 'SW') { newDev.poeBudget = 370; newDev.poePerPort = 30; }
      else { newDev.poeBudget = 0; newDev.poePerPort = 0; }
    }
    setCustomDev(newDev);
  };

  const addDevice = (modelData) => {
    takeSnapshot();
    const newDevice = {
      ...modelData,
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      count: Math.max(1, modelData.count || 1),
      poeBudget: Math.max(0, modelData.poeBudget || 0),
      poePerPort: Math.max(0, modelData.poePerPort || 0),
      poeDraw: Math.max(0, modelData.poeDraw || 0),
      x: (-pan.x + (canvasRef.current ? canvasRef.current.clientWidth / 2 : window.innerWidth / 2)) / zoom - 150 + Math.random() * 50,
      y: (-pan.y + (canvasRef.current ? canvasRef.current.clientHeight / 2 : window.innerHeight / 2)) / zoom - 100 + Math.random() * 50,
      ports: {
        eth: Math.max(0, modelData.ports?.eth || 0),
        sfp: Math.max(0, modelData.ports?.sfp || 0),
        sfpPlus: Math.max(0, modelData.ports?.sfpPlus || 0),
        sfp28: Math.max(0, modelData.ports?.sfp28 || 0),
      }
    };
    delete newDevice.icon; 
    setDevices([...devices, newDevice]);
  };

  const addZone = () => {
    takeSnapshot();
    let currentColors = availableZoneColors;
    if (currentColors.length === 0) currentColors = [...ZONE_COLORS];
    const randomIndex = Math.floor(Math.random() * currentColors.length);
    const selectedColor = currentColors[randomIndex];
    setAvailableZoneColors(currentColors.filter((_, i) => i !== randomIndex));

    const stagger = (zones.length % 10) * 40;
    const newZone = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Новая зона',
      color: selectedColor,
      x: (-pan.x + (canvasRef.current ? canvasRef.current.clientWidth / 2 : window.innerWidth / 2)) / zoom - 200 + stagger,
      y: (-pan.y + (canvasRef.current ? canvasRef.current.clientHeight / 2 : window.innerHeight / 2)) / zoom - 150 + stagger,
      w: 400, h: 300
    };
    setZones([...zones, newZone]);
  };

  const addSticker = () => {
    takeSnapshot();
    const stagger = (stickers.length % 10) * 30;
    const newSticker = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      color: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      x: (-pan.x + (canvasRef.current ? canvasRef.current.clientWidth / 2 : window.innerWidth / 2)) / zoom - 100 + stagger,
      y: (-pan.y + (canvasRef.current ? canvasRef.current.clientHeight / 2 : window.innerHeight / 2)) / zoom - 100 + stagger,
      w: 200, h: 180
    };
    setStickers([...stickers, newSticker]);
  };

  const duplicateDevice = (device) => {
    takeSnapshot();
    const newDevice = {
      ...device,
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      x: device.x + 30,
      y: device.y + 30,
    };
    setDevices([...devices, newDevice]);
    setActiveDropdown(null);
  };

  const executeRemoveDevice = () => {
    if (!deviceToDelete) return;
    takeSnapshot();
    setDevices(prev => prev.filter(d => d.id !== deviceToDelete));
    setConnections(prev => prev.filter(c => c.from !== deviceToDelete && c.to !== deviceToDelete));
    if (connectingMode?.sourceId === deviceToDelete) setConnectingMode(null);
    setExpandedDevices(prev => prev.filter(eId => eId !== deviceToDelete));
    setSelectedIds(prev => prev.filter(id => id !== deviceToDelete));
    setActiveDropdown(null);
    setDeviceToDelete(null);
  };

  const executeRemoveSelected = () => {
    takeSnapshot();
    setDevices(prev => prev.filter(d => !selectedIds.includes(d.id)));
    setZones(prev => prev.filter(z => !selectedIds.includes(z.id)));
    setStickers(prev => prev.filter(s => !selectedIds.includes(s.id)));
    setConnections(prev => prev.filter(c => !selectedIds.includes(c.from) && !selectedIds.includes(c.to)));
    setExpandedDevices(prev => prev.filter(eId => !selectedIds.includes(eId)));
    if (connectingMode && selectedIds.includes(connectingMode.sourceId)) setConnectingMode(null);
    setSelectedIds([]);
    setIsGroupDeleteModalOpen(false);
  };

  const getDeviceUsage = (deviceId, excludeConnId = null) => {
    let usage = { eth: 0, sfp: 0, sfpPlus: 0, sfp28: 0, poe: 0 };
    const device = devices.find(d => d.id === deviceId);
    if (!device) return usage;

    connections.forEach(c => {
      if (c.id === excludeConnId) return;
      if (c.from === deviceId || c.to === deviceId) {
        const isSource = c.from === deviceId;
        const portType = isSource ? c.fromType : c.toType;
        usage[portType] += c.count;

        if (device.poeBudget > 0 && portType === 'eth') {
          const otherDevId = isSource ? c.to : c.from;
          const otherDev = devices.find(d => d.id === otherDevId);
          if (otherDev && otherDev.poeDraw > 0 && !c.hasInjector) {
            usage.poe += (otherDev.poeDraw * c.count);
          }
        }
      }
    });
    return usage;
  };

  const attemptAutoConnect = (sourceId, targetId) => {
    if (sourceId === targetId) { setCableSource(null); return; }
    const sDev = devices.find(d => d.id === sourceId);
    const tDev = devices.find(d => d.id === targetId);
    if (!sDev || !tDev) return;

    let priorities = ['eth', 'sfp', 'sfpPlus', 'sfp28'];
    const isEndDevice = (type) => ['PC', 'CAMERA', 'PHONE', 'AP'].includes(type);

    if (sDev.type === 'SW' || tDev.type === 'SW') {
      const sw = sDev.type === 'SW' ? sDev : tDev;
      const other = sDev.type === 'SW' ? tDev : sDev;
      
      if (other.type === 'ROUTER') priorities = ['sfp28', 'sfpPlus', 'sfp', 'eth'];
      else if (other.type === 'SW') priorities = ['sfpPlus', 'sfp28', 'sfp', 'eth'];
      else if (other.type === 'SERVER') priorities = ['sfp28', 'sfpPlus', 'sfp', 'eth'];
      else if (isEndDevice(other.type)) priorities = ['eth', 'sfp', 'sfpPlus', 'sfp28'];
      else priorities = ['eth', 'sfp', 'sfpPlus', 'sfp28'];
    } else {
      priorities = ['eth', 'sfp', 'sfpPlus', 'sfp28'];
    }

    const sUsage = getDeviceUsage(sDev.id);
    const tUsage = getDeviceUsage(tDev.id);

    let selectedPort = null;
    for (const p of priorities) {
      const sAvail = (sDev.ports[p] || 0) * sDev.count - sUsage[p];
      const tAvail = (tDev.ports[p] || 0) * tDev.count - tUsage[p];
      const connCount = Math.max(sDev.count, tDev.count);
      if (sAvail >= connCount && tAvail >= connCount) {
        selectedPort = p;
        break;
      }
    }

    if (selectedPort) {
      takeSnapshot();
      const connCount = Math.max(sDev.count, tDev.count);
      let needsInjector = false;
      if (selectedPort === 'eth') {
        const drawer = tDev.poeDraw > 0 ? tDev : (sDev.poeDraw > 0 ? sDev : null);
        const supplier = tDev.poeDraw > 0 ? sDev : (sDev.poeDraw > 0 ? tDev : null);
        if (drawer && (!supplier || supplier.poeBudget === 0 || supplier.poePerPort < drawer.poeDraw)) {
          needsInjector = true;
        }
      }

      const newConn = {
        id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
        name: '',
        from: sourceId,
        to: targetId,
        fromType: selectedPort,
        toType: selectedPort,
        count: connCount,
        hasInjector: false,
        needsInjector,
        typeWarning: false
      };
      setConnections([...connections, newConn]);
      setCableSource(null);
    } else {
      alert('Нет свободных совместимых портов для автоматического подключения с учетом количества устройств в группе.');
      setCableSource(null);
    }
  };

  const startDrag = (e, id, type) => {
    if (interactionMode === 'cable') return;
    const tagName = e.target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'button' || tagName === 'select') return;
    
    e.stopPropagation();
    if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
    
    let newSelectedIds = [...selectedIds];
    if (!e.shiftKey && !selectedIds.includes(id)) {
      newSelectedIds = [id];
      setSelectedIds(newSelectedIds);
    } else if (e.shiftKey && !selectedIds.includes(id)) {
      newSelectedIds.push(id);
      setSelectedIds(newSelectedIds);
    }

    const initialPositions = {};
    newSelectedIds.forEach(selId => {
      const d = devices.find(x => x.id === selId);
      if (d) initialPositions[selId] = { x: d.x, y: d.y };
      const z = zones.find(x => x.id === selId);
      if (z) initialPositions[selId] = { x: z.x, y: z.y };
      const s = stickers.find(x => x.id === selId);
      if (s) initialPositions[selId] = { x: s.x, y: s.y };
    });
    
    isDraggingRef.current = false;
    dragInfo.current = { startX: e.clientX, startY: e.clientY, initialPositions, initialState: getDeepState() };
    
    if (type === 'device') setDraggingDevice(id);
    if (type === 'zone') setDraggingZone(id);
    if (type === 'sticker') setDraggingSticker(id);
  };

  const handleCanvasPointerDown = (e) => {
    if (interactionMode === 'cable') {
      if (!e.target.closest('.device-node')) setCableSource(null);
      return;
    }
    if (e.target.closest('.device-node') || e.target.closest('.zone-node') || e.target.closest('.sticker-node')) return;

    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.current.size === 2) {
      updateSelectionBox(null);
      const pts = Array.from(activePointers.current.values());
      lastPinchDist.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    } else if (activePointers.current.size === 1) {
      if (!e.shiftKey) setSelectedIds([]);
      
      if (interactionMode === 'select') {
        setIsPanning(false);
        const rect = canvasRef.current.getBoundingClientRect();
        const startX = (e.clientX - rect.left - panRef.current.x) / zoomRef.current;
        const startY = (e.clientY - rect.top - panRef.current.y) / zoomRef.current;
        updateSelectionBox({ startX, startY, endX: startX, endY: startY });
      } else {
        updateSelectionBox(null);
        setIsPanning(true);
        panInfo.current = { startX: e.clientX, startY: e.clientY, initialPanX: panRef.current.x, initialPanY: panRef.current.y };
      }
    }
  };

  const handlePointerMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (coordsRef.current) {
      const worldX = (e.clientX - rect.left - panRef.current.x) / zoomRef.current;
      const worldY = (e.clientY - rect.top - panRef.current.y) / zoomRef.current;
      coordsRef.current.textContent = `X: ${Math.round(worldX)} Y: ${Math.round(worldY)}`;
    }

    if (activePointers.current.has(e.pointerId)) {
      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (activePointers.current.size === 2) {
      const pts = Array.from(activePointers.current.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (lastPinchDist.current) {
        const scaleDiff = currentDist / lastPinchDist.current;
        const newZoom = Math.max(0.1, Math.min(4, zoomRef.current * scaleDiff));
        const midX = (pts[0].x + pts[1].x) / 2 - rect.left;
        const midY = (pts[0].y + pts[1].y) / 2 - rect.top;
        const newPanX = midX - (midX - panRef.current.x) * (newZoom / zoomRef.current);
        const newPanY = midY - (midY - panRef.current.y) * (newZoom / zoomRef.current);
        zoomRef.current = newZoom;
        const clampedPan = clampPan({ x: newPanX, y: newPanY });
        panRef.current = clampedPan;
        setZoom(newZoom);
        setPan(clampedPan);
        lastPinchDist.current = currentDist;
      }
    } else if (activePointers.current.size === 1 || draggingDevice || draggingZone || resizingZone || draggingSticker || resizingSticker) {
      if (selectionBoxRef.current) {
        const endX = (e.clientX - rect.left - panRef.current.x) / zoomRef.current;
        const endY = (e.clientY - rect.top - panRef.current.y) / zoomRef.current;
        updateSelectionBox({ ...selectionBoxRef.current, endX, endY });
      } else if (draggingDevice || draggingZone || draggingSticker) {
        const diffX = e.clientX - dragInfo.current.startX;
        const diffY = e.clientY - dragInfo.current.startY;
        
        if (!isDraggingRef.current && Math.hypot(diffX, diffY) > 2) {
          isDraggingRef.current = true;
          setPast(prev => [...prev, dragInfo.current.initialState]);
          setFuture([]);
        }

        const dx = diffX / zoomRef.current;
        const dy = diffY / zoomRef.current;
        const targetId = draggingDevice || draggingZone || draggingSticker;
        
        if (selectedIds.includes(targetId)) {
          setDevices(devs => devs.map(d => selectedIds.includes(d.id) && dragInfo.current.initialPositions[d.id] ? { ...d, x: dragInfo.current.initialPositions[d.id].x + dx, y: dragInfo.current.initialPositions[d.id].y + dy } : d));
          setZones(zs => zs.map(z => selectedIds.includes(z.id) && dragInfo.current.initialPositions[z.id] ? { ...z, x: dragInfo.current.initialPositions[z.id].x + dx, y: dragInfo.current.initialPositions[z.id].y + dy } : z));
          setStickers(st => st.map(s => selectedIds.includes(s.id) && dragInfo.current.initialPositions[s.id] ? { ...s, x: dragInfo.current.initialPositions[s.id].x + dx, y: dragInfo.current.initialPositions[s.id].y + dy } : s));
        } else {
          if (draggingDevice) setDevices(devs => devs.map(d => d.id === draggingDevice ? { ...d, x: dragInfo.current.initialPositions[d.id].x + dx, y: dragInfo.current.initialPositions[d.id].y + dy } : d));
          if (draggingZone) setZones(zs => zs.map(z => z.id === draggingZone ? { ...z, x: dragInfo.current.initialPositions[z.id].x + dx, y: dragInfo.current.initialPositions[z.id].y + dy } : z));
          if (draggingSticker) setStickers(st => st.map(s => s.id === draggingSticker ? { ...s, x: dragInfo.current.initialPositions[s.id].x + dx, y: dragInfo.current.initialPositions[s.id].y + dy } : s));
        }
      } else if (resizingZone) {
        const dx = (e.clientX - dragInfo.current.startX) / zoomRef.current;
        const dy = (e.clientY - dragInfo.current.startY) / zoomRef.current;
        setZones(zs => zs.map(z => z.id === resizingZone && dragInfo.current.initialPositions[z.id] ? { ...z, w: Math.max(150, dragInfo.current.initialPositions[z.id].w + dx), h: Math.max(100, dragInfo.current.initialPositions[z.id].h + dy) } : z));
      } else if (resizingSticker) {
        const dx = (e.clientX - dragInfo.current.startX) / zoomRef.current;
        const dy = (e.clientY - dragInfo.current.startY) / zoomRef.current;
        setStickers(st => st.map(s => s.id === resizingSticker && dragInfo.current.initialPositions[s.id] ? { ...s, w: Math.max(100, dragInfo.current.initialPositions[s.id].w + dx), h: Math.max(80, dragInfo.current.initialPositions[s.id].h + dy) } : s));
      } else if (isPanning) {
        const newPan = clampPan({
          x: panInfo.current.initialPanX + (e.clientX - panInfo.current.startX),
          y: panInfo.current.initialPanY + (e.clientY - panInfo.current.startY)
        });
        panRef.current = newPan;
        setPan(newPan);
      }
    }
  };

  const handlePointerUp = (e) => {
    activePointers.current.delete(e.pointerId);
    if (activePointers.current.size < 2) lastPinchDist.current = null;
    
    if (draggingDevice || draggingZone || resizingZone || draggingSticker || resizingSticker) {
      if (resizingZone || resizingSticker) {
        const dx = e.clientX - dragInfo.current.startX;
        const dy = e.clientY - dragInfo.current.startY;
        if (Math.hypot(dx, dy) > 2) {
          setPast(prev => [...prev, dragInfo.current.initialState]);
          setFuture([]);
        }
      }
      isDraggingRef.current = false;
    }

    if (activePointers.current.size === 0) {
      if (selectionBoxRef.current) {
        const box = selectionBoxRef.current;
        const minX = Math.min(box.startX, box.endX);
        const maxX = Math.max(box.startX, box.endX);
        const minY = Math.min(box.startY, box.endY);
        const maxY = Math.max(box.startY, box.endY);
        
        const newSelectedDevs = devices.filter(d => d.x + 280 > minX && d.x < maxX && d.y + 100 > minY && d.y < maxY).map(d => d.id);
        const newSelectedZones = zones.filter(z => z.x + z.w > minX && z.x < maxX && z.y + z.h > minY && z.y < maxY).map(z => z.id);
        const newSelectedStickers = stickers.filter(s => s.x + s.w > minX && s.x < maxX && s.y + s.h > minY && s.y < maxY).map(s => s.id);
        
        setSelectedIds(prev => [...new Set([...prev, ...newSelectedDevs, ...newSelectedZones, ...newSelectedStickers])]);
        updateSelectionBox(null);
      }
      setIsPanning(false);
      setDraggingDevice(null);
      setDraggingZone(null);
      setResizingZone(null);
      setDraggingSticker(null);
      setResizingSticker(null);
    }
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomMultiplier = Math.exp(-e.deltaY * 0.003);
      const newZoom = Math.max(0.1, Math.min(4, zoomRef.current * zoomMultiplier));
      
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const newPanX = mouseX - (mouseX - panRef.current.x) * (newZoom / zoomRef.current);
      const newPanY = mouseY - (mouseY - panRef.current.y) * (newZoom / zoomRef.current);
      
      zoomRef.current = newZoom;
      const clampedPan = clampPan({ x: newPanX, y: newPanY });
      panRef.current = clampedPan;
      
      setZoom(newZoom);
      setPan(clampedPan);
    } else {
      const newPan = clampPan({ x: panRef.current.x - e.deltaX, y: panRef.current.y - e.deltaY });
      panRef.current = newPan;
      setPan(newPan);
    }
  };

  const startConnecting = (sourceId, type) => {
    setConnectingMode({ sourceId, type });
    setActiveDropdown(null);
  };

  const completeConnection = (targetId, targetType = null) => {
    if (!connectingMode) return;
    if (connectingMode.sourceId === targetId) { setConnectingMode(null); return; }

    const sDev = devices.find(d => d.id === connectingMode.sourceId);
    const tDev = devices.find(d => d.id === targetId);
    let resolvedTargetType = targetType;
    if (!resolvedTargetType) {
      const reqType = connectingMode.type;
      const connCount = Math.max(sDev?.count || 1, tDev.count || 1);
      const usage = getDeviceUsage(tDev.id);
      if (usage[reqType] + connCount <= ((tDev.ports[reqType] || 0) * tDev.count)) {
        resolvedTargetType = reqType;
      } else if (reqType !== 'eth') {
        resolvedTargetType = ['sfp', 'sfpPlus', 'sfp28'].find(ft => (usage[ft] + connCount) <= ((tDev.ports[ft] || 0) * tDev.count));
      }
    }
    
    setPendingConn({
      id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
      isNew: true, name: '', from: sDev.id, to: tDev.id,
      fromType: connectingMode.type, toType: resolvedTargetType || connectingMode.type,
      count: Math.max(sDev.count, tDev.count), hasInjector: false
    });
    setConnectingMode(null);
  };

  const saveConnection = (connData) => {
    const sDev = devices.find(d => d.id === connData.from);
    const tDev = devices.find(d => d.id === connData.to);
    if (!sDev || !tDev) return;

    if (connData.isNew) {
      const existing = connections.find(c => 
        ((c.from === connData.from && c.to === connData.to && c.fromType === connData.fromType && c.toType === connData.toType) ||
         (c.from === connData.to && c.to === connData.from && c.fromType === connData.toType && c.toType === connData.fromType))
        && c.hasInjector === connData.hasInjector
      );
      if (existing) {
        const sUsage = getDeviceUsage(sDev.id, existing.id);
        const tUsage = getDeviceUsage(tDev.id, existing.id);
        if (sUsage[connData.fromType] + existing.count + connData.count > ((sDev.ports[connData.fromType] || 0) * sDev.count)) {
          alert(`Не хватает портов ${PORT_LABELS[connData.fromType]} на устройстве ${sDev.name}`); return;
        }
        if (tUsage[connData.toType] + existing.count + connData.count > ((tDev.ports[connData.toType] || 0) * tDev.count)) {
          alert(`Не хватает портов ${PORT_LABELS[connData.toType]} на устройстве ${tDev.name}`); return;
        }
        takeSnapshot();
        setConnections(connections.map(c => c.id === existing.id ? { ...c, count: c.count + connData.count } : c));
        setPendingConn(null); return;
      }
    }

    const sUsage = getDeviceUsage(sDev.id, connData.isNew ? null : connData.id);
    const tUsage = getDeviceUsage(tDev.id, connData.isNew ? null : connData.id);
    if (sUsage[connData.fromType] + connData.count > ((sDev.ports[connData.fromType] || 0) * sDev.count)) {
      alert(`Не хватает портов ${PORT_LABELS[connData.fromType]} на устройстве ${sDev.name}`); return;
    }
    if (tUsage[connData.toType] + connData.count > ((tDev.ports[connData.toType] || 0) * tDev.count)) {
      alert(`Не хватает портов ${PORT_LABELS[connData.toType]} на устройстве ${tDev.name}`); return;
    }

    const typeWarning = ['sfp', 'sfpPlus', 'sfp28'].includes(connData.fromType) && connData.fromType !== connData.toType;
    let needsInjector = false;
    if (connData.fromType === 'eth' && connData.toType === 'eth') {
      const drawer = tDev.poeDraw > 0 ? tDev : (sDev.poeDraw > 0 ? sDev : null);
      const supplier = tDev.poeDraw > 0 ? sDev : (sDev.poeDraw > 0 ? tDev : null);
      if (drawer && (!supplier || supplier.poeBudget === 0 || supplier.poePerPort < drawer.poeDraw)) needsInjector = true;
    }

    takeSnapshot();
    const finalConn = { ...connData, typeWarning, needsInjector };
    delete finalConn.isNew;
    if (connData.isNew) setConnections([...connections, finalConn]);
    else setConnections(connections.map(c => c.id === finalConn.id ? finalConn : c));
    setPendingConn(null);
  };

  const saveCustomModelToLibrary = () => {
    const newModel = { ...customDev, id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36) };
    const updated = [...customModels, newModel];
    setCustomModels(updated);
    localStorage.setItem('sfp_custom_models', JSON.stringify(updated));
  };

  const saveDeviceFromSchemaToLibrary = (dev) => {
    const newModel = { 
      name: dev.name, type: dev.type, count: dev.count, poeBudget: dev.poeBudget, 
      poePerPort: dev.poePerPort, poeDraw: dev.poeDraw, ports: dev.ports, color: dev.color, id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36) 
    };
    const updated = [...customModels, newModel];
    setCustomModels(updated);
    localStorage.setItem('sfp_custom_models', JSON.stringify(updated));
    setActiveDropdown(null);
  };

  const removeCustomModel = (id) => {
    const updated = customModels.filter(m => m.id !== id);
    setCustomModels(updated);
    localStorage.setItem('sfp_custom_models', JSON.stringify(updated));
  };

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(customModels, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'library.netlib';
    link.click();
  };

  const importConfig = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (Array.isArray(imported)) {
          const processedImports = imported.map(item => ({...item, id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36)}));
          const updated = [...customModels, ...processedImports];
          setCustomModels(updated);
          localStorage.setItem('sfp_custom_models', JSON.stringify(updated));
        }
      } catch (err) {}
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const exportSchema = () => {
    const blob = new Blob([JSON.stringify(getDeepState(), null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'project.netproj';
    link.click();
  };

  const importSchema = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.devices && data.connections) {
          takeSnapshot();
          setDevices(data.devices);
          setConnections(data.connections);
          setZones(data.zones || []);
          setStickers(data.stickers || []);
          setPan({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          setZoom(1);
          setExpandedDevices([]);
          setSelectedIds([]);
        }
      } catch (err) { alert('Ошибка загрузки схемы'); }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const currentStats = connections.reduce((acc, c) => {
    const fType = c.fromType; const tType = c.toType;
    const fromOptic = ['sfp', 'sfpPlus', 'sfp28'].includes(fType);
    const toOptic = ['sfp', 'sfpPlus', 'sfp28'].includes(tType);
    const typeWeight = { sfp: 1, sfpPlus: 2, sfp28: 3 };
    
    if (fromOptic && toOptic) {
        acc.fiberCables += c.count;
        const lowest = typeWeight[fType] <= typeWeight[tType] ? fType : tType;
        if (lowest === 'sfp') acc.sfpTransceivers += c.count * 2;
        if (lowest === 'sfpPlus') acc.sfpPlusTransceivers += c.count * 2;
        if (lowest === 'sfp28') acc.sfp28Transceivers += c.count * 2;
    } else if (!fromOptic && !toOptic) {
        acc.ethCables += c.count;
    } else {
        acc.ethCables += c.count;
        const opticType = fromOptic ? fType : tType;
        if (opticType === 'sfp') acc.sfpTransceivers += c.count;
        if (opticType === 'sfpPlus') acc.sfpPlusTransceivers += c.count;
        if (opticType === 'sfp28') acc.sfp28Transceivers += c.count;
    }
    if (c.hasInjector) acc.poeInjectors += c.count;
    return acc;
  }, { ethCables: 0, sfpTransceivers: 0, sfpPlusTransceivers: 0, sfp28Transceivers: 0, fiberCables: 0, poeInjectors: 0 });

  const exportExcel = () => {
    const BOM = "\uFEFF";
    let csv = BOM + "Тип;Наименование;Количество\n";
    const equipment = {};
    devices.forEach(d => {
      const name = `${d.name} ${d.count > 1 ? '(x'+d.count+')' : ''}`;
      equipment[name] = (equipment[name] || 0) + d.count;
    });
    
    Object.entries(equipment).forEach(([name, qty]) => { csv += `Оборудование;"${name}";${qty}\n`; });
    csv += `\nТип;Наименование;Количество\n`;
    if (currentStats.ethCables > 0) csv += `Кабель;"Патч-корд Ethernet (Медь)";${currentStats.ethCables}\n`;
    if (currentStats.fiberCables > 0) csv += `Кабель;"Патч-корд оптический";${currentStats.fiberCables}\n`;
    if (currentStats.sfpTransceivers > 0) csv += `Трансивер;"Модуль SFP 1G";${currentStats.sfpTransceivers}\n`;
    if (currentStats.sfpPlusTransceivers > 0) csv += `Трансивер;"Модуль SFP+ 10G";${currentStats.sfpPlusTransceivers}\n`;
    if (currentStats.sfp28Transceivers > 0) csv += `Трансивер;"Модуль SFP28 25G";${currentStats.sfp28Transceivers}\n`;
    if (currentStats.poeInjectors > 0) csv += `Питание;"PoE-инжектор";${currentStats.poeInjectors}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bom_sfp.csv';
    link.click();
  };

  const toggleExpandAll = () => {
    if (expandedDevices.length === devices.length && devices.length > 0) setExpandedDevices([]);
    else setExpandedDevices(devices.map(d => d.id));
  };

  const renderDeviceList = (modelsObj, isCustom = false) => {
    return Object.keys(modelsObj).map((key, index) => {
      const model = modelsObj[key];
      const Icon = ICONS[model.type] || Server;
      const color = model.color || 'bg-slate-700';
      const uniqueKey = isCustom ? `custom-${model.id}-${index}` : key;
      return (
        <div key={uniqueKey} className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50 hover:bg-blue-50 hover:border-blue-200 transition-all group text-left cursor-pointer" onClick={() => addDevice({...model, color})}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg text-white ${color}`}><Icon size={18} /></div>
            <div>
              <div className="text-sm font-medium text-neutral-800">{model.name}</div>
              <div className="text-[11px] text-neutral-500 flex gap-2">
                {(model.ports?.eth || 0) > 0 && <span>{model.ports.eth} Eth</span>}
                {(model.ports?.sfp || 0) > 0 && <span>{model.ports.sfp} SFP</span>}
                {(model.ports?.sfpPlus || 0) > 0 && <span>{model.ports.sfpPlus} SFP+</span>}
                {(model.ports?.sfp28 || 0) > 0 && <span>{model.ports.sfp28} SFP28</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {isCustom && <button onClick={(e) => { e.stopPropagation(); removeCustomModel(model.id); }} className="text-neutral-300 hover:text-red-500 mr-2 p-2"><Trash2 size={16}/></button>}
            <div className="p-2 bg-white rounded-lg border border-neutral-100 shadow-sm text-neutral-400 group-hover:text-blue-500 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors"><Plus size={16} /></div>
          </div>
        </div>
      )
    });
  };

  const groupedConnections = {};
  connections.forEach(c => {
    const key = [c.from, c.to].sort().join('_');
    if (!groupedConnections[key]) groupedConnections[key] = [];
    groupedConnections[key].push(c);
  });

  return (
    <div className="flex h-screen bg-neutral-100 font-sans text-neutral-800 overflow-hidden" onClick={() => {setActiveDropdown(null);}} onContextMenu={e => e.preventDefault()}>
      
      <datalist id="ports-list">
        {[0, 1, 2, 4, 8, 12, 16, 24, 48].map(v => <option key={v} value={v} />)}
      </datalist>
      <datalist id="count-list">
        {[1, 2, 3, 4, 5, 10, 20].map(v => <option key={v} value={v} />)}
      </datalist>
      <datalist id="poe-list">
        {[0, 15, 30, 60, 90, 120, 240, 370, 740].map(v => <option key={v} value={v} />)}
      </datalist>

      <div className={`bg-white border-neutral-200 flex flex-col shadow-lg z-30 relative shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${(showSidebar && !screenshotMode) ? 'w-80 border-r' : 'w-0 border-r-0'}`} onPointerDown={e => e.stopPropagation()}>
        <div className="w-80 flex flex-col h-full">
          <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2">
              <Activity className="text-blue-600" />
              <h1 className="text-lg font-bold text-neutral-900">Сетевой калькулятор</h1>
            </div>
            <button onClick={() => setShowSidebar(false)} className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors" title="Скрыть панель"><PanelLeftClose size={20} /></button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Оборудование</h2>
                <div className="flex gap-1.5">
                  <button onClick={addZone} className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 font-medium" title="Добавить зону (этаж, стойка)">
                    <SquareDashed size={14} /> Зона
                  </button>
                  <button onClick={() => setShowBuilder(!showBuilder)} className={`text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-medium ${showBuilder ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                    <Settings size={14} /> Кастом
                  </button>
                </div>
              </div>

              {showBuilder && (
                <div className="mb-4 p-4 border border-blue-200 bg-blue-50/50 rounded-xl flex flex-col gap-3 shadow-inner">
                  <input type="text" value={customDev.name} onChange={e => setCustomDev({...customDev, name: e.target.value})} className="w-full text-sm p-2.5 border rounded outline-none focus:border-blue-400 bg-white select-text" placeholder="Имя устройства" />
                  <div className="flex gap-2">
                    <select value={customDev.type} onChange={handleTypeChange} className="text-sm p-2.5 border rounded flex-1 outline-none bg-white font-medium text-neutral-700 cursor-pointer select-text">
                      <option value="SW">Коммутатор</option>
                      <option value="ROUTER">Роутер</option>
                      <option value="FW">МСЭ</option>
                      <option value="SERVER">Серверы</option>
                      <option value="PC">Компьютеры</option>
                      <option value="AP">Точки доступа</option>
                      <option value="CAMERA">Камеры</option>
                      <option value="PHONE">IP Телефония</option>
                      <option value="OTHER">Другое</option>
                    </select>
                    <div className="flex items-center gap-1.5 bg-white border rounded px-3 w-28 focus-within:border-blue-400">
                      <Layers size={16} className="text-neutral-400"/>
                      <input type="number" list="count-list" min="1" max="100" value={customDev.count} onChange={e => setCustomDev({...customDev, count: Math.max(1, parseInt(e.target.value)||1)})} className="w-full text-sm outline-none bg-transparent select-text" title="Количество (Стек / Группа)" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['SW', 'ROUTER', 'FW', 'OTHER'].includes(customDev.type) && (
                      <>
                        <div className="flex items-center gap-2 bg-white border rounded p-2 flex-1 text-xs focus-within:border-blue-400">
                          <Zap size={14} className="text-amber-500 shrink-0" />
                          <input type="number" list="poe-list" min="0" placeholder="Бюджет PoE" value={customDev.poeBudget || ''} onChange={e => setCustomDev({...customDev, poeBudget: Math.max(0, parseInt(e.target.value)||0)})} className="w-full outline-none select-text" title="Общий бюджет PoE (Вт)" />
                        </div>
                        <div className="flex items-center gap-2 bg-white border rounded p-2 flex-1 text-xs focus-within:border-blue-400">
                          <input type="number" list="poe-list" min="0" placeholder="Max/порт" value={customDev.poePerPort || ''} onChange={e => setCustomDev({...customDev, poePerPort: Math.max(0, parseInt(e.target.value)||0)})} className="w-full outline-none select-text" title="Макс. мощность на один порт (Вт)" />
                        </div>
                      </>
                    )}
                    {['AP', 'CAMERA', 'PHONE', 'OTHER'].includes(customDev.type) && (
                      <div className="flex items-center gap-2 bg-white border rounded p-2 flex-1 text-xs focus-within:border-blue-400">
                        <Zap size={14} className="text-amber-500 shrink-0" />
                        <input type="number" list="poe-list" min="0" placeholder="Потребление PoE (Вт)" value={customDev.poeDraw || ''} onChange={e => setCustomDev({...customDev, poeDraw: Math.max(0, parseInt(e.target.value)||0)})} className="w-full outline-none select-text" title="Потребление мощности одного устройства" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.keys(PORT_LABELS).map(ptype => (
                      <div key={ptype} className="flex items-center justify-between bg-white border rounded p-2">
                        <span className="text-neutral-500 text-xs font-semibold">{PORT_LABELS[ptype]}</span>
                        <input type="number" list="ports-list" min="0" value={customDev.ports[ptype]} onChange={e => setCustomDev({...customDev, ports: {...customDev.ports, [ptype]: Math.max(0, parseInt(e.target.value)||0)}})} className="w-12 text-right outline-none bg-neutral-50 rounded py-0.5 select-text" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => addDevice({ ...customDev, color: 'bg-slate-700' })} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex justify-center items-center gap-2"><Plus size={16}/> На схему</button>
                    <button onClick={saveCustomModelToLibrary} className="px-4 py-2.5 bg-neutral-800 text-white rounded-lg text-sm font-medium hover:bg-neutral-900 shadow-sm flex items-center justify-center" title="Сохранить в библиотеку"><Save size={18} /></button>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Моя библиотека</h3>
                  <div className="flex gap-1.5 bg-neutral-50 rounded-lg border border-neutral-100 p-1">
                    <button onClick={() => fileInputRef.current?.click()} className="text-neutral-500 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50" title="Загрузить библиотеку"><Download size={16} /></button>
                    <button onClick={exportConfig} className="text-neutral-500 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50" title="Сохранить библиотеку"><Upload size={16} /></button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".netlib" onChange={importConfig} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {customModels.length > 0 ? renderDeviceList(customModels, true) : <div className="text-[11px] text-neutral-400 text-center py-6 bg-neutral-50/50 rounded-xl border border-neutral-100 border-dashed">Библиотека пуста.<br/>Создайте модель в конструкторе.</div>}
                </div>
              </div>

              <h3 className="text-[10px] font-bold text-neutral-400 uppercase mb-3 tracking-widest">Стандартные</h3>
              <div className="flex flex-col gap-2">{renderDeviceList(DEVICE_MODELS)}</div>
            </div>
          </div>

          <div className="bg-neutral-900 text-white rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.15)] relative z-30 mt-auto transition-all">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-neutral-900 rounded-full p-0.5 border border-neutral-700 cursor-pointer shadow-lg hover:bg-neutral-800 transition-colors" onClick={() => setShowSummary(!showSummary)}>
              {showSummary ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronUp size={16} className="text-neutral-400" />}
            </div>
            <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-neutral-800/80 rounded-t-3xl transition-colors select-none" onClick={() => setShowSummary(!showSummary)}>
              <h2 className="text-sm font-semibold flex items-center gap-2 text-neutral-200"><Cpu size={18} className="text-blue-400" /> Итого</h2>
              <div className="flex gap-1.5 bg-neutral-800 p-1 rounded-xl border border-neutral-700" onClick={e => e.stopPropagation()}>
                <button onClick={() => schemaInputRef.current?.click()} className="p-2 hover:bg-neutral-700 rounded-lg text-neutral-300 transition-colors" title="Загрузить схему"><Download size={16} /></button>
                <button onClick={exportSchema} className="p-2 hover:bg-neutral-700 rounded-lg text-neutral-300 transition-colors" title="Сохранить схему"><Upload size={16} /></button>
                <input type="file" ref={schemaInputRef} className="hidden" accept=".netproj" onChange={importSchema} />
                <button onClick={exportExcel} className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors" title="Экспорт в Excel"><Table size={16} /></button>
              </div>
            </div>
            
            {showSummary && (
              <div className="px-5 pb-5 space-y-2 text-xs font-medium animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex justify-between border-b border-neutral-800 pb-2"><span className="text-neutral-400">Трансиверов SFP (1G)</span><span className="font-bold text-blue-400">{currentStats.sfpTransceivers}</span></div>
                <div className="flex justify-between border-b border-neutral-800 pb-2"><span className="text-neutral-400">Трансиверов SFP+ (10G)</span><span className="font-bold text-purple-400">{currentStats.sfpPlusTransceivers}</span></div>
                <div className="flex justify-between border-b border-neutral-800 pb-2"><span className="text-neutral-400">Трансиверов SFP28 (25G)</span><span className="font-bold text-pink-400">{currentStats.sfp28Transceivers}</span></div>
                {currentStats.poeInjectors > 0 && <div className="flex justify-between border-b border-neutral-800 pb-2"><span className="text-neutral-400">PoE-инжекторы</span><span className="font-bold text-amber-400">{currentStats.poeInjectors}</span></div>}
                <div className="flex justify-between text-neutral-300 pt-2 bg-neutral-800/50 px-3 py-2 rounded-lg mt-2">
                  <span className="flex items-center gap-1.5"><Layers size={14} className="text-neutral-500"/> Оптики: {currentStats.fiberCables}</span>
                  <span className="flex items-center gap-1.5"><Unplug size={14} className="text-emerald-500"/> Медь: {currentStats.ethCables}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div 
        ref={canvasRef}
        className={`flex-grow relative overflow-hidden outline-none bg-neutral-100/50 touch-none ${interactionMode === 'select' ? 'cursor-crosshair' : (interactionMode === 'cable' ? 'cursor-cell' : (isPanning ? 'cursor-grabbing' : 'cursor-grab'))}`}
        onPointerDown={handleCanvasPointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onWheel={handleWheel} 
      >
        {!screenshotMode && (
          <div className="absolute bottom-6 left-6 z-40 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-neutral-500 shadow-sm pointer-events-none border border-neutral-200">
            <span ref={coordsRef}>X: 0 Y: 0</span>
          </div>
        )}

        {selectedIds.length > 1 && !screenshotMode && (
          <button 
            onPointerDown={e => e.stopPropagation()}
            onClick={() => setIsGroupDeleteModalOpen(true)}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all active:scale-95 flex items-center gap-2"
          >
            <Trash2 size={18} strokeWidth={2.5} /> Удалить ({selectedIds.length})
          </button>
        )}

        {!showSidebar && !screenshotMode && (
          <div className="absolute top-6 left-6 z-40" onPointerDown={e => e.stopPropagation()}>
            <button onClick={() => setShowSidebar(true)} className="p-3 bg-white text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl shadow-lg border border-neutral-200/60 backdrop-blur-sm transition-colors" title="Показать панель">
              <PanelLeftOpen size={24} />
            </button>
          </div>
        )}

        <div className={`absolute top-6 right-6 z-40 flex flex-col items-end gap-3 transition-all ${screenshotMode ? 'opacity-30 hover:opacity-100' : ''}`} onPointerDown={e => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            {!screenshotMode && (
              <div className="flex bg-white shadow-lg rounded-xl p-1 border border-neutral-200/60 backdrop-blur-sm mr-2">
                <button onClick={() => { setInteractionMode('cursor'); setCableSource(null); }} className={`p-2.5 rounded-lg transition-colors ${interactionMode === 'cursor' ? 'bg-blue-100 text-blue-600' : 'text-neutral-600 hover:bg-neutral-100'}`} title="Обычный курсор (перемещение)"><MousePointer2 size={20}/></button>
                <button onClick={() => { setInteractionMode('select'); setCableSource(null); }} className={`p-2.5 rounded-lg transition-colors ${interactionMode === 'select' ? 'bg-blue-100 text-blue-600' : 'text-neutral-600 hover:bg-neutral-100'}`} title="Режим выделения области"><BoxSelect size={20}/></button>
                <button onClick={() => { setInteractionMode('cable'); setCableSource(null); }} className={`p-2.5 rounded-lg transition-colors ${interactionMode === 'cable' ? 'bg-indigo-600 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`} title="Быстрое соединение (Кабель)"><Cable size={20}/></button>
              </div>
            )}

            {!screenshotMode && (
              <button onClick={addSticker} className="p-2.5 rounded-xl shadow-lg border border-neutral-200/60 backdrop-blur-sm bg-white text-neutral-600 hover:text-amber-500 hover:bg-amber-50 transition-colors mr-2" title="Добавить заметку (стикер)">
                <StickyNote size={20} />
              </button>
            )}

            {!screenshotMode && (
              <button onClick={toggleExpandAll} className={`p-2.5 rounded-xl shadow-lg border border-neutral-200/60 backdrop-blur-sm transition-colors ${(expandedDevices.length === devices.length && devices.length > 0) ? 'bg-blue-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-100'}`} title="Раскрыть/Скрыть детали оборудования">
                <Eye size={20} />
              </button>
            )}

            <button onClick={() => setScreenshotMode(!screenshotMode)} className={`p-2.5 rounded-xl shadow-lg border border-neutral-200/60 backdrop-blur-sm transition-colors ${screenshotMode ? 'bg-blue-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-100'}`} title="Режим скриншота">
              <ImageIcon size={20} />
            </button>
            
            {!screenshotMode && (
              <div className="flex bg-white shadow-lg rounded-xl p-1 border border-neutral-200/60 backdrop-blur-sm ml-2">
                <button onClick={() => {
                  const newZoom = Math.max(0.1, zoomRef.current - 0.2);
                  const rect = canvasRef.current.getBoundingClientRect();
                  const midX = rect.width / 2;
                  const midY = rect.height / 2;
                  const newPanX = midX - (midX - panRef.current.x) * (newZoom / zoomRef.current);
                  const newPanY = midY - (midY - panRef.current.y) * (newZoom / zoomRef.current);
                  zoomRef.current = newZoom;
                  const clamped = clampPan({ x: newPanX, y: newPanY });
                  panRef.current = clamped;
                  setZoom(newZoom);
                  setPan(clamped);
                }} className="p-2.5 hover:bg-neutral-100 rounded-lg text-neutral-600 transition-colors"><ZoomOut size={20} /></button>
                <div className="px-4 flex items-center justify-center text-sm font-semibold text-neutral-600 min-w-[70px] cursor-pointer hover:bg-neutral-50 rounded-lg transition-colors" onClick={() => {
                  zoomRef.current = 1; 
                  const midPan = {x: window.innerWidth / 2, y: window.innerHeight / 2};
                  panRef.current = midPan;
                  setZoom(1); setPan(midPan);
                }}>{Math.round(zoom * 100)}%</div>
                <button onClick={() => {
                  const newZoom = Math.min(4, zoomRef.current + 0.2);
                  const rect = canvasRef.current.getBoundingClientRect();
                  const midX = rect.width / 2;
                  const midY = rect.height / 2;
                  const newPanX = midX - (midX - panRef.current.x) * (newZoom / zoomRef.current);
                  const newPanY = midY - (midY - panRef.current.y) * (newZoom / zoomRef.current);
                  zoomRef.current = newZoom;
                  const clamped = clampPan({ x: newPanX, y: newPanY });
                  panRef.current = clamped;
                  setZoom(newZoom);
                  setPan(clamped);
                }} className="p-2.5 hover:bg-neutral-100 rounded-lg text-neutral-600 transition-colors"><ZoomIn size={20} /></button>
              </div>
            )}
          </div>

          {!screenshotMode && (
            <div className="flex bg-white shadow-lg rounded-xl p-1 border border-neutral-200/60 backdrop-blur-sm mt-1">
              <button disabled={past.length === 0} onClick={handleUndo} className="p-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Отменить действие"><Undo size={20}/></button>
              <button disabled={future.length === 0} onClick={handleRedo} className="p-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Повторить действие"><Redo size={20}/></button>
            </div>
          )}
        </div>

        {interactionMode === 'cable' && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl text-sm flex items-center gap-3 z-40 animate-in fade-in duration-300 font-medium border border-indigo-500 pointer-events-none">
            <Cable size={18} className="text-indigo-200" /> 
            {cableSource ? "Выберите второе устройство" : "Выберите первое устройство для быстрого соединения"}
          </div>
        )}

        {connectingMode && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white px-6 py-3 rounded-full shadow-2xl text-sm flex items-center gap-3 z-40 animate-pulse font-medium border border-neutral-700 pointer-events-none">
            <Unplug size={18} className="text-blue-400" /> Выберите устройство для подключения
          </div>
        )}

        {(connectingMode || interactionMode === 'cable') && (
          <button 
            onPointerDown={e => e.stopPropagation()}
            onClick={() => { setConnectingMode(null); setCableSource(null); setInteractionMode('cursor'); }}
            className="absolute bottom-6 right-6 z-50 px-6 py-3.5 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all active:scale-95 flex items-center gap-2"
          >
            <X size={20} strokeWidth={2.5} /> Отмена режима
          </button>
        )}

        {/* Modal Group Deletion Confirmation */}
        {isGroupDeleteModalOpen && (
          <div className="absolute inset-0 bg-neutral-900/40 z-[60] flex items-center justify-center pointer-events-auto backdrop-blur-sm" onPointerDown={e=>e.stopPropagation()} onWheel={e=>e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-2xl w-[320px] flex flex-col overflow-hidden text-center p-6 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
              <h3 className="font-bold text-lg text-neutral-800 mb-2">Удалить элементы ({selectedIds.length})?</h3>
              <p className="text-sm text-neutral-500 mb-6">Это действие также удалит все связанные соединения.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setIsGroupDeleteModalOpen(false)} className="flex-1 py-3 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-colors">Нет, отмена</button>
                <button onClick={executeRemoveSelected} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors">Да, удалить</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Connections */}
        {pendingConn && (
          <div className="absolute inset-0 bg-neutral-900/40 z-50 flex items-center justify-center pointer-events-auto backdrop-blur-sm" onPointerDown={e=>e.stopPropagation()} onWheel={e=>e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-2xl w-[420px] flex flex-col overflow-hidden border border-neutral-100">
              <div className="p-5 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
                <h3 className="font-bold text-neutral-800 flex items-center gap-2 text-base">
                  {pendingConn.isNew ? <><Unplug size={20} className="text-blue-500"/> Новое соединение</> : <><Edit2 size={20} className="text-blue-500"/> Настройка соединения</>}
                </h3>
                <button onClick={() => setPendingConn(null)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-lg transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-1.5 block uppercase tracking-wide">Имя соединения (необязательно)</label>
                  <input type="text" value={pendingConn.name} onChange={e=>setPendingConn({...pendingConn, name: e.target.value})} className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-neutral-50 focus:bg-white select-text" placeholder="Например: Uplink к ядру" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-neutral-500 mb-2 truncate font-medium" title={devices.find(d=>d.id===pendingConn.from)?.name}>От: <span className="text-neutral-800">{devices.find(d=>d.id===pendingConn.from)?.name}</span></div>
                    <select value={pendingConn.fromType} onChange={e=>setPendingConn({...pendingConn, fromType: e.target.value})} className="w-full text-sm border-neutral-200 rounded-lg p-2 outline-none bg-white border cursor-pointer focus:border-blue-400 select-text">
                      {Object.keys(PORT_LABELS).filter(t => (devices.find(d=>d.id===pendingConn.from)?.ports[t] || 0) > 0).map(t => <option key={t} value={t}>{PORT_LABELS[t]}</option>)}
                    </select>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-neutral-500 mb-2 truncate font-medium" title={devices.find(d=>d.id===pendingConn.to)?.name}>К: <span className="text-neutral-800">{devices.find(d=>d.id===pendingConn.to)?.name}</span></div>
                    <select value={pendingConn.toType} onChange={e=>setPendingConn({...pendingConn, toType: e.target.value})} className="w-full text-sm border-neutral-200 rounded-lg p-2 outline-none bg-white border cursor-pointer focus:border-blue-400 select-text">
                      {Object.keys(PORT_LABELS).filter(t => (devices.find(d=>d.id===pendingConn.to)?.ports[t] || 0) > 0).map(t => <option key={t} value={t}>{PORT_LABELS[t]}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-1.5 block uppercase tracking-wide">Количество кабелей</label>
                  <input type="number" list="count-list" min="1" max="100" value={pendingConn.count} onChange={e=>setPendingConn({...pendingConn, count: Math.max(1, parseInt(e.target.value)||1)})} className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-neutral-50 focus:bg-white select-text" />
                </div>
                {(() => {
                  const isFiber = ['sfp', 'sfpPlus', 'sfp28'].includes(pendingConn.fromType) && ['sfp', 'sfpPlus', 'sfp28'].includes(pendingConn.toType);
                  const typeWarning = isFiber && pendingConn.fromType !== pendingConn.toType;
                  const isSfpToEth = (pendingConn.fromType === 'eth' && ['sfp', 'sfpPlus', 'sfp28'].includes(pendingConn.toType)) || (['sfp', 'sfpPlus', 'sfp28'].includes(pendingConn.fromType) && pendingConn.toType === 'eth');
                  let needsInjector = false; let poeMsg = '';
                  const sD = devices.find(d=>d.id===pendingConn.from); const tD = devices.find(d=>d.id===pendingConn.to);
                  if (sD && tD && pendingConn.fromType === 'eth' && pendingConn.toType === 'eth') {
                    const drawer = tD.poeDraw > 0 ? tD : (sD.poeDraw > 0 ? sD : null);
                    const supplier = tD.poeDraw > 0 ? sD : (sD.poeDraw > 0 ? tD : null);
                    if (drawer) {
                      if (!supplier || supplier.poeBudget === 0 || supplier.poePerPort < drawer.poeDraw) {
                        needsInjector = true; poeMsg = `Требуется ${drawer.poeDraw}W PoE, а порт не выдает нужное питание.`;
                      }
                    }
                  }
                  return (
                    <div className="flex flex-col gap-2">
                      {isSfpToEth && (
                        <div className="flex items-start gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl text-xs border border-blue-200 shadow-sm font-medium">
                          <AlertTriangle size={18} className="shrink-0 mt-0.5" /><span>Необходим будет "Модуль SFP с интерфейсом RJ45" для подключения оптики к медному порту.</span>
                        </div>
                      )}
                      {typeWarning && (
                        <div className="flex items-start gap-3 bg-amber-50 text-amber-800 p-4 rounded-xl text-xs border border-amber-200 shadow-sm font-medium">
                          <AlertTriangle size={18} className="shrink-0 mt-0.5" /><span>Внимание: Разные стандарты оптики ({PORT_LABELS[pendingConn.fromType]} и {PORT_LABELS[pendingConn.toType]}). Это может привести к падению скорости или обрыву линка.</span>
                        </div>
                      )}
                      {needsInjector && (
                        <div className="flex flex-col gap-3 bg-rose-50 text-rose-800 p-4 rounded-xl text-xs border border-rose-200 shadow-sm font-medium">
                          <div className="flex items-start gap-3"><ZapOff size={18} className="shrink-0 mt-0.5" /><span>Внимание: {poeMsg}</span></div>
                          <label className="flex items-center gap-2 cursor-pointer w-max">
                            <input type="checkbox" checked={pendingConn.hasInjector || false} onChange={e => setPendingConn({...pendingConn, hasInjector: e.target.checked})} className="w-4 h-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500 cursor-pointer" />
                            <span className="font-bold text-sm text-rose-900">Добавить PoE-инжектор</span>
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="p-5 border-t border-neutral-100 flex gap-3 bg-neutral-50 justify-between items-center">
                {!pendingConn.isNew ? (
                  <button onClick={() => { takeSnapshot(); setConnections(connections.filter(c=>c.id!==pendingConn.id)); setPendingConn(null); }} className="text-red-500 hover:bg-red-100 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"><Trash2 size={16}/> Удалить</button>
                ) : <div></div>}
                <div className="flex gap-2">
                  <button onClick={() => setPendingConn(null)} className="px-5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm font-bold hover:bg-neutral-100 transition-colors">Отмена</button>
                  <button onClick={() => saveConnection(pendingConn)} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95">Сохранить</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Deletion Confirmation */}
        {deviceToDelete && (
          <div className="absolute inset-0 bg-neutral-900/40 z-[60] flex items-center justify-center pointer-events-auto backdrop-blur-sm" onPointerDown={e=>e.stopPropagation()} onWheel={e=>e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-2xl w-[320px] flex flex-col overflow-hidden text-center p-6 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
              <h3 className="font-bold text-lg text-neutral-800 mb-2">Удалить устройство?</h3>
              <p className="text-sm text-neutral-500 mb-6">Это действие также удалит все связанные с ним соединения.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeviceToDelete(null)} className="flex-1 py-3 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-colors">Нет, отмена</button>
                <button onClick={executeRemoveDevice} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors">Да, удалить</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editing Device */}
        {editingDevice && (
          <div className="absolute inset-0 bg-neutral-900/40 z-50 flex items-center justify-center pointer-events-auto backdrop-blur-sm" onPointerDown={e=>e.stopPropagation()} onWheel={e=>e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-2xl w-[360px] flex flex-col overflow-hidden">
              <div className="p-5 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
                <h3 className="font-bold text-neutral-800 flex items-center gap-2 text-base"><Edit2 size={20} className="text-blue-500"/> Настройки устройства</h3>
                <button onClick={() => setEditingDevice(null)} className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-1.5 rounded-lg transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-1.5 block uppercase tracking-wide">Имя</label>
                  <input type="text" value={editingDevice.name} onChange={e=>setEditingDevice({...editingDevice, name: e.target.value})} className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-neutral-50 focus:bg-white select-text" />
                </div>
                <div className="flex gap-3">
                  {['SW', 'ROUTER', 'FW', 'OTHER'].includes(editingDevice.type) && (
                    <>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block uppercase tracking-wide">PoE Бюджет (Вт)</label>
                        <input type="number" list="poe-list" min="0" value={editingDevice.poeBudget} onChange={e=>setEditingDevice({...editingDevice, poeBudget: Math.max(0, parseInt(e.target.value)||0)})} className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 bg-neutral-50 select-text" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block uppercase tracking-wide">Max / порт (Вт)</label>
                        <input type="number" list="poe-list" min="0" value={editingDevice.poePerPort} onChange={e=>setEditingDevice({...editingDevice, poePerPort: Math.max(0, parseInt(e.target.value)||0)})} className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 bg-neutral-50 select-text" />
                      </div>
                    </>
                  )}
                  {['AP', 'CAMERA', 'PHONE', 'OTHER'].includes(editingDevice.type) && (
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-neutral-500 mb-1.5 block uppercase tracking-wide">Потребление PoE (Вт)</label>
                      <input type="number" list="poe-list" min="0" value={editingDevice.poeDraw} onChange={e=>setEditingDevice({...editingDevice, poeDraw: Math.max(0, parseInt(e.target.value)||0)})} className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 bg-neutral-50 select-text" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-2 block uppercase tracking-wide">Порты</label>
                  <div className="grid grid-cols-2 gap-3 text-sm bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    {Object.keys(PORT_LABELS).map(ptype => (
                      <div key={ptype} className="flex items-center justify-between">
                        <span className="text-xs font-medium text-neutral-600">{PORT_LABELS[ptype]}</span>
                        <input type="number" list="ports-list" min="0" value={editingDevice.ports[ptype] || 0} onChange={e=>setEditingDevice({...editingDevice, ports: {...editingDevice.ports, [ptype]: Math.max(0, parseInt(e.target.value)||0)}})} className="w-14 border border-neutral-200 rounded-lg p-1.5 text-center outline-none focus:border-blue-400 bg-white select-text" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-1.5 block uppercase tracking-wide">Заметка</label>
                  <textarea value={editingDevice.note || ''} onChange={e=>setEditingDevice({...editingDevice, note: e.target.value})} className="w-full border border-neutral-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-neutral-50 focus:bg-white resize-none select-text" rows="3" placeholder="Укажите важную информацию (например: ядро сети, неисправные порты)..." />
                </div>
              </div>
              <div className="p-5 border-t border-neutral-100 flex gap-2 bg-neutral-50 justify-end">
                <button onClick={() => setEditingDevice(null)} className="px-5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm font-bold hover:bg-neutral-100 transition-colors">Отмена</button>
                <button onClick={() => { takeSnapshot(); setDevices(devices.map(d => d.id === editingDevice.id ? editingDevice : d)); setEditingDevice(null); }} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95">Сохранить</button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 origin-top-left will-change-transform" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
          
          {/* Zones Render Layer */}
          {zones.map(zone => {
            const theme = ZONE_THEMES[zone.color] || ZONE_THEMES.indigo;
            const isSelected = selectedIds.includes(zone.id);
            return (
              <div key={zone.id} className={`zone-node absolute border-[3px] border-dashed rounded-3xl pointer-events-auto flex flex-col group transition-all touch-none ${theme.bg} ${isSelected ? 'ring-4 ring-blue-500 border-blue-500 shadow-xl z-20' : theme.border}`} style={{ left: zone.x, top: zone.y, width: zone.w, height: zone.h }} onPointerDown={(e) => startDrag(e, zone.id, 'zone')}>
                <div className={`px-2 py-2 rounded-t-2xl font-bold flex justify-between items-center shrink-0 border-b-2 border-dashed ${theme.header} ${isSelected ? 'border-blue-300' : theme.border}`}>
                  <div className={`zone-node-handle p-1.5 cursor-move rounded-lg transition-colors ${theme.handle}`} title="Переместить зону"><Move size={18} /></div>
                  <input type="text" value={zone.title} onChange={e => { takeSnapshot(); setZones(zs => zs.map(z => z.id === zone.id ? { ...z, title: e.target.value } : z)); }} className={`bg-transparent border-none outline-none font-bold w-full cursor-text ml-3 select-text ${theme.text}`} onPointerDown={e => e.stopPropagation()} />
                  <button onClick={() => { takeSnapshot(); setZones(zs => zs.filter(z => z.id !== zone.id)); }} className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2" onPointerDown={e => e.stopPropagation()} title="Удалить зону"><Trash2 size={16} /></button>
                </div>
                <div className="flex-grow pointer-events-none" />
                <div className={`zone-node-resize absolute bottom-0 right-0 w-6 h-6 rounded-tl-xl rounded-br-2xl cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity ${theme.resize}`} onPointerDown={e => {
                  if (interactionMode === 'cable') return;
                  e.stopPropagation(); e.target.setPointerCapture(e.pointerId);
                  dragInfo.current = { startX: e.clientX, startY: e.clientY, initialPositions: { [zone.id]: { w: zone.w, h: zone.h } }, initialState: getDeepState() };
                  setResizingZone(zone.id);
                }} />
              </div>
            );
          })}

          <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
            <g transform="translate(0, 0)">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
              <line x1="0" y1="-15" x2="0" y2="15" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            </g>
            {selectionBoxState && (
              <rect x={Math.min(selectionBoxState.startX, selectionBoxState.endX)} y={Math.min(selectionBoxState.startY, selectionBoxState.endY)} width={Math.abs(selectionBoxState.endX - selectionBoxState.startX)} height={Math.abs(selectionBoxState.endY - selectionBoxState.startY)} fill="rgba(59, 130, 246, 0.15)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth={2 / zoom} strokeDasharray="4 4" />
            )}
            {Object.keys(groupedConnections).map(groupKey => {
              const group = groupedConnections[groupKey];
              return group.map((conn, index) => {
                const fromDev = devices.find(d => d.id === conn.from); const toDev = devices.find(d => d.id === conn.to);
                if (!fromDev || !toDev) return null;
                const isFromExpanded = expandedDevices.includes(fromDev.id); const isToExpanded = expandedDevices.includes(toDev.id);
                const x1 = fromDev.x + 140; const y1 = fromDev.y + (isFromExpanded ? (fromDev.count > 1 ? 80 : 70) : (fromDev.count > 1 ? 26 : 24)); 
                const x2 = toDev.x + 140; const y2 = toDev.y + (isToExpanded ? (toDev.count > 1 ? 80 : 70) : (toDev.count > 1 ? 26 : 24));
                let offsetCurve = 0;
                if (group.length > 1) offsetCurve = (index - (group.length - 1) / 2) * 40;
                const dx = x2 - x1; const dy = y2 - y1; const len = Math.hypot(dx, dy);
                const nx = len === 0 ? 0 : -dy / len; const ny = len === 0 ? 0 : dx / len;
                const cx = (x1 + x2) / 2 + nx * offsetCurve * 2; const cy = (y1 + y2) / 2 + ny * offsetCurve * 2;
                const midX = (x1 + x2) / 2 + nx * offsetCurve; const midY = (y1 + y2) / 2 + ny * offsetCurve;
                const isFiber = conn.fromType !== 'eth' || conn.toType !== 'eth';
                const isPoeFailed = conn.needsInjector && !conn.hasInjector;
                const color = isPoeFailed ? '#9ca3af' : (conn.typeWarning ? '#f59e0b' : PORT_COLORS[conn.fromType]);

                return (
                  <g key={conn.id} className="pointer-events-auto cursor-pointer group" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setPendingConn({...conn, isNew: false}); }}>
                    {offsetCurve === 0 ? <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="4" strokeDasharray={isFiber ? "8,4" : "none"} className="group-hover:stroke-[6px] group-hover:opacity-80 transition-all duration-200" /> : <path d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth="4" strokeDasharray={isFiber ? "8,4" : "none"} className="group-hover:stroke-[6px] group-hover:opacity-80 transition-all duration-200" />}
                    <rect x={midX - 34} y={midY - 14} width="68" height="28" rx="14" fill="white" stroke={color} strokeWidth="2" className="shadow-sm" />
                    <text x={midX} y={midY + 4} fontSize="11" textAnchor="middle" fill={color} fontWeight="bold" className="pointer-events-none font-sans">{conn.name ? conn.name : (conn.fromType === conn.toType ? PORT_LABELS[conn.fromType] : 'MIX')} {conn.count > 1 ? `x${conn.count}` : ''}</text>
                    {(isPoeFailed || conn.typeWarning) && (
                      <g transform={`translate(${midX}, ${midY - 20})`} className="pointer-events-none drop-shadow-md">
                        <circle cx="0" cy="0" r="11" fill="white" stroke={isPoeFailed ? '#9ca3af' : '#f59e0b'} strokeWidth="1.5" />
                        <svg x="-7" y="-7" width="14" height="14" overflow="visible">
                          {isPoeFailed ? <ZapOff size={14} className="text-neutral-500" /> : <AlertTriangle size={14} className="text-amber-500" />}
                        </svg>
                      </g>
                    )}
                  </g>
                );
              });
            })}
          </svg>

          {devices.map(device => {
            const usage = getDeviceUsage(device.id);
            const Icon = ICONS[device.type] || Server;
            const color = device.color || 'bg-slate-700';
            const isExpanded = expandedDevices.includes(device.id);
            const isSelected = selectedIds.includes(device.id);
            const showDropdown = activeDropdown === device.id;
            const isCableTarget = interactionMode === 'cable' && cableSource === device.id;
            let targetValid = false;
            
            if (connectingMode && connectingMode.sourceId !== device.id) {
              const reqType = connectingMode.type; const sourceDev = devices.find(d=>d.id===connectingMode.sourceId); const connCount = Math.max(sourceDev?.count || 1, device.count || 1);
              if (usage[reqType] + connCount <= ((device.ports[reqType] || 0) * device.count)) targetValid = true;
              else if (reqType !== 'eth') { const availableFiber = ['sfp', 'sfpPlus', 'sfp28'].find(ft => (usage[ft] + connCount) <= ((device.ports[ft] || 0) * device.count)); if (availableFiber) targetValid = true; }
            }

            let zIndexClass = 'z-10';
            if (draggingDevice === device.id) zIndexClass = 'z-50';
            else if (showDropdown || editingDevice?.id === device.id) zIndexClass = 'z-40';
            else if (isSelected) zIndexClass = 'z-30';
            else if (isExpanded || targetValid || isCableTarget) zIndexClass = 'z-20';

            return (
              <div key={device.id} className={`device-node absolute w-[280px] bg-white rounded-2xl shadow-lg border-2 transition-transform select-none flex flex-col pointer-events-auto touch-none ${zIndexClass} ${draggingDevice === device.id ? 'shadow-2xl scale-105' : 'hover:shadow-xl'} ${targetValid ? 'ring-4 ring-blue-400 ring-opacity-60 animate-pulse border-blue-400 cursor-pointer' : ''} ${isCableTarget ? 'ring-4 ring-indigo-500 border-indigo-500 shadow-indigo-500/20 shadow-2xl' : (isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-neutral-100')}`} style={{ left: device.x, top: device.y }} onPointerDown={(e) => startDrag(e, device.id, 'device')} onClick={(e) => { 
                e.stopPropagation(); 
                if (interactionMode === 'cable') {
                  if (!cableSource) setCableSource(device.id); else attemptAutoConnect(cableSource, device.id); return;
                }
                if (targetValid && !pendingConn && !editingDevice) completeConnection(device.id);
                if (showDropdown) setActiveDropdown(null);
              }}>
                {device.count > 1 && <div className={`absolute -bottom-2 -right-2 w-full h-full rounded-2xl border-2 -z-10 ${isSelected || isCableTarget ? (isCableTarget ? 'bg-indigo-100 border-indigo-300' : 'bg-blue-100 border-blue-300') : 'bg-neutral-200 border-neutral-300'}`}></div>}
                <div className={`flex items-center justify-between p-3 border-neutral-100 relative ${(isExpanded || device.note) ? 'border-b rounded-t-2xl' : 'rounded-2xl'} ${isCableTarget ? 'bg-indigo-50' : (isSelected ? 'bg-blue-50' : 'bg-neutral-50')}`}>
                  <div className="flex items-center gap-3 overflow-hidden flex-1 pl-1">
                    <div className={`p-2 rounded-xl text-white shrink-0 shadow-sm ${color}`}><Icon size={18} /></div>
                    <span className="font-bold text-sm text-neutral-800 break-words leading-tight pr-1 select-text" title={device.name}>{device.name}</span>
                    {device.count > 1 && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-md shrink-0 border border-blue-200 select-text">x{device.count}</span>}
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0 pr-1">
                    <button onClick={(e) => { e.stopPropagation(); setExpandedDevices(prev => prev.includes(device.id) ? prev.filter(id => id !== device.id) : [...prev, device.id]); setActiveDropdown(null); }} className={`text-neutral-500 hover:text-blue-600 transition-colors p-2 rounded-lg ${isSelected ? 'hover:bg-blue-100' : 'hover:bg-blue-50'}`}>{isExpanded ? <Minus size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}</button>
                    <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === device.id ? null : device.id); }} className={`text-neutral-500 hover:text-neutral-800 transition-colors p-2 rounded-lg ${showDropdown ? 'bg-neutral-200' : 'hover:bg-neutral-200'}`}><MoreVertical size={18} /></button>
                      {showDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-neutral-100 z-50 overflow-hidden py-1 animate-in slide-in-from-top-2 duration-150">
                          <button onClick={(e) => { e.stopPropagation(); setEditingDevice(device); setActiveDropdown(null); }} className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-blue-600 flex items-center gap-3 transition-colors font-medium"><Edit2 size={16} /> Редактировать</button>
                          <button onClick={(e) => { e.stopPropagation(); duplicateDevice(device); }} className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-blue-600 flex items-center gap-3 transition-colors font-medium"><Copy size={16} /> Дублировать</button>
                          <button onClick={(e) => { e.stopPropagation(); saveDeviceFromSchemaToLibrary(device); }} className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-emerald-600 flex items-center gap-3 transition-colors font-medium"><Save size={16} /> В библиотеку</button>
                          <div className="h-px bg-neutral-100 my-1 mx-2"></div>
                          <button onClick={(e) => { e.stopPropagation(); setDeviceToDelete(device.id); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"><Trash2 size={16} /> Удалить</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {device.note && (
                  <div className={`p-3 bg-amber-50/80 border-b border-amber-100/50 text-amber-900 text-xs leading-snug whitespace-pre-wrap relative overflow-hidden select-text ${!isExpanded ? 'rounded-b-2xl border-b-0' : ''}`}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                    <div className="flex gap-2"><FileText size={14} className="text-amber-500 shrink-0 mt-0.5" /><span>{device.note}</span></div>
                  </div>
                )}

                {isExpanded && (
                  <div className="p-4 bg-white rounded-b-2xl">
                    {(device.poeBudget > 0 || (device.poeDraw > 0 && device.count > 0)) && (
                      <div className="mb-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex flex-col gap-1.5 text-xs font-medium">
                        <div className="flex items-center gap-2.5 w-full">
                          <div className={`p-1.5 rounded-md ${usage.poe > device.poeBudget && device.poeBudget > 0 ? "bg-rose-100" : "bg-amber-100"}`}><Zap size={14} className={usage.poe > device.poeBudget && device.poeBudget > 0 ? "text-rose-600" : "text-amber-600"} /></div>
                          {device.poeBudget > 0 ? (
                            <div className="flex-1 flex justify-between items-center"><span className="text-neutral-500 font-semibold uppercase tracking-wide text-[10px]">PoE Бюджет</span><span className={`text-sm ${usage.poe > device.poeBudget ? "text-rose-600 font-bold" : "text-neutral-800 font-bold"}`}>{usage.poe} <span className="text-neutral-400 font-normal">/ {device.poeBudget} W</span></span></div>
                          ) : (
                            <div className="flex-1 flex justify-between items-center"><span className="text-neutral-500 font-semibold uppercase tracking-wide text-[10px]">Потребление</span><span className="text-neutral-800 font-bold text-sm">{device.poeDraw * device.count} <span className="text-neutral-400 font-normal">W</span></span></div>
                          )}
                        </div>
                        {device.poeBudget > 0 && device.poePerPort > 0 && <div className="flex justify-between pl-[34px] pr-0.5 text-[10px] text-neutral-400 font-semibold"><span>Макс. на порт:</span><span>{device.poePerPort} W</span></div>}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {Object.keys(PORT_LABELS).map(ptype => {
                        const maxPorts = (device.ports[ptype] || 0) * device.count; if (maxPorts === 0) return null;
                        const isFull = usage[ptype] >= maxPorts;
                        return (
                          <div key={ptype} className={`text-center rounded-xl p-2 border ${isFull ? 'bg-blue-50 border-blue-100' : 'bg-white border-neutral-200 shadow-sm'}`}>
                            <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isFull ? 'text-blue-500' : 'text-neutral-400'}`}>{PORT_LABELS[ptype]}</div>
                            <div className={`text-sm font-black ${isFull ? 'text-blue-700' : 'text-neutral-700'}`}>{usage[ptype]} <span className="text-neutral-400 font-medium text-xs">/ {maxPorts}</span></div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(PORT_LABELS).map(ptype => {
                        const maxPorts = (device.ports[ptype] || 0) * device.count; if (maxPorts === 0) return null;
                        const isEth = ptype === 'eth'; const isFull = usage[ptype] >= maxPorts;
                        let isTargetPort = false; let isSourcePort = false;
                        if (connectingMode) {
                          if (connectingMode.sourceId === device.id && connectingMode.type === ptype) isSourcePort = true;
                          else if (connectingMode.sourceId !== device.id) {
                            const reqType = connectingMode.type; const sourceDev = devices.find(d=>d.id===connectingMode.sourceId); const connCount = Math.max(sourceDev?.count || 1, device.count || 1);
                            if (reqType === 'eth' && ptype === 'eth') { if (usage[ptype] + connCount <= maxPorts) isTargetPort = true; } 
                            else if (['sfp', 'sfpPlus', 'sfp28'].includes(reqType) && ['sfp', 'sfpPlus', 'sfp28'].includes(ptype)) { if (usage[ptype] + connCount <= maxPorts) isTargetPort = true; }
                          }
                        }
                        const isDisabled = isFull || pendingConn || editingDevice || deviceToDelete || (connectingMode && !isTargetPort && !isSourcePort) || interactionMode === 'cable';
                        let colors = "";
                        if (isTargetPort) colors = "bg-blue-500 text-white border-blue-400 ring-2 ring-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse hover:bg-blue-600";
                        else if (isSourcePort) {
                          const sourceColors = { eth: "bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]", sfp: "bg-blue-700 text-white border-blue-800 ring-2 ring-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]", sfpPlus: "bg-purple-700 text-white border-purple-800 ring-2 ring-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]", sfp28: "bg-pink-700 text-white border-pink-800 ring-2 ring-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)]" };
                          colors = sourceColors[ptype] || "bg-neutral-800 text-white border-neutral-700 ring-2 ring-neutral-400";
                        } else colors = isEth ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" : ptype === 'sfp' ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200" : ptype === 'sfpPlus' ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200" : "bg-pink-50 text-pink-700 hover:bg-pink-100 border-pink-200";

                        return (
                          <button key={ptype} disabled={isDisabled && !isSourcePort} onClick={(e) => { e.stopPropagation(); if (isTargetPort) completeConnection(device.id, ptype); else if (isSourcePort) setConnectingMode(null); else startConnecting(device.id, ptype); }} className={`flex-1 text-xs py-2 rounded-lg border font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 ${colors}`}>+ {PORT_LABELS[ptype]}</button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Stickers Render Layer */}
          {stickers.map(sticker => {
            const isSelected = selectedIds.includes(sticker.id);
            return (
              <div key={sticker.id} className={`sticker-node absolute rounded-xl pointer-events-auto flex flex-col group transition-shadow shadow-md ${sticker.color} ${isSelected ? 'ring-4 ring-blue-500 border-blue-500 z-30' : 'border border-transparent z-20'} touch-none`} style={{ left: sticker.x, top: sticker.y, width: sticker.w, height: sticker.h }}>
                <div className="h-6 cursor-move shrink-0 flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity" onPointerDown={(e) => startDrag(e, sticker.id, 'sticker')} title="Переместить">
                  <div className="w-12 h-1.5 bg-yellow-800/20 rounded-full"></div>
                </div>
                <div className="absolute right-1 top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { takeSnapshot(); setStickers(st => st.filter(s => s.id !== sticker.id)); }} className="text-yellow-700/50 hover:text-red-600 hover:bg-red-400/20 rounded p-1 transition-all" onPointerDown={e => e.stopPropagation()} title="Удалить"><Trash2 size={14} /></button>
                </div>
                <textarea value={sticker.text} onChange={e => { takeSnapshot(); setStickers(st => st.map(s => s.id === sticker.id ? { ...s, text: e.target.value } : s)); }} className="bg-transparent border-none outline-none font-medium w-full h-full cursor-text resize-none px-3 pb-3 text-sm select-text" placeholder="Напишите заметку..." onPointerDown={e => e.stopPropagation()} />
                <div className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-1" onPointerDown={e => {
                  if (interactionMode === 'cable') return;
                  e.stopPropagation(); e.target.setPointerCapture(e.pointerId);
                  dragInfo.current = { startX: e.clientX, startY: e.clientY, initialPositions: { [sticker.id]: { w: sticker.w, h: sticker.h } }, initialState: getDeepState() };
                  setResizingSticker(sticker.id);
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-yellow-700/50">
                    <path d="M21 15l-6 6M21 9l-12 12M21 21" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}