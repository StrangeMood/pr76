import { path } from 'ramda'

export const currentUserSelector = path(['auth', 'currentUser'])
export const isCheckingAuthSelector = path(['auth', 'isChecking'])
