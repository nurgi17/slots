import seven from '../assets/images/busters/1-min.png'
import lemon from '../assets/images/busters/13-min.png'
import diamond from '../assets/images/busters/3-min.png'
import grape from '../assets/images/busters/6-min.png'
import watermelon from '../assets/images/busters/7-min.png'
import cherry from '../assets/images/busters/8-min.png'
import logo from '../assets/images/logo.svg'
import type { GameResult, Symbol, WinLine } from '../types/game'

// Определяем символы с коэффициентами
export const SYMBOLS: Symbol[] = [
  {
    id: 'jackpot',
    name: '21',
    icon: '🎰',
    multiplier: 15,
    probability: 0.02,
    color: '#3C1082',
    img: logo,
  },
  {
    id: 'seven',
    name: '7',
    icon: '7️⃣',
    multiplier: 10,
    probability: 0.05,
    color: '#FF0000',
    img: seven,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    icon: '💎',
    multiplier: 10,
    probability: 0.08,
    color: '#00BFFF',
    img: diamond,
  },
  {
    id: 'cherry',
    name: 'Cherry',
    icon: '🍒',
    multiplier: 10,
    probability: 0.12,
    color: '#DC143C',
    img: cherry,
  },
  {
    id: 'lemon',
    name: 'Lemon',
    icon: '🍋',
    multiplier: 10,
    probability: 0.15,
    color: '#FFFF00',
    img: lemon,
  },
  {
    id: 'grape',
    name: 'Grape',
    icon: '🍇',
    multiplier: 10,
    probability: 0.18,
    color: '#9370DB',
    img: grape,
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    icon: '🍉',
    multiplier: 10,
    probability: 0.4,
    color: '#32CD32',
    img: watermelon,
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

  return SYMBOLS[SYMBOLS.length - 1]!
}

// Генерация выигрышного поля с конкретным символом
function generateWinningField(targetSymbol: Symbol, maxLines = 2): string[][] {
  const field: string[][] = Array.from({ length: 3 }, () => Array(3).fill(''))
  const linesToFill: number[] = []

  // Случайно выбираем количество выигрышных линий: 1 или 2
  const numberOfWinningLines = Math.random() < 0.2 ? 2 : 1 // 20% шанс 2 линии
  while (linesToFill.length < numberOfWinningLines) {
    const idx = Math.floor(Math.random() * WIN_LINES.length)
    if (!linesToFill.includes(idx)) linesToFill.push(idx)
  }

  // Сначала заполняем все поле случайными символами
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      field[row]![col] = getRandomSymbol().id
    }
  }

  // Потом заменяем выбранные линии на targetSymbol
  for (const lineIdx of linesToFill) {
    const winLine = WIN_LINES[lineIdx]
    for (const [row, col] of winLine!.line) {
      field[row!]![col!] = targetSymbol.id
    }
  }

  // Проверяем, чтобы не было больше maxLines выигрышных линий
  let attempts = 0
  while (
    hasAnyWinningLine(field) &&
    checkWinningLines(field).winningLines.length > maxLines &&
    attempts < 20
  ) {
    // подменяем лишние линии случайными символами
    const result = checkWinningLines(field)
    for (const winLine of result.winningLines.slice(maxLines)) {
      for (const [row, col] of winLine.line.line) {
        field[row!]![col!] = getRandomSymbol().id
      }
    }
    attempts++
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
        field[row]![col] = getRandomSymbol().id
      }
    }
    attempts++
  } while (hasAnyWinningLine(field) && attempts < maxAttempts)

  // Если не удалось сгенерировать проигрышное поле, делаем его вручную
  if (hasAnyWinningLine(field)) {
    field = [
      [SYMBOLS[0]!.id, SYMBOLS[1]!.id, SYMBOLS[2]!.id],
      [SYMBOLS[3]!.id, SYMBOLS[4]!.id, SYMBOLS[5]!.id],
      [SYMBOLS[6]!.id, SYMBOLS[0]!.id, SYMBOLS[1]!.id],
    ]
  }

  return field
}

// Проверка наличия хотя бы одной выигрышной линии
function hasAnyWinningLine(field: string[][]): boolean {
  for (const winLine of WIN_LINES) {
    const symbolsOnLine = winLine.line.map(([row, col]) => field[row!]![col!])
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
    const symbolsOnLine = winLine.line.map(([row, col]) => field[row!]![col!])

    // Проверяем, все ли символы на линии одинаковые
    if (symbolsOnLine[0] === symbolsOnLine[1] && symbolsOnLine[1] === symbolsOnLine[2]) {
      const symbolId = symbolsOnLine[0]
      const symbol = SYMBOLS.find((s) => s.id === symbolId)!
      const winAmount = symbol.multiplier

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
    field = generateWinningField(jackpotSymbol, randomLine)!
  } else if (rand < 0.62) {
    // 60% - Обычный выигрыш (10+ коинов)
    // Выбираем случайный символ (исключая джекпот)
    const nonJackpotSymbols = SYMBOLS.filter((s) => s.id !== 'jackpot')
    const winSymbol = nonJackpotSymbols[Math.floor(Math.random() * nonJackpotSymbols.length)]
    const randomLine = Math.floor(Math.random() * WIN_LINES.length)
    field = generateWinningField(winSymbol as Symbol, randomLine)!
  } else {
    // 38% - Проигрыш
    field = generateLosingField()
  }

  return checkWinningLines(field)
}
