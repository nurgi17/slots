import { defineStore } from 'pinia'
import type { GameResult, GameState } from '../types/game'
import { playGame } from '../utils/gameLogic'

export const useGameStore = defineStore('game', {
  state: (): GameState & { showWinDisplay: boolean } => ({
    balance: 50,
    isSpinning: false,
    currentResult: null,
    totalSpins: 0,
    totalWins: 0,
    showWinDisplay: false,
  }),

  getters: {
    canSpin: (state): boolean => {
      return !state.isSpinning && state.balance >= 10
    },

    winRate: (state): number => {
      return state.totalSpins > 0 ? Math.round((state.totalWins / state.totalSpins) * 100) : 0
    },
  },

  actions: {
    async spin() {
      if (!this.canSpin) return

      this.isSpinning = true
      this.showWinDisplay = false // Скрываем предыдущее окно
      this.balance -= 10 // Ставка
      this.totalSpins++

      // Имитация задержки спина (5-7 секунд)
      await new Promise((resolve) => setTimeout(resolve, 6000))

      const result: GameResult = playGame()
      this.currentResult = result

      if (result.totalWin > 0) {
        this.balance += result.totalWin
        this.totalWins++

        // Показываем окно выигрыша после небольшой задержки
        setTimeout(() => {
          this.showWinDisplay = true
        }, 500)
      }

      this.isSpinning = false
    },

    closeWinDisplay() {
      this.showWinDisplay = false
    },

    resetGame() {
      this.balance = 50
      this.currentResult = null
      this.totalSpins = 0
      this.totalWins = 0
      this.showWinDisplay = false
    },
  },
})
