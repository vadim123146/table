// Интерфейс метки
export interface Label {
  text: string
}

// Тип записи
export type AccountType = 'Локальная' | 'LDAP' | ''

// Ошибки валидации
export interface AccountErrors {
  label: boolean
  type: boolean
  login: boolean
  password: boolean
}

// Основной интерфейс учетной записи
export interface Account {
  id: string
  label: string
  labelArray: Label[]
  type: AccountType
  login: string
  password: string | null
  showPassword: boolean
  errors: AccountErrors
}

// Состояние Pinia store
export interface AccountsStoreState {
  accounts: Account[]
}

// Константы приложения
export const APP_CONSTANTS = {
  STORAGE_KEY: 'vue-accounts-data',
  MAX_ACCOUNTS: 100
} as const

// Константы валидации
export const VALIDATION_CONSTANTS = {
  maxLabelLength: 50,
  maxLoginLength: 100,
  maxPasswordLength: 100
} as const

// Проверка типа записи
export function isAccountType(value: string): value is AccountType {
  return value === 'Локальная' || value === 'LDAP' || value === ''
}

// Проверка валидности записи
export function isValidAccount(account: unknown): account is Account {
  if (typeof account !== 'object' || account === null) {
    return false
  }

  const acc = account as Record<string, unknown>

  return (
    typeof acc.id === 'string' &&
    typeof acc.label === 'string' &&
    Array.isArray(acc.labelArray) &&
    isAccountType(acc.type as string) &&
    typeof acc.login === 'string' &&
    (typeof acc.password === 'string' || acc.password === null) &&
    typeof acc.showPassword === 'boolean' &&
    typeof acc.errors === 'object'
  )
}