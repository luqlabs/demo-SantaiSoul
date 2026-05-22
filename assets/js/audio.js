/**
 * SantaiSoul.com - Digital Healing Web Audio Synthesis Engine
 * Generates custom 432Hz/528Hz calming ambient drones and random pentatonic wind chimes in real-time.
 * Absolutely zero audio files required. All synthesized beautifully inside the client browser.
 */

class SantaiSoulHealingSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    
    // Nodes
    this.masterGain = null;
    this.droneGain = null;
    this.chimeGain = null;
    this.reverbNode = null;
    
    // Oscillators for drone chord
    this.oscillators = [];
    
    // Chime Scheduler Timer
    this.chimeTimer = null;
    
    // Active track presets
    this.currentPreset = 0;
    this.presets = [
      {
        name: "Grounding Earth (432Hz)",
        baseFreq: 432,
        harmonics: [1, 1.5, 2, 2.5], // Perfect fifths, octaves
        chimeScale: [432, 486, 540, 576, 648, 720, 864], // Pentatonic
        chimeRate: 2500,
        desc: "Deep earthy frequencies to calm the nervous system and release muscle tension."
      },
      {
        name: "Celestial Calm (528Hz)",
        baseFreq: 528,
        harmonics: [1, 1.333, 1.666, 2], // Perfect fourths, major sixths, octaves
        chimeScale: [528, 594, 660, 792, 880, 990, 1056],
        chimeRate: 1800,
        desc: "The Solfeggio frequency of transformation, mental clarity, and deep inner peace."
      },
      {
        name: "Aura Cleansing (396Hz)",
        baseFreq: 396,
        harmonics: [1, 1.2, 1.5, 1.8], // Minor chords for deep release
        chimeScale: [396, 445, 495, 594, 668, 792],
        chimeRate: 3500,
        desc: "Liberating guilt and fear, cleaning energy blocks to encourage feeling safe."
      }
    ];
  }

  init() {
    if (this.ctx) return;
    
    // Setup Audio Context
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Master Output Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    
    // Create simple delay node to mimic cozy spa reverb
    const delay = this.ctx.createDelay();
    delay.delayTime.setValueAtTime(0.4, this.ctx.currentTime);
    
    const feedback = this.ctx.createGain();
    feedback.gain.setValueAtTime(0.4, this.ctx.currentTime);
    
    // Wire delay loops
    delay.connect(feedback);
    feedback.connect(delay);
    
    // Main routing paths
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.12, this.ctx.currentTime); // Soft background drone
    
    this.chimeGain = this.ctx.createGain();
    this.chimeGain.gain.setValueAtTime(0.05, this.ctx.currentTime); // Soft wind chimes
    
    // Connections
    this.droneGain.connect(this.masterGain);
    this.chimeGain.connect(this.masterGain);
    
    // Feed chimes slightly into delay for spaciousness
    this.chimeGain.connect(delay);
    delay.connect(this.masterGain);
    
    this.masterGain.connect(this.ctx.destination);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    // Smooth master volume fade-in
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 2.0);
    
    this.isPlaying = true;
    this.startDroneChord();
    this.scheduleWindChimes();
  }

  stop() {
    if (!this.isPlaying) return;
    
    // Smooth fade-out before cutting
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 1.5);
    
    setTimeout(() => {
      this.stopDroneChord();
      if (this.chimeTimer) {
        clearTimeout(this.chimeTimer);
        this.chimeTimer = null;
      }
      this.isPlaying = false;
    }, 1600);
  }

  startDroneChord() {
    this.stopDroneChord();
    
    const preset = this.presets[this.currentPreset];
    const now = this.ctx.currentTime;
    
    // Spawn 4 oscillators to build a lush rich organ-like organic drone
    preset.harmonics.forEach((multiplier, i) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      // Use Sine and Triangle oscillators for soft pure woody tones
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      
      // Detune slightly to create soft binaural chorusing/movement
      const detune = (i - 1.5) * 1.5;
      osc.frequency.setValueAtTime(preset.baseFreq * multiplier, now);
      osc.detune.setValueAtTime(detune, now);
      
      // Gain of individual harmonics (high harmonics are quieter)
      const targetVolume = (0.05 / (i + 1));
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(targetVolume, now + 3.0);
      
      // LFO Gain Modulation to mimic dynamic breathing swell
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, now); // Very slow swell (12 seconds cycle)
      lfoGain.gain.setValueAtTime(0.008, now);
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      
      // Connect to output
      osc.connect(oscGain);
      oscGain.connect(this.droneGain);
      
      osc.start(now);
      lfo.start(now);
      
      this.oscillators.push({ osc, lfo, oscGain, lfoGain });
    });
  }

  stopDroneChord() {
    const now = this.ctx ? this.ctx.currentTime : 0;
    this.oscillators.forEach(group => {
      try {
        group.oscGain.gain.cancelScheduledValues(now);
        group.oscGain.gain.setValueAtTime(group.oscGain.gain.value, now);
        group.oscGain.gain.linearRampToValueAtTime(0, now + 1.0);
        
        setTimeout(() => {
          group.osc.stop();
          group.lfo.stop();
        }, 1200);
      } catch (err) {}
    });
    this.oscillators = [];
  }

  triggerSingleChime() {
    if (!this.isPlaying || !this.ctx) return;
    
    const preset = this.presets[this.currentPreset];
    const now = this.ctx.currentTime;
    
    // Pick random note from scale
    const note = preset.chimeScale[Math.floor(Math.random() * preset.chimeScale.length)];
    
    // Create soft chiming bell synth
    const osc = this.ctx.createOscillator();
    const chimeOscGain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, now);
    
    // Dynamic envelope (instant attack, long cozy decay)
    chimeOscGain.gain.setValueAtTime(0, now);
    chimeOscGain.gain.linearRampToValueAtTime(0.12, now + 0.01);
    chimeOscGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
    
    // Connect
    osc.connect(chimeOscGain);
    chimeOscGain.connect(this.chimeGain);
    
    osc.start(now);
    osc.stop(now + 4.0);
  }

  scheduleWindChimes() {
    if (!this.isPlaying) return;
    
    const preset = this.presets[this.currentPreset];
    
    // Random interval for natural breeze feeling
    const delay = preset.chimeRate + (Math.random() - 0.5) * 1500;
    
    this.chimeTimer = setTimeout(() => {
      // 70% chance to trigger a single chime, 30% chance for a double chime chime
      this.triggerSingleChime();
      if (Math.random() > 0.7) {
        setTimeout(() => this.triggerSingleChime(), 350 + Math.random() * 400);
      }
      this.scheduleWindChimes();
    }, delay);
  }

  setPreset(index) {
    if (index < 0 || index >= this.presets.length) return;
    this.currentPreset = index;
    if (this.isPlaying) {
      this.startDroneChord(); // Hot reload synthesis oscillators with new preset
    }
  }
}

// Instantiate Global Synth Engine
const healingSynth = new SantaiSoulHealingSynth();

// --- BIND HTML UI TO SYNTH ENGINE ---
document.addEventListener('DOMContentLoaded', () => {
  const globalSoundBtn = document.getElementById('global-sound-toggle');
  const globalSoundLabel = document.getElementById('global-sound-label');
  
  // Dashboard Audio UI Elements
  const dashboardPlayBtn = document.getElementById('dash-play-pause');
  const dashboardTracks = document.querySelectorAll('.playlist-track');
  const breathingStateText = document.getElementById('breathing-state-text');
  const breathingRing = document.getElementById('breathing-ring-core');
  
  let breathingInterval = null;

  // Global floating audio button toggler
  if (globalSoundBtn) {
    globalSoundBtn.addEventListener('click', () => {
      if (healingSynth.isPlaying) {
        healingSynth.stop();
        if (globalSoundLabel) globalSoundLabel.textContent = "Soothing Sounds";
        stopDashboardBreathingGuide();
        updateDashboardPlayBtnState(false);
      } else {
        healingSynth.start();
        if (globalSoundLabel) globalSoundLabel.textContent = "Silence Ambiance";
        startDashboardBreathingGuide();
        updateDashboardPlayBtnState(true);
      }
    });
  }

  // Dashboard Specific Audio Bindings
  if (dashboardPlayBtn) {
    dashboardPlayBtn.addEventListener('click', () => {
      if (healingSynth.isPlaying) {
        healingSynth.stop();
        stopDashboardBreathingGuide();
        updateDashboardPlayBtnState(false);
        if (globalSoundLabel) globalSoundLabel.textContent = "Soothing Sounds";
      } else {
        healingSynth.start();
        startDashboardBreathingGuide();
        updateDashboardPlayBtnState(true);
        if (globalSoundLabel) globalSoundLabel.textContent = "Silence Ambiance";
      }
    });
  }

  if (dashboardTracks.length > 0) {
    dashboardTracks.forEach((track, index) => {
      track.addEventListener('click', () => {
        // Toggle Active styles
        dashboardTracks.forEach(t => t.classList.remove('active'));
        track.classList.add('active');
        
        // Load Preset
        healingSynth.setPreset(index);
        
        // Update Title/Info dynamically on premium dashboard
        const currentTitleEl = document.getElementById('dash-current-track-title');
        const currentDescEl = document.getElementById('dash-current-track-desc');
        
        if (currentTitleEl) currentTitleEl.textContent = healingSynth.presets[index].name;
        if (currentDescEl) currentDescEl.textContent = healingSynth.presets[index].desc;
        
        // If not playing, force play
        if (!healingSynth.isPlaying) {
          healingSynth.start();
          startDashboardBreathingGuide();
          updateDashboardPlayBtnState(true);
        }
      });
    });
  }

  function updateDashboardPlayBtnState(isPlaying) {
    if (!dashboardPlayBtn) return;
    if (isPlaying) {
      dashboardPlayBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="color: var(--color-green-dark)">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      `;
    } else {
      dashboardPlayBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="color: var(--color-green-dark); margin-left: 3px;">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
    }
  }

  // Visual Breathing Swell Syncing
  function startDashboardBreathingGuide() {
    if (breathingInterval) clearInterval(breathingInterval);
    if (!breathingStateText || !breathingRing) return;
    
    let breathPhase = 0; // 0 = Inhale, 1 = Hold, 2 = Exhale, 3 = Hold
    
    const runBreathingLoop = () => {
      if (breathPhase === 0) {
        breathingStateText.textContent = "Breathe In";
        breathingRing.style.transform = "scale(3)";
        breathingRing.style.backgroundColor = "var(--color-gold-accent)";
        breathPhase = 1;
      } else if (breathPhase === 1) {
        breathingStateText.textContent = "Suspend";
        breathPhase = 2;
      } else if (breathPhase === 2) {
        breathingStateText.textContent = "Breathe Out";
        breathingRing.style.transform = "scale(1)";
        breathingRing.style.backgroundColor = "rgba(197, 168, 128, 0.4)";
        breathPhase = 3;
      } else {
        breathingStateText.textContent = "Rest";
        breathPhase = 0;
      }
    };
    
    runBreathingLoop();
    breathingInterval = setInterval(runBreathingLoop, 3000); // 3 seconds phase shifting (Perfect Pranayama breathing)
  }

  function stopDashboardBreathingGuide() {
    if (breathingInterval) {
      clearInterval(breathingInterval);
      breathingInterval = null;
    }
    if (breathingStateText) breathingStateText.textContent = "Sanctuary Paused";
    if (breathingRing) {
      breathingRing.style.transform = "scale(1)";
      breathingRing.style.backgroundColor = "var(--color-gold-accent)";
    }
  }
});
