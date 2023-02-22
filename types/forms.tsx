import { PromptBody } from "./prompts"

export type FormExcuseOption<RequiredKeys> = {
    key: keyof RequiredKeys,
    label: string,
    values: string[]
}