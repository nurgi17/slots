import type { GameResult, Symbol, WinLine } from '../types/game'

// Определяем символы с коэффициентами
export const SYMBOLS: Symbol[] = [
  { id: 'jackpot', name: '21', icon: '🎰', multiplier: 100, probability: 0.02, color: '#FFD700' },
  { id: 'seven', name: '7', icon: '7️⃣', multiplier: 20, probability: 0.05, color: '#FF0000' },
  {
    id: 'diamond',
    name: 'Diamond',
    icon: '💎',
    multiplier: 15,
    probability: 0.08,
    color: '#00BFFF',
  },
  { id: 'cherry', name: 'Cherry', icon: '🍒', multiplier: 10, probability: 0.12, color: '#DC143C' },
  { id: 'lemon', name: 'Lemon', icon: '🍋', multiplier: 8, probability: 0.15, color: '#FFFF00' },
  { id: 'grape', name: 'Grape', icon: '🍇', multiplier: 5, probability: 0.18, color: '#9370DB' },
  {
    id: 'watermelon',
    name: 'Watermelon',
    icon: '🍉',
    multiplier: 3,
    probability: 0.4,
    color: '#32CD32',
  },
]

// Выигрышные линии для 3×3 поля
export const WIN_LINES: WinLine[] = [
  // Горизонтальные линии
  {
    line: [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    name: 'Верхняя',
  },
  {
    line: [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    name: 'Средняя',
  },
  {
    line: [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    name: 'Нижняя',
  },
  // Диагональные линии
  {
    line: [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    name: 'Диагональ ↘',
  },
  {
    line: [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
    name: 'Диагональ ↙',
  },
]

const BASE_BET = 10

// Генерация случайного символа с учетом вероятностей
function getRandomSymbol(): Symbol {
  const rand = Math.random()
  let cumulativeProbability = 0

  for (const symbol of SYMBOLS) {
    cumulativeProbability += symbol.probability
    if (rand <= cumulativeProbability) {
      return symbol
    }
  }

  return SYMBOLS[SYMBOLS.length - 1]
}

// Генерация выигрышного поля с конкретным символом
function generateWinningField(targetSymbol: Symbol, lineIndex: number): string[][] {
  const field: string[][] = []
  const winLine = WIN_LINES[lineIndex]

  // Заполняем поле случайными символами
  for (let row = 0; row < 3; row++) {
    field[row] = []
    for (let col = 0; col < 3; col++) {
      field[row][col] = getRandomSymbol().id
    }
  }

  // Заполняем выигрышную линию нужным символом
  for (const [row, col] of winLine.line) {
    field[row][col] = targetSymbol.id
  }

  return field
}

// Генерация проигрышного поля (без совпадений)
function generateLosingField(): string[][] {
  let field: string[][]
  let attempts = 0
  const maxAttempts = 50

  do {
    field = []
    for (let row = 0; row < 3; row++) {
      field[row] = []
      for (let col = 0; col < 3; col++) {
        field[row][col] = getRandomSymbol().id
      }
    }
    attempts++
  } while (hasAnyWinningLine(field) && attempts < maxAttempts)

  // Если не удалось сгенерировать проигрышное поле, делаем его вручную
  if (hasAnyWinningLine(field)) {
    field = [
      [SYMBOLS[0].id, SYMBOLS[1].id, SYMBOLS[2].id],
      [SYMBOLS[3].id, SYMBOLS[4].id, SYMBOLS[5].id],
      [SYMBOLS[6].id, SYMBOLS[0].id, SYMBOLS[1].id],
    ]
  }

  return field
}

// Проверка наличия хотя бы одной выигрышной линии
function hasAnyWinningLine(field: string[][]): boolean {
  for (const winLine of WIN_LINES) {
    const symbolsOnLine = winLine.line.map(([row, col]) => field[row][col])
    if (symbolsOnLine[0] === symbolsOnLine[1] && symbolsOnLine[1] === symbolsOnLine[2]) {
      return true
    }
  }
  return false
}

// Проверка выигрышных линий
export function checkWinningLines(field: string[][]): GameResult {
  const winningLines: GameResult['winningLines'] = []
  let totalWin = 0
  let isJackpot = false

  for (const winLine of WIN_LINES) {
    const symbolsOnLine = winLine.line.map(([row, col]) => field[row][col])

    // Проверяем, все ли символы на линии одинаковые
    if (symbolsOnLine[0] === symbolsOnLine[1] && symbolsOnLine[1] === symbolsOnLine[2]) {
      const symbolId = symbolsOnLine[0]
      const symbol = SYMBOLS.find((s) => s.id === symbolId)!
      const winAmount = BASE_BET * symbol.multiplier

      winningLines.push({
        line: winLine,
        symbol,
        winAmount,
      })

      totalWin += winAmount

      if (symbol.id === 'jackpot') {
        isJackpot = true
      }
    }
  }

  return {
    symbols: field,
    winningLines,
    totalWin,
    isJackpot,
  }
}

// Основная функция игры с правильной логикой вероятностей
export function playGame(): GameResult {
  const rand = Math.random()
  let field: string[][]

  if (rand < 0.02) {
    // 2% - Джекпот
    const jackpotSymbol = SYMBOLS.find((s) => s.id === 'jackpot')!
    const randomLine = Math.floor(Math.random() * WIN_LINES.length)
    field = generateWinningField(jackpotSymbol, randomLine)
  } else if (rand < 0.62) {
    // 60% - Обычный выигрыш (10+ коинов)
    // Выбираем случайный символ (исключая джекпот)
    const nonJackpotSymbols = SYMBOLS.filter((s) => s.id !== 'jackpot')
    const winSymbol = nonJackpotSymbols[Math.floor(Math.random() * nonJackpotSymbols.length)]
    const randomLine = Math.floor(Math.random() * WIN_LINES.length)
    field = generateWinningField(winSymbol, randomLine)
  } else {
    // 38% - Проигрыш
    field = generateLosingField()
  }

  return checkWinningLines(field)
}
