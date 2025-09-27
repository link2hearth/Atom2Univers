(function () {
  if (typeof window === 'undefined') {
    return;
  }

  const SOUND_PRESETS_KEY = 'atom2univers.soundDesigner.presets.v1';
  const SOUND_ASSIGNMENTS_KEY = 'atom2univers.soundDesigner.assignments.v1';
  const STORAGE_VERSION = 1;
  const MAX_PRESETS = 16;

  const DEFAULT_PRESETS = [
    {
      id: 'preset-cosmic-pop',
      name: 'Pop quantique',
      oscillatorType: 'sine',
      frequency: 520,
      duration: 0.32,
      attack: 0.005,
      decay: 0.18,
      sustain: 0.2,
      release: 0.3,
      volume: -4
    },
    {
      id: 'preset-crit-flare',
      name: 'Éclair critique',
      oscillatorType: 'triangle',
      frequency: 880,
      duration: 0.5,
      attack: 0.01,
      decay: 0.22,
      sustain: 0.3,
      release: 0.45,
      volume: -2
    }
  ];

  const EFFECT_LABELS = {
    pop: "Clic principal",
    crit: "Coup critique"
  };

  const LEGACY_DEFAULT_ASSIGNMENTS = {
    pop: DEFAULT_PRESETS[0].id,
    crit: DEFAULT_PRESETS[1].id
  };

  const state = {
    presets: [],
    assignments: {}
  };

  const changeListeners = new Set();

  function emitChange() {
    changeListeners.forEach(listener => {
      try {
        listener({
          presets: state.presets.slice(),
          assignments: Object.assign({}, state.assignments)
        });
      } catch (error) {
        // Ignore listener errors to avoid breaking the designer.
      }
    });
  }

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      return null;
    }
  }

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function clamp(value, min, max) {
    const number = Number(value);
    if (!isFinite(number)) {
      return min;
    }
    return Math.min(Math.max(number, min), max);
  }

  function normalizePreset(preset) {
    if (!preset || typeof preset !== 'object') {
      return null;
    }
    const normalized = {
      id: typeof preset.id === 'string' && preset.id.trim() ? preset.id.trim() : generatePresetId(),
      name: typeof preset.name === 'string' && preset.name.trim() ? preset.name.trim() : 'Effet sans nom',
      oscillatorType: ['sine', 'square', 'triangle', 'sawtooth'].includes(preset.oscillatorType)
        ? preset.oscillatorType
        : 'sine',
      frequency: clamp(preset.frequency, 40, 4000),
      duration: clamp(preset.duration, 0.05, 4),
      attack: clamp(preset.attack, 0, 2),
      decay: clamp(preset.decay, 0, 3),
      sustain: clamp(preset.sustain, 0, 1),
      release: clamp(preset.release, 0, 4),
      volume: clamp(preset.volume, -48, 6)
    };
    return normalized;
  }

  function generatePresetId() {
    return `preset-${Math.random().toString(36).slice(2, 7)}-${Date.now().toString(36)}`;
  }

  function loadPresets() {
    const stored = safeParse(readStorage(SOUND_PRESETS_KEY));
    const presets = Array.isArray(stored) ? stored.map(normalizePreset).filter(Boolean) : [];
    if (presets.length) {
      return presets.slice(0, MAX_PRESETS);
    }
    return DEFAULT_PRESETS.slice();
  }

  function loadAssignments(presets) {
    const stored = safeParse(readStorage(SOUND_ASSIGNMENTS_KEY));
    const version = stored && typeof stored.__version === 'number' ? stored.__version : 0;
    const assignments = stored && typeof stored === 'object' && !Array.isArray(stored)
      ? Object.assign({}, stored)
      : {};
    delete assignments.__version;
    const presetIds = new Set(presets.map(preset => preset.id));
    const resolved = {};
    Object.keys(EFFECT_LABELS).forEach(effectId => {
      const saved = typeof assignments[effectId] === 'string' ? assignments[effectId] : null;
      if (saved && presetIds.has(saved)) {
        resolved[effectId] = saved;
      }
    });
    Object.keys(EFFECT_LABELS).forEach(effectId => {
      if (
        version < STORAGE_VERSION &&
        LEGACY_DEFAULT_ASSIGNMENTS[effectId] &&
        resolved[effectId] === LEGACY_DEFAULT_ASSIGNMENTS[effectId]
      ) {
        resolved[effectId] = null;
      }
      if (!presetIds.has(resolved[effectId])) {
        resolved[effectId] = null;
      }
    });
    return resolved;
  }

  function persistState() {
    try {
      window.localStorage.setItem(SOUND_PRESETS_KEY, JSON.stringify(state.presets));
      const serializedAssignments = { __version: STORAGE_VERSION };
      Object.keys(EFFECT_LABELS).forEach(effectId => {
        const value = state.assignments[effectId];
        serializedAssignments[effectId] = typeof value === 'string' ? value : null;
      });
      window.localStorage.setItem(SOUND_ASSIGNMENTS_KEY, JSON.stringify(serializedAssignments));
    } catch (error) {
      // Ignore storage errors (private mode, quota, etc.)
    }
  }

  function getPresetById(presetId) {
    return state.presets.find(preset => preset.id === presetId) || null;
  }

  function getAssignedPreset(effectId) {
    const presetId = state.assignments[effectId];
    return presetId ? getPresetById(presetId) : null;
  }

  function ensureToneReady() {
    if (!window.Tone || window.Tone.isSupported === false) {
      return false;
    }
    const startPromise = typeof window.Tone.start === 'function' ? window.Tone.start() : Promise.resolve();
    if (startPromise && typeof startPromise.catch === 'function') {
      startPromise.catch(() => {});
    }
    return true;
  }

  function playPreset(preset) {
    if (!preset || !ensureToneReady() || !window.Tone || typeof window.Tone.Synth !== 'function') {
      return false;
    }
    try {
      const synth = new window.Tone.Synth({
        oscillator: { type: preset.oscillatorType },
        envelope: {
          attack: preset.attack,
          decay: preset.decay,
          sustain: preset.sustain,
          release: preset.release
        }
      });
      if (synth.volume && typeof synth.volume.value === 'number') {
        synth.volume.value = preset.volume;
      }
      if (typeof synth.connect === 'function') {
        synth.connect(window.Tone.Destination || window.Tone.context.destination);
      }
      const duration = Math.max(0.05, Number(preset.duration) || 0.3);
      synth.triggerAttackRelease(preset.frequency, duration, window.Tone.now ? window.Tone.now() : undefined);
      const disposeDelay = (duration + Math.max(0.05, preset.release || 0.1) + 0.3) * 1000;
      setTimeout(() => {
        if (typeof synth.dispose === 'function') {
          synth.dispose();
        } else if (typeof synth.disconnect === 'function') {
          synth.disconnect();
        }
      }, disposeDelay);
      return true;
    } catch (error) {
      return false;
    }
  }

  function createEffectPlayer(effectId, fallbackPlayer) {
    return {
      play() {
        const preset = getAssignedPreset(effectId);
        if (preset && playPreset(preset)) {
          return;
        }
        if (fallbackPlayer && typeof fallbackPlayer.play === 'function') {
          fallbackPlayer.play();
        }
      }
    };
  }

  const bridge = {
    createSoundEffects(fallbacks) {
      const fallbackPlayers = fallbacks || {};
      return {
        pop: createEffectPlayer('pop', fallbackPlayers.pop),
        crit: createEffectPlayer('crit', fallbackPlayers.crit)
      };
    },
    playPreset,
    getPresetById,
    getAssignments() {
      return Object.assign({}, state.assignments);
    },
    onChange(callback) {
      if (typeof callback !== 'function') {
        return () => {};
      }
      changeListeners.add(callback);
      return () => changeListeners.delete(callback);
    }
  };

  window.SoundDesignerBridge = bridge;

  state.presets = loadPresets();
  state.assignments = loadAssignments(state.presets);

  function setState(update) {
    if (update.presets) {
      state.presets = update.presets.slice(0, MAX_PRESETS);
    }
    if (update.assignments) {
      state.assignments = Object.assign({}, update.assignments);
    }
    persistState();
    emitChange();
  }

  function formatFrequency(value) {
    return `${Math.round(value)} Hz`;
  }

  function formatSeconds(value) {
    return `${value.toFixed(2)} s`;
  }

  function formatVolume(value) {
    return `${Math.round(value)} dB`;
  }

  function describeAssignment(effectId) {
    if (!effectId) {
      return 'Aucun effet assigné';
    }
    const label = EFFECT_LABELS[effectId] || effectId;
    return `Assigné : ${label}`;
  }

  const overlay = document.getElementById('soundDesignerOverlay');
  const panel = document.getElementById('soundDesignerPanel');
  const openButton = document.getElementById('soundDesignerOpenButton');
  const closeButton = document.getElementById('soundDesignerCloseButton');
  const statusElement = document.getElementById('soundDesignerStatus');
  const form = document.getElementById('soundDesignerForm');
  const presetListElement = document.getElementById('soundDesignerPresetList');
  const newButton = document.getElementById('soundDesignerNew');
  const previewButton = document.getElementById('soundDesignerPreview');
  const deleteButton = document.getElementById('soundDesignerDelete');

  if (!overlay || !panel || !openButton || !closeButton || !form || !presetListElement) {
    return;
  }

  const fields = {
    name: document.getElementById('soundDesignerName'),
    target: document.getElementById('soundDesignerTarget'),
    oscillator: document.getElementById('soundDesignerOscillator'),
    frequency: document.getElementById('soundDesignerFrequency'),
    duration: document.getElementById('soundDesignerDuration'),
    attack: document.getElementById('soundDesignerAttack'),
    decay: document.getElementById('soundDesignerDecay'),
    sustain: document.getElementById('soundDesignerSustain'),
    release: document.getElementById('soundDesignerRelease'),
    volume: document.getElementById('soundDesignerVolume')
  };

  const outputs = {
    frequency: document.getElementById('soundDesignerFrequencyValue'),
    duration: document.getElementById('soundDesignerDurationValue'),
    attack: document.getElementById('soundDesignerAttackValue'),
    decay: document.getElementById('soundDesignerDecayValue'),
    sustain: document.getElementById('soundDesignerSustainValue'),
    release: document.getElementById('soundDesignerReleaseValue'),
    volume: document.getElementById('soundDesignerVolumeValue')
  };

  let editingPresetId = null;

  function updateOutputs() {
    if (outputs.frequency) {
      outputs.frequency.textContent = formatFrequency(Number(fields.frequency.value));
    }
    if (outputs.duration) {
      outputs.duration.textContent = formatSeconds(Number(fields.duration.value));
    }
    if (outputs.attack) {
      outputs.attack.textContent = formatSeconds(Number(fields.attack.value));
    }
    if (outputs.decay) {
      outputs.decay.textContent = formatSeconds(Number(fields.decay.value));
    }
    if (outputs.sustain) {
      outputs.sustain.textContent = Number(fields.sustain.value).toFixed(2);
    }
    if (outputs.release) {
      outputs.release.textContent = formatSeconds(Number(fields.release.value));
    }
    if (outputs.volume) {
      outputs.volume.textContent = formatVolume(Number(fields.volume.value));
    }
  }

  function resetForm(preset) {
    const targetPreset = preset || getPresetById(state.assignments.pop) || DEFAULT_PRESETS[0];
    editingPresetId = preset ? preset.id : null;
    fields.name.value = preset ? preset.name : 'Nouvel effet';
    fields.target.value = '';
    Object.keys(EFFECT_LABELS).forEach(effectId => {
      if (state.assignments[effectId] === (preset && preset.id)) {
        fields.target.value = effectId;
      }
    });
    fields.oscillator.value = targetPreset.oscillatorType;
    fields.frequency.value = targetPreset.frequency;
    fields.duration.value = targetPreset.duration;
    fields.attack.value = targetPreset.attack;
    fields.decay.value = targetPreset.decay;
    fields.sustain.value = targetPreset.sustain;
    fields.release.value = targetPreset.release;
    fields.volume.value = targetPreset.volume;
    updateOutputs();
    deleteButton.hidden = !preset;
  }

  function renderPresetList() {
    presetListElement.innerHTML = '';
    state.presets.forEach(preset => {
      const container = document.createElement('article');
      container.className = 'sound-designer-preset';
      container.dataset.presetId = preset.id;

      const header = document.createElement('div');
      header.className = 'sound-designer-preset__header';
      const title = document.createElement('h4');
      title.className = 'sound-designer-preset__title';
      title.textContent = preset.name;
      header.appendChild(title);

      const assignmentInfo = document.createElement('p');
      assignmentInfo.className = 'sound-designer-preset__assignment';
      let assignedEffect = '';
      Object.keys(EFFECT_LABELS).forEach(effectId => {
        if (state.assignments[effectId] === preset.id) {
          assignedEffect = effectId;
        }
      });
      assignmentInfo.textContent = describeAssignment(assignedEffect);

      const meta = document.createElement('p');
      meta.className = 'sound-designer-preset__meta';
      meta.innerHTML = `
        <span>${preset.oscillatorType}</span>
        <span>${formatFrequency(preset.frequency)}</span>
        <span>${formatSeconds(preset.duration)}</span>
      `;

      const actions = document.createElement('div');
      actions.className = 'sound-designer-preset__actions';

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'sound-designer-preset__button';
      editButton.textContent = 'Éditer';
      editButton.addEventListener('click', () => {
        resetForm(preset);
        openOverlay();
      });

      const preview = document.createElement('button');
      preview.type = 'button';
      preview.className = 'sound-designer-preset__button';
      preview.textContent = 'Prévisualiser';
      preview.addEventListener('click', () => {
        playPreset(preset);
      });

      const assignSelect = document.createElement('select');
      assignSelect.className = 'sound-designer-preset__button';
      assignSelect.setAttribute('aria-label', 'Affecter cet effet');
      const noneOption = document.createElement('option');
      noneOption.value = '';
      noneOption.textContent = 'Aucun';
      assignSelect.appendChild(noneOption);
      Object.keys(EFFECT_LABELS).forEach(effectId => {
        const option = document.createElement('option');
        option.value = effectId;
        option.textContent = EFFECT_LABELS[effectId];
        if (state.assignments[effectId] === preset.id) {
          assignSelect.value = effectId;
        }
        assignSelect.appendChild(option);
      });
      assignSelect.addEventListener('change', event => {
        const effectId = event.target.value;
        const nextAssignments = Object.assign({}, state.assignments);
        Object.keys(EFFECT_LABELS).forEach(id => {
          if (nextAssignments[id] === preset.id) {
            nextAssignments[id] = null;
          }
        });
        if (effectId) {
          nextAssignments[effectId] = preset.id;
        }
        setState({ assignments: nextAssignments });
        renderPresetList();
      });

      actions.appendChild(editButton);
      actions.appendChild(preview);
      actions.appendChild(assignSelect);

      container.appendChild(header);
      container.appendChild(assignmentInfo);
      container.appendChild(meta);
      container.appendChild(actions);

      presetListElement.appendChild(container);
    });
  }

  function openOverlay() {
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sound-designer-open');
    setTimeout(() => {
      panel.focus();
    }, 0);
  }

  function closeOverlay() {
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sound-designer-open');
    editingPresetId = null;
  }

  function collectFormData() {
    return {
      id: editingPresetId || generatePresetId(),
      name: fields.name.value.trim() || 'Effet personnalisé',
      oscillatorType: fields.oscillator.value,
      frequency: Number(fields.frequency.value),
      duration: Number(fields.duration.value),
      attack: Number(fields.attack.value),
      decay: Number(fields.decay.value),
      sustain: Number(fields.sustain.value),
      release: Number(fields.release.value),
      volume: Number(fields.volume.value)
    };
  }

  function savePreset(event) {
    event.preventDefault();
    const formData = normalizePreset(collectFormData());
    if (!formData) {
      return;
    }
    const presets = state.presets.slice();
    const existingIndex = presets.findIndex(preset => preset.id === formData.id);
    if (existingIndex >= 0) {
      presets[existingIndex] = formData;
    } else {
      if (presets.length >= MAX_PRESETS) {
        presets.shift();
      }
      presets.push(formData);
    }
    const assignments = Object.assign({}, state.assignments);
    Object.keys(EFFECT_LABELS).forEach(effectId => {
      if (assignments[effectId] === formData.id) {
        assignments[effectId] = formData.id;
      }
    });
    const targetEffect = fields.target.value;
    if (targetEffect) {
      assignments[targetEffect] = formData.id;
    }
    setState({ presets, assignments });
    renderPresetList();
    if (statusElement) {
      statusElement.textContent = 'Effet enregistré';
      setTimeout(() => {
        statusElement.textContent = '';
      }, 1800);
    }
    editingPresetId = formData.id;
    deleteButton.hidden = false;
  }

  function deletePreset() {
    if (!editingPresetId) {
      return;
    }
    const filtered = state.presets.filter(preset => preset.id !== editingPresetId);
    const assignments = Object.assign({}, state.assignments);
    Object.keys(assignments).forEach(effectId => {
      if (assignments[effectId] === editingPresetId) {
        assignments[effectId] = null;
      }
    });
    setState({ presets: filtered, assignments });
    renderPresetList();
    resetForm(filtered[0] || DEFAULT_PRESETS[0]);
  }

  function handleOverlayClick(event) {
    if (event.target === overlay) {
      closeOverlay();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeOverlay();
    }
  }

  Object.values(fields).forEach(field => {
    if (!field) {
      return;
    }
    field.addEventListener('input', updateOutputs);
  });

  previewButton.addEventListener('click', () => {
    const preset = normalizePreset(collectFormData());
    playPreset(preset);
  });

  newButton.addEventListener('click', () => {
    editingPresetId = null;
    resetForm(DEFAULT_PRESETS[0]);
  });

  openButton.addEventListener('click', () => {
    resetForm();
    renderPresetList();
    openOverlay();
  });

  closeButton.addEventListener('click', () => {
    closeOverlay();
  });

  overlay.addEventListener('click', handleOverlayClick);
  window.addEventListener('keydown', handleKeydown);
  form.addEventListener('submit', savePreset);
  deleteButton.addEventListener('click', deletePreset);

  renderPresetList();
  resetForm();
  closeOverlay();

  if (statusElement) {
    statusElement.textContent = window.Tone && window.Tone.isSupported !== false
      ? 'Tone.js prêt'
      : 'Audio Web non disponible';
  }
})();
