export interface Symbol {
  id: string
  name: string
  icon: string
  multiplier: number
  probability: number
  color: string
  img?: string
}

export interface WinLine {
  line: number[][]
  name: string
}

export interface GameResult {
  symbols: string[][]
  winningLines: {
    line: WinLine
    symbol: Symbol
    winAmount: number
  }[]
  totalWin: number
  isJackpot: boolean
}

export interface GameState {
  isSpinning: boolean
  currentResult: GameResult | null
}
