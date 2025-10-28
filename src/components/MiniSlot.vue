<template>
  <div class="slot-machine">
    <div class="machine-header">
      <h1 class="game-title">🎰 Мини-Слот 21 🎰</h1>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Баланс:</span>
          <span class="stat-value">{{ store.balance }} 💰</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Спинов:</span>
          <span class="stat-value">{{ store.totalSpins }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Побед:</span>
          <span class="stat-value">{{ store.totalWins }} ({{ store.winRate }}%)</span>
        </div>
      </div>
    </div>

    <div class="machine-body">
      <div class="reels-container">
        <div v-for="row in 3" :key="row" class="reel-row">
          <SlotReel
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
            :x1="getLineCoords(win.line.line[0]).x"
            :y1="getLineCoords(win.line.line[0]).y"
            :x2="getLineCoords(win.line.line[2]).x"
            :y2="getLineCoords(win.line.line[2]).y"
            :stroke="win.symbol.color"
            stroke-width="6"
            stroke-linecap="round"
            class="win-line-animation"
            :style="{ animationDelay: `${index * 0.2}s` }"
          />
        </svg>
      </div>
    </div>

    <div class="machine-controls">
      <button
        class="spin-button"
        :class="{ spinning: store.isSpinning, disabled: !store.canSpin }"
        :disabled="!store.canSpin"
        @click="handleSpin"
      >
        <span v-if="store.isSpinning">⏳ ВРАЩЕНИЕ...</span>
        <span v-else-if="store.balance < 10">💸 НЕ ХВАТАЕТ МОНЕТ</span>
        <span v-else>🎲 СТАРТ (10 коинов)</span>
      </button>

      <button class="reset-button" @click="store.resetGame">🔄 СБРОСИТЬ</button>
    </div>

    <div class="paytable">
      <h3>💎 Таблица выплат</h3>
      <div class="paytable-items">
        <div
          v-for="symbol in symbols"
          :key="symbol.id"
          class="paytable-item"
          :style="{ borderLeftColor: symbol.color }"
        >
          <span class="symbol-display">{{ symbol.icon }} × 3</span>
          <span class="multiplier">{{ symbol.multiplier }}x</span>
          <span class="payout">{{ symbol.multiplier * 10 }} коинов</span>
        </div>
      </div>
    </div>

    <WinDisplay
      :result="store.currentResult"
      :show="store.showWinDisplay"
      @close="handleCloseWin"
    />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game'
import { SYMBOLS } from '../utils/gameLogic'
import SlotReel from './Reel.vue'
import WinDisplay from './WinDisplay.vue'

const store = useGameStore()
const symbols = SYMBOLS

const getCurrentSymbol = (row: number, col: number): string => {
  if (!store.currentResult) {
    // Показываем начальные символы
    const defaultSymbols = [
      ['watermelon', 'lemon', 'grape'],
      ['cherry', 'diamond', 'seven'],
      ['grape', 'watermelon', 'lemon'],
    ]
    return defaultSymbols[row][col]
  }
  return store.currentResult.symbols[row][col]
}

const handleSpin = async () => {
  await store.spin()
}

const handleCloseWin = () => {
  store.closeWinDisplay()
}

const getLineCoords = (position: number[]) => {
  const [row, col] = position
  const cellSize = 126 // 120px + 6px gap
  const offset = 63 // половина ячейки

  return {
    x: col * cellSize + offset,
    y: row * cellSize + offset,
  }
}
</script>

<style scoped>
.slot-machine {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  font-family: 'Arial', sans-serif;
}

.machine-header {
  text-align: center;
  margin-bottom: 30px;
}

.game-title {
  font-size: 48px;
  color: #ffd700;
  margin: 0 0 20px;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  animation: titleGlow 2s ease-in-out infinite;
}

@keyframes titleGlow {
  0%,
  100% {
    text-shadow: 3px 3px 6px rgba(255, 215, 0, 0.5);
  }
  50% {
    text-shadow: 3px 3px 20px rgba(255, 215, 0, 0.8);
  }
}

.stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 14px;
  color: #aaa;
  text-transform: uppercase;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
}

.machine-body {
  position: relative;
  background: linear-gradient(135deg, #2d2d44 0%, #1a1a2e 100%);
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
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
  opacity: 0;
  animation: lineAppear 0.5s ease-out forwards;
}

@keyframes lineAppear {
  to {
    opacity: 1;
  }
}

.machine-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
}

.spin-button {
  flex: 1;
  max-width: 400px;
  padding: 20px 40px;
  font-size: 24px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  text-transform: uppercase;
}

.spin-button:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
}

.spin-button:active:not(.disabled) {
  transform: translateY(0);
}

.spin-button.spinning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  animation: spinButtonPulse 1s ease-in-out infinite;
}

.spin-button.disabled {
  background: #555;
  cursor: not-allowed;
  opacity: 0.6;
}

@keyframes spinButtonPulse {
  0%,
  100% {
    box-shadow: 0 5px 20px rgba(245, 87, 108, 0.4);
  }
  50% {
    box-shadow: 0 8px 30px rgba(245, 87, 108, 0.6);
  }
}

.reset-button {
  padding: 20px 30px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background: #555;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-button:hover {
  background: #666;
  transform: translateY(-2px);
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

/* Адаптивность */
@media (max-width: 768px) {
  .slot-machine {
    padding: 20px;
  }

  .game-title {
    font-size: 32px;
  }

  .stats {
    gap: 15px;
  }

  .stat-value {
    font-size: 20px;
  }

  .machine-body {
    padding: 20px;
  }

  .win-lines-overlay {
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
  }

  .machine-controls {
    flex-direction: column;
    gap: 10px;
  }

  .spin-button {
    max-width: 100%;
    font-size: 20px;
    padding: 15px 30px;
  }

  .reset-button {
    width: 100%;
  }

  .paytable-item {
    padding: 10px 15px;
  }

  .symbol-display {
    font-size: 24px;
  }

  .multiplier {
    font-size: 18px;
  }

  .payout {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .slot-machine {
    padding: 15px;
  }

  .game-title {
    font-size: 28px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stat-value {
    font-size: 18px;
  }

  .machine-body {
    padding: 15px;
  }

  .win-lines-overlay {
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
  }

  .spin-button {
    font-size: 18px;
    padding: 12px 24px;
  }

  .paytable {
    padding: 15px;
  }

  .paytable h3 {
    font-size: 20px;
  }

  .paytable-item {
    padding: 8px 12px;
  }

  .symbol-display {
    font-size: 20px;
  }

  .multiplier {
    font-size: 16px;
  }

  .payout {
    font-size: 14px;
  }
}
</style>
