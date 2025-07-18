<template>
  <div class="app">
    <div class="accounts-card">
      <!-- Заголовок -->
      <div class="accounts-card__header">
        <h1 class="accounts-card__title">Учетные записи</h1>
        <button 
          @click="addAccount"
          class="btn btn--primary btn--round"
          title="Добавить учетную запись"
        >
          +
        </button>
      </div>

      <!-- Информационная панель -->
      <div class="accounts-card__info">
        <span class="accounts-card__info-icon">ℹ️</span>
        <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
      </div>

      <!-- Таблица -->
      <div class="table">
        <!-- Заголовки -->
        <div class="table__header">
          <div>Метка</div>
          <div>Тип записи</div>
          <div>Логин</div>
          <div>Пароль</div>
          <div></div>
        </div>

        <!-- Строки данных -->
        <template v-if="store.accounts.length">
          <AccountItem
            v-for="account in store.accounts"
            :key="account.id"
            :account="account"
            @update="handleUpdate"
            @remove="handleRemove"
          />
        </template>

        <!-- Пустое состояние -->
        <div v-else class="empty-state">
          <span class="empty-state__icon">👥</span>
          <h3 class="empty-state__title">Нет учетных записей</h3>
          <p class="empty-state__text">
            Нажмите кнопку "+" чтобы добавить новую учетную запись
          </p>
          <button @click="addAccount" class="btn btn--primary">
            + Добавить учетную запись
          </button>
        </div>
      </div>
    </div>

    <!-- Debug панель -->
    <div v-if="isDev" class="accounts-card debug">
      <div class="accounts-card__header">
        <h2 class="accounts-card__title">Debug: Данные Pinia Store</h2>
      </div>
      <div class="debug__content">
        <pre class="debug__pre">{{ debugData }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAccountsStore } from './stores/accounts'
import AccountItem from './components/AccountItem.vue'
import type { Account } from './types'

const store = useAccountsStore()

// Проверка режима разработки
const isDev = computed(() => import.meta.env.MODE === 'development')

// Форматированные данные для отладки
const debugData = computed(() => JSON.stringify(store.accounts, null, 2))

// Добавить новую запись
const addAccount = (): void => {
  store.addAccount()
}

// Удалить запись
const handleRemove = (id: string): void => {
  store.removeAccount(id)
}

// Обновить запись
const handleUpdate = (account: Account): void => {
  store.updateAccount(account)
}

// Загрузка при инициализации
onMounted(() => {
  store.loadAccounts()
})
</script>