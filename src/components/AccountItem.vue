<template>
  <div class="table__row">
    <!-- Метка -->
    <div class="field">
      <input
        v-model="localAccount.label"
        @blur="validate"
        :class="inputClass('label')"
        placeholder="Введите метки через ;"
        maxlength="50"
        type="text"
      />
    </div>

    <!-- Тип записи -->
    <div class="field">
      <select
        v-model="localAccount.type"
        @change="handleTypeChange"
        :class="selectClass('type')"
      >
        <option value="">Выберите тип</option>
        <option value="Локальная">Локальная</option>
        <option value="LDAP">LDAP</option>
      </select>
    </div>

    <!-- Логин -->
    <div class="field">
      <input
        v-model="localAccount.login"
        @blur="validate"
        :class="inputClass('login')"
        placeholder="Введите логин"
        maxlength="100"
        type="text"
        required
      />
    </div>

    <!-- Пароль -->
    <div class="field">
      <div v-if="isLocal" class="password-field">
        <input
          v-if="localAccount.showPassword"
          v-model="localAccount.password"
          @blur="validate"
          :class="['field__input', 'password-field__input', { 'field__input--error': localAccount.errors.password }]"
          placeholder="Введите пароль"
          maxlength="100"
          type="text"
          required
        />
        <div v-else class="password-field__dots">••••••</div>
        
        <div class="password-field__controls">
          <button
            @click="togglePassword"
            type="button"
            class="btn--icon"
            :title="localAccount.showPassword ? 'Скрыть' : 'Показать'"
          >
            {{ localAccount.showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>
      <input
        v-else
        type="text"
        class="field__input field__input--disabled"
        value="Скрыто"
        readonly
        disabled
      />
    </div>

    <!-- Удаление -->
    <div>
      <button
        @click="$emit('remove', localAccount.id)"
        class="btn--delete"
        title="Удалить"
      >
        🗑️
      </button>
    </div>

    <!-- Ошибки -->
    <div v-if="hasErrors" class="errors">
      <div v-if="localAccount.errors.login" class="errors__message">
        Логин обязателен (макс. 100 символов)
      </div>
      <div v-if="localAccount.errors.password" class="errors__message">
        Пароль обязателен (макс. 100 символов)
      </div>
      <div v-if="localAccount.errors.type" class="errors__message">
        Выберите тип записи
      </div>
      <div v-if="localAccount.errors.label" class="errors__message">
        Метка слишком длинная (макс. 50 символов)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Account, AccountErrors } from '../types'

interface Props {
  account: Account
}

interface Emits {
  (e: 'update', account: Account): void
  (e: 'remove', accountId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Локальное состояние
const localAccount = ref<Account>({ ...props.account })

// Вычисляемые свойства
const hasErrors = computed(() => 
  Object.values(localAccount.value.errors).some(Boolean)
)

const isLocal = computed(() => 
  localAccount.value.type === 'Локальная'
)

// Классы для полей
const inputClass = (field: keyof AccountErrors) => [
  'field__input',
  { 'field__input--error': localAccount.value.errors[field] }
]

const selectClass = (field: keyof AccountErrors) => [
  'field__select', 
  { 'field__select--error': localAccount.value.errors[field] }
]

// Синхронизация с родительским компонентом
watch(() => props.account, (newAccount) => {
  localAccount.value = { ...newAccount }
}, { deep: true })

// Валидация полей
const validateFields = (): boolean => {
  const errors: AccountErrors = {
    label: localAccount.value.label.length > 50,
    type: !localAccount.value.type,
    login: !localAccount.value.login.trim(),
    password: isLocal.value && !localAccount.value.password?.trim()
  }

  localAccount.value.errors = errors
  return !Object.values(errors).some(Boolean)
}

// Парсинг меток
const parseLabels = (text: string): Array<{ text: string }> => {
  if (!text.trim()) return []
  
  return text
    .split(';')
    .map(label => label.trim())
    .filter(Boolean)
    .map(label => ({ text: label }))
}

// Валидация и сохранение
const validate = (): void => {
  if (validateFields()) {
    localAccount.value.labelArray = parseLabels(localAccount.value.label)
    emit('update', { ...localAccount.value })
  }
}

// Изменение типа записи
const handleTypeChange = (): void => {
  if (localAccount.value.type === 'LDAP') {
    localAccount.value.password = null
    localAccount.value.showPassword = false
  } else if (localAccount.value.password === null) {
    localAccount.value.password = ''
  }
  validate()
}

// Переключение видимости пароля
const togglePassword = (): void => {
  localAccount.value.showPassword = !localAccount.value.showPassword
}

// Инициализация
onMounted(() => {
  if (props.account.type === 'LDAP' && localAccount.value.password !== null) {
    localAccount.value.password = null
  }
})
</script>