<template>
  <transition name="win-popup">
    <div v-if="show" class="win-overlay" @click="handleClose">
      <div class="win-display" :class="{ jackpot: isJackpot }" @click.stop>
        <button class="close-button" @click="handleClose" aria-label="Закрыть">✕</button>

        <div class="win-content">
          <h2 v-if="isJackpot" class="jackpot-title">🎰 ДЖЕКПОТ! 🎰</h2>
          <h2 v-else class="win-title">🎉 ВЫИГРЫШ! 🎉</h2>

          <div class="win-amount">
            <span class="amount">{{ totalWin }}</span>
            <span class="currency">риск-коинов</span>
          </div>

          <div class="win-lines" v-if="winningLines.length > 0">
            <div v-for="(win, index) in winningLines" :key="index" class="win-line-item">
              <span class="line-name">{{ win.line.name }}:</span>
              <span v-if="!Boolean(win.symbol.img)" class="line-symbol"
                >{{ win.symbol.icon }} × 3</span
              >
              <img v-else class="w-50 h-auto" :src="win.symbol.img" alt="" />
              <span class="line-amount">{{ win.winAmount }} коинов</span>
            </div>
          </div>

          <button class="ok-button" @click="handleClose">OK</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameResult } from '../types/game'

interface Props {
  result: GameResult | null
  show: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isJackpot = computed(() => props.result?.isJackpot || false)
const totalWin = computed(() => props.result?.totalWin || 0)
const winningLines = computed(() => props.result?.winningLines || [])

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.win-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.win-display {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  min-width: 900px;
  max-width: 90%;
  animation: winBounce 0.6s ease-out;
}

.win-display.jackpot {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  animation: jackpotPulse 1s ease-in-out infinite;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.win-content {
  text-align: center;
  color: white;
}

.win-title,
.jackpot-title {
  font-size: 64px;
  font-weight: bold;
  margin: 0 0 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.jackpot-title {
  font-size: 64px;
  animation: jackpotText 0.5s ease-in-out infinite alternate;
}

.win-amount {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 30px 0;
}

.amount {
  font-size: 136px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
}

.currency {
  font-size: 56px;
  opacity: 0.9;
}

.win-lines {
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.win-line-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 18px;
  gap: 15px;
}

.line-name {
  font-size: 48px;
  font-weight: 600;
  flex: 1;
}

.line-symbol {
  font-size: 56px;
  flex: 1;
  text-align: center;
}

.line-amount {
  font-size: 56px;
  font-weight: bold;
  color: #ffd700;
  flex: 1;
  text-align: right;
}

.ok-button {
  margin-top: 20px;
  padding: 15px 40px;
  font-size: 48px;
  font-weight: bold;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.ok-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* Анимации */
.win-popup-enter-active,
.win-popup-leave-active {
  transition: all 0.3s ease;
}

.win-popup-enter-from,
.win-popup-leave-to {
  opacity: 0;
}

.win-popup-enter-from .win-display,
.win-popup-leave-to .win-display {
  transform: scale(0.5);
}

@keyframes winBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes jackpotPulse {
  0%,
  100% {
    box-shadow: 0 20px 60px rgba(245, 87, 108, 0.5);
  }
  50% {
    box-shadow: 0 20px 80px rgba(245, 87, 108, 0.8);
  }
}

@keyframes jackpotText {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .win-display {
    min-width: 300px;
    padding: 30px 20px;
  }

  .win-title,
  .jackpot-title {
    font-size: 28px;
  }

  .amount {
    font-size: 48px;
  }

  .win-line-item {
    font-size: 16px;
    padding: 10px 15px;
  }

  .line-symbol {
    font-size: 20px;
  }
}
</style>
