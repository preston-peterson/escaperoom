import type { Condition, EffectDef, WorldDef } from './types.ts';
import { initialTopology, reachableRooms } from './topology.ts';
import { applyShift } from './topology.ts';

/**
 * Referential-integrity check for world data. Returns a list of problems;
 * empty means the world is structurally sound. Run in tests and in dev.
 */
export function validateWorld(world: WorldDef): string[] {
  const errors: string[] = [];
  const err = (msg: string) => errors.push(msg);

  const has = {
    room: (id: string) => world.rooms[id] !== undefined,
    passage: (id: string) => world.passages[id] !== undefined,
    puzzle: (id: string) => world.puzzles[id] !== undefined,
    item: (id: string) => world.items[id] !== undefined,
    journal: (id: string) => world.journal[id] !== undefined,
    shift: (id: string) => world.shifts[id] !== undefined,
  };

  const checkCondition = (cond: Condition, ctx: string) => {
    if ('solved' in cond && !has.puzzle(cond.solved))
      err(`${ctx}: condition references missing puzzle ${cond.solved}`);
    if ('hasItem' in cond && !has.item(cond.hasItem))
      err(`${ctx}: condition references missing item ${cond.hasItem}`);
    if ('visited' in cond && !has.room(cond.visited))
      err(`${ctx}: condition references missing room ${cond.visited}`);
    if ('not' in cond) checkCondition(cond.not, ctx);
    if ('all' in cond) cond.all.forEach((c) => checkCondition(c, ctx));
    if ('any' in cond) cond.any.forEach((c) => checkCondition(c, ctx));
  };

  const checkEffects = (effects: EffectDef[], ctx: string) => {
    for (const fx of effects) {
      if (fx.type === 'giveItem' && !has.item(fx.item))
        err(`${ctx}: gives missing item ${fx.item}`);
      if (fx.type === 'removeItem' && !has.item(fx.item))
        err(`${ctx}: removes missing item ${fx.item}`);
      if (fx.type === 'unlockJournal' && !has.journal(fx.entry))
        err(`${ctx}: unlocks missing journal entry ${fx.entry}`);
      if (fx.type === 'triggerShift' && !has.shift(fx.shift))
        err(`${ctx}: triggers missing shift ${fx.shift}`);
    }
  };

  // Record keys must match ids.
  for (const [record, name] of [
    [world.rooms, 'rooms'],
    [world.passages, 'passages'],
    [world.puzzles, 'puzzles'],
    [world.items, 'items'],
    [world.journal, 'journal'],
    [world.shifts, 'shifts'],
  ] as const) {
    for (const [key, def] of Object.entries(record)) {
      if (key !== (def as { id: string }).id)
        err(`${name}: key ${key} != id ${(def as { id: string }).id}`);
    }
  }

  if (!has.room(world.entryRoom)) err(`entryRoom ${world.entryRoom} missing`);
  if (!has.puzzle(world.finalPuzzle)) err(`finalPuzzle ${world.finalPuzzle} missing`);

  for (const p of Object.values(world.passages)) {
    if (!has.room(p.from)) err(`passage ${p.id}: missing room ${p.from}`);
    if (!has.room(p.to)) err(`passage ${p.id}: missing room ${p.to}`);
  }

  for (const roomId of Object.keys(world.rooms)) {
    if (!world.map.rooms[roomId]) err(`map: no layout for room ${roomId}`);
  }
  for (const roomId of Object.keys(world.map.rooms)) {
    if (!has.room(roomId)) err(`map: layout for missing room ${roomId}`);
  }

  for (const room of Object.values(world.rooms)) {
    if (room.onFirstEnter) checkEffects(room.onFirstEnter, `room ${room.id}`);
    const seenHotspots = new Set<string>();
    for (const layer of room.scene.layers) {
      if (layer.if) checkCondition(layer.if, `room ${room.id} layer`);
    }
    for (const hs of room.scene.hotspots) {
      const ctx = `room ${room.id} hotspot ${hs.id}`;
      if (seenHotspots.has(hs.id)) err(`${ctx}: duplicate hotspot id`);
      seenHotspots.add(hs.id);
      if (hs.if) checkCondition(hs.if, ctx);
      if (hs.hideWhen) checkCondition(hs.hideWhen, ctx);
      switch (hs.action.type) {
        case 'inspect':
          if (hs.action.effects) checkEffects(hs.action.effects, ctx);
          break;
        case 'pickup':
          if (!has.item(hs.action.item)) err(`${ctx}: missing item`);
          break;
        case 'puzzle':
          if (!has.puzzle(hs.action.puzzle)) err(`${ctx}: missing puzzle`);
          break;
        case 'navigate':
          if (!has.passage(hs.action.passage)) err(`${ctx}: missing passage`);
          break;
        case 'useItem':
          hs.action.accepts.forEach((i) => {
            if (!has.item(i)) err(`${ctx}: accepts missing item ${i}`);
          });
          checkEffects(hs.action.effects, ctx);
          break;
      }
    }
  }

  for (const puzzle of Object.values(world.puzzles)) {
    const ctx = `puzzle ${puzzle.id}`;
    if (puzzle.if) checkCondition(puzzle.if, ctx);
    checkEffects(puzzle.onSolve, ctx);
    if (puzzle.hints.some((h) => h.trim().length === 0))
      err(`${ctx}: empty hint tier`);
    switch (puzzle.type) {
      case 'combination':
        if (puzzle.answer.length !== puzzle.slots)
          err(`${ctx}: answer length != slots`);
        puzzle.answer.forEach((a) => {
          if (!puzzle.symbols.includes(a))
            err(`${ctx}: answer symbol ${a} not in symbols`);
        });
        break;
      case 'sequence': {
        const ids = new Set(puzzle.elements.map((e) => e.id));
        puzzle.answer.forEach((a) => {
          if (!ids.has(a)) err(`${ctx}: answer element ${a} not in elements`);
        });
        break;
      }
      case 'rotary':
        if (puzzle.answer.length !== puzzle.rings.length)
          err(`${ctx}: answer length != rings`);
        puzzle.answer.forEach((a, i) => {
          if (a < 0 || a >= puzzle.rings[i].positions)
            err(`${ctx}: answer ${a} out of range for ring ${i}`);
        });
        puzzle.rings.forEach((r) => {
          if (r.glyphs.length !== r.positions)
            err(`${ctx}: ring ${r.id} glyphs != positions`);
        });
        break;
      case 'itemPlacement':
        puzzle.sockets.forEach((s) => {
          if (!has.item(s.accepts))
            err(`${ctx}: socket ${s.id} accepts missing item ${s.accepts}`);
        });
        break;
      case 'cipher':
        break;
      case 'accusation': {
        if (puzzle.answer.length !== puzzle.categories.length)
          err(`${ctx}: answer length != categories`);
        puzzle.categories.forEach((cat, i) => {
          const ids = new Set<string>();
          cat.options.forEach((o) => {
            if (ids.has(o.id)) err(`${ctx}: duplicate option id ${o.id} in ${cat.id}`);
            ids.add(o.id);
          });
          if (cat.options.length < 3)
            err(`${ctx}: category ${cat.id} needs >= 3 options`);
          if (puzzle.answer[i] !== undefined && !ids.has(puzzle.answer[i]))
            err(`${ctx}: answer ${puzzle.answer[i]} not an option of ${cat.id}`);
        });
        // Evidence grounding: every answer option's label must be discoverable
        // in the journal — the accusation may never hinge on facts the world
        // doesn't contain.
        const journalText = Object.values(world.journal)
          .map((j) => `${j.title}\n${j.body}`)
          .join('\n')
          .toLowerCase();
        puzzle.categories.forEach((cat, i) => {
          const opt = cat.options.find((o) => o.id === puzzle.answer[i]);
          if (opt && !journalText.includes(opt.label.toLowerCase()))
            err(`${ctx}: answer label "${opt.label}" appears in no journal entry`);
        });
        break;
      }
    }
  }

  for (const ach of world.achievements) {
    if (ach.check === 'puzzleFirstTry' && !has.puzzle(ach.puzzle))
      err(`achievement ${ach.id}: references missing puzzle ${ach.puzzle}`);
  }

  for (const shift of Object.values(world.shifts)) {
    for (const op of shift.ops) {
      if (!has.passage(op.passage))
        err(`shift ${shift.id}: op references missing passage ${op.passage}`);
    }
    if (shift.animTarget && !has.room(shift.animTarget))
      err(`shift ${shift.id}: animTarget room missing`);
  }

  // Every room reachable once all shifts have fired and everything is open.
  let topo = initialTopology(world);
  for (const shift of Object.values(world.shifts)) topo = applyShift(topo, shift);
  for (const id of Object.keys(topo)) topo[id] = { ...topo[id], open: true };
  const reachable = reachableRooms(topo, world.entryRoom);
  for (const roomId of Object.keys(world.rooms)) {
    if (!reachable.has(roomId))
      err(`room ${roomId} unreachable even with all passages open`);
  }

  return errors;
}
