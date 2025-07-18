import { defineStore } from 'pinia'
import type { Account, AccountType, AccountsStoreState } from '../types'
import { APP_CONSTANTS } from '../types'

export const useAccountsStore = defineStore('accounts', {
  state: (): AccountsStoreState => ({
    accounts: []
  }),

  getters: {
    // Количество записей
    accountsCount: (state): number => state.accounts.length,

    // Записи по типу
    accountsByType: (state) => (type: AccountType) => 
      state.accounts.filter(account => account.type === type),

    // Записи с ошибками
    accountsWithErrors: (state): Account[] =>
      state.accounts.filter(account => 
        Object.values(account.errors).some(Boolean)
      ),

    // Есть ли невалидные записи
    hasInvalidAccounts: (state): boolean =>
      state.accounts.some(account => 
        Object.values(account.errors).some(Boolean)
      )
  },

  actions: {
    // Загрузка из localStorage
    loadAccounts(): void {
      try {
        const saved = localStorage.getItem(APP_CONSTANTS.STORAGE_KEY)
        
        if (saved) {
          const data = JSON.parse(saved)
          if (Array.isArray(data)) {
            this.accounts = data.map(account => this.normalizeAccount(account))
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error)
        this.accounts = []
      }
    },

    // Сохранение в localStorage
    saveAccounts(): void {
      try {
        const data = this.accounts.map(account => ({
          id: account.id,
          label: account.label,
          labelArray: account.labelArray,
          type: account.type,
          login: account.login,
          password: account.password,
          showPassword: false,
          errors: {
            label: false,
            type: false,
            login: false,
            password: false
          }
        }))

        localStorage.setItem(APP_CONSTANTS.STORAGE_KEY, JSON.stringify(data))
      } catch (error) {
        console.error('Ошибка сохранения:', error)
      }
    },

    // Добавить запись
    addAccount(): void {
      const newAccount = this.createEmptyAccount()
      this.accounts.push(newAccount)
      this.saveAccounts()
    },

    // Обновить запись
    updateAccount(updatedAccount: Account): void {
      const index = this.accounts.findIndex(acc => acc.id === updatedAccount.id)
      
      if (index !== -1) {
        this.accounts[index] = this.normalizeAccount(updatedAccount)
        this.saveAccounts()
      }
    },

    // Удалить запись
    removeAccount(accountId: string): void {
      const index = this.accounts.findIndex(acc => acc.id === accountId)
      
      if (index !== -1) {
        this.accounts.splice(index, 1)
        this.saveAccounts()
      }
    },

    // Очистить все записи
    clearAllAccounts(): void {
      this.accounts = []
      this.saveAccounts()
    },

    // Создать пустую запись
    createEmptyAccount(): Account {
      return {
        id: this.generateId(),
        label: '',
        labelArray: [],
        type: '',
        login: '',
        password: '',
        showPassword: false,
        errors: {
          label: false,
          type: false,
          login: false,
          password: false
        }
      }
    },

    // Нормализация данных записи
    normalizeAccount(account: Partial<Account>): Account {
      return {
        id: account.id || this.generateId(),
        label: account.label || '',
        labelArray: account.labelArray || this.parseLabels(account.label || ''),
        type: account.type || '',
        login: account.login || '',
        password: account.password || (account.type === 'LDAP' ? null : ''),
        showPassword: false,
        errors: account.errors || {
          label: false,
          type: false,
          login: false,
          password: false
        }
      }
    },

    // Парсинг меток в массив объектов
    parseLabels(labelString: string): Array<{ text: string }> {
      if (!labelString.trim()) return []
      
      return labelString
        .split(';')
        .map(label => label.trim())
        .filter(Boolean)
        .map(label => ({ text: label }))
    },

    // Генерация уникального ID
    generateId(): string {
      return `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }
})