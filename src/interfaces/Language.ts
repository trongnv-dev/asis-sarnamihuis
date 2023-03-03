import { number, string } from "yup/lib/locale"

type LanguageTranslate = {
    id: number,
    name: string,
    idLanguage: number,
    nameLanguage: string,
    icon: string
}

export type Language = {
    id: number,
    translate: Array<LanguageTranslate>
    code: string,
    icon: string,
    culture: string,
    sort: number,
    dateFormat: string,
    isActive: boolean
}
