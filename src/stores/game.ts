import { defineStore } from 'pinia'
import type { GameResult, GameState } from '../types/game'
import { playGame } from '../utils/gameLogic'

export const useGameStore = defineStore('game', {
  state: (): GameState & { showWinDisplay: boolean } => ({
    isSpinning: false,
    currentResult: null,
    showWinDisplay: false,
  }),

  getters: {
    canSpin: (state): boolean => {
      return !state.isSpinning
    },
  },

  actions: {
    async spin() {
      if (!this.canSpin) return

      this.isSpinning = true
      this.showWinDisplay = false // Скрываем предыдущее окно

      const result: GameResult = playGame()
      this.currentResult = result

      // Имитация задержки спина (5-7 секунд)
      await new Promise((resolve) => setTimeout(resolve, 10000))

      // Показываем окно выигрыша после небольшой задержки
      setTimeout(() => {
        this.showWinDisplay = true
      }, 1500)

      this.isSpinning = false
    },

    closeWinDisplay() {
      this.showWinDisplay = false
    },

    resetGame() {
      this.currentResult = null
      this.showWinDisplay = false
    },
  },
})
