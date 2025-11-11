<template>
  <div
    class="w-[1080px] h-[1920px] max-w-[1080px] max-h-[1920px]"
    :class="{
      'start-back': !showMachine,
      'main-back': showMachine,
    }"
  >
    <!-- Start Screen -->
    <div
      v-if="!showMachine && !store.showWinDisplay"
      class="flex flex-col justify-center items-center text-center"
    >
      <div class="flex flex-col justify-center items-center mt-[741px]!">
        <img src="../assets/images/logo.svg" alt="logo" class="mb-14!" />
        <h1 class="font-bold text-[150px] text-white leading-40">{{ $t('miniSlot') }}</h1>
      </div>
      <button
        @click="start"
        class="uppercase text-[96px] text-white font-bold pb-5! px-33.5! rounded-[10000px] bg-linear-to-tr from-[#3C1082] to-[#AE00FF] border-10 border-solid border-[#AE00FF] mt-[346px]!"
      >
        {{ $t('startGame') }}
      </button>
    </div>
    <div
      v-if="showMachine && !store.showWinDisplay"
      class="flex flex-col items-center justify-center text-center"
    >
      <img src="../assets/images/logo.svg" alt="logo" class="mb-42! pt-42!" />
      <div class="machine-body">
        <div class="reels-container">
          <div v-for="row in 3" :key="row" class="reel-row">
            <MiniReel
              v-for="col in 3"
              :key="`${row}-${col}`"
              :symbol-id="getCurrentSymbol(row - 1, col - 1)"
              :is-spinning="store.isSpinning"
              :delay="(row - 1) * 300 + (col - 1) * 100"
            />
          </div>
        </div>

        <div
          class="win-lines-overlay"
          v-if="store.currentResult && store.currentResult.totalWin > 0 && !store.isSpinning"
        >
          <svg class="lines-svg">
            <line
              v-for="(win, index) in store.currentResult.winningLines"
              :key="index"
              :x1="getLineCoords(win.line.line[0] ?? [0, 0]).x"
              :y1="getLineCoords(win.line.line[0] ?? [0, 0]).y"
              :x2="getLineCoords(win.line.line[2] ?? [0, 0]).x"
              :y2="getLineCoords(win.line.line[2] ?? [0, 0]).y"
              stroke="black"
              stroke-width="6"
              stroke-linecap="round"
              class="win-line-animation"
              :style="{ animationDelay: `${index * 0.2}s` }"
            />
          </svg>
        </div>
      </div>

      <div class="mt-42!">
        <button
          v-if="gameStarted"
          :disabled="!store.canSpin"
          @click="handleSpin"
          class="uppercase text-[96px] text-white font-bold pb-5! rounded-[10000px] bg-linear-to-tr from-[#3C1082] to-[#AE00FF] border-10 border-solid border-[#AE00FF]"
          :class="{ 'px-74!': !store.isSpinning, 'px-45!': store.isSpinning }"
        >
          {{ store.isSpinning ? $t('spin') : $t('start') }}
        </button>
      </div>
    </div>
    <WinDisplay
      v-if="store.showWinDisplay"
      :result="store.currentResult"
      :show="store.showWinDisplay"
      @play-again="start"
      @go-to-start="resetGame"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameStore } from '../stores/game'
import MiniReel from './MiniReel.vue'
import WinDisplay from './WinDisplay.vue'

const store = useGameStore()
const showMachine = ref(false)
const gameStarted = ref(false)

const getCurrentSymbol = (row: number, col: number): string => {
  if (!store.currentResult) {
    // Показываем начальные символы
    const defaultSymbols = [
      ['watermelon', 'lemon', 'grape'],
      ['cherry', 'diamond', 'seven'],
      ['grape', 'watermelon', 'lemon'],
    ]
    return defaultSymbols[row]?.[col] ?? ''
  }
  return store.currentResult.symbols[row]?.[col] ?? ''
}

const handleSpin = async () => {
  await store.spin()
}

const cellWidth = 240 // ширина MiniReel
const cellHeight = 240 // высота MiniReel
const gap = 6 // gap между слотами

function getLineCoords(position: number[]) {
  const [row, col] = position

  return {
    x: col! * (cellWidth + gap) + cellWidth / 2,
    y: row! * (cellHeight + gap) + cellHeight / 2,
  }
}

function resetGame() {
  store.resetGame()
  showMachine.value = false
}

function start() {
  store.resetGame()
  showMachine.value = true
  gameStarted.value = true
}
watch(
  () => store.isSpinning,
  (v) => {
    if (!v) {
      gameStarted.value = false
    }
  },
)
</script>

<style scoped>
.machine-body {
  position: relative;
}

.reels-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reel-row {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.win-lines-overlay {
  position: absolute;
  top: 30px;
  left: 30px;
  right: 30px;
  bottom: 30px;
  pointer-events: none;
}

.lines-svg {
  width: 100%;
  height: 100%;
}

.win-line-animation {
  stroke: #0ff; /* яркий голубой неон */
  stroke-width: 6;
  stroke-linecap: round;
  opacity: 0;
  filter: drop-shadow(0 0 8px #0ff) drop-shadow(0 0 16px #0ff) drop-shadow(0 0 24px #0ff);
  animation:
    neonLineAppear 0.5s ease-out forwards,
    neonGlow 1.5s ease-in-out infinite alternate;
}

@keyframes neonLineAppear {
  to {
    opacity: 1;
  }
}

@keyframes neonGlow {
  from {
    filter: drop-shadow(0 0 4px #0ff) drop-shadow(0 0 8px #0ff) drop-shadow(0 0 12px #0ff);
  }
  to {
    filter: drop-shadow(0 0 12px #0ff) drop-shadow(0 0 24px #0ff) drop-shadow(0 0 36px #0ff);
  }
}

@keyframes lineAppear {
  to {
    opacity: 1;
  }
}

.paytable {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
}

.paytable h3 {
  text-align: center;
  color: #ffd700;
  font-size: 24px;
  margin: 0 0 20px;
}

.paytable-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.paytable-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.paytable-item:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateX(5px);
}

.symbol-display {
  font-size: 28px;
  flex: 1;
}

.multiplier {
  font-size: 20px;
  font-weight: bold;
  color: #ffd700;
  flex: 1;
  text-align: center;
}

.payout {
  font-size: 18px;
  color: #aaa;
  flex: 1;
  text-align: right;
}
.start-back {
  background-image: url('../assets/images/start-back.png');
}
.main-back {
  background-image: url('../assets/images/main-back.png');
}
</style>
