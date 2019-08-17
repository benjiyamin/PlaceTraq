import { STATUS_CODES } from 'statuses'

export const statusMessage = code => STATUS_CODES[`${code}`]
