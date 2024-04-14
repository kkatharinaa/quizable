export enum AnswerInputFieldType {
    Diamond = 0,
    Gold = 1,
    Quartz = 2,
    Ruby = 3,
    Lapis = 4,
    Amethyst = 5,
}

export const getAnswerInputFieldTypeForIndex = (index: number): AnswerInputFieldType => {
    const keysAndValues = Object.values(AnswerInputFieldType);
    const keys = keysAndValues.slice(0, keysAndValues.length / 2);
    const values = keysAndValues.slice(keysAndValues.length / 2, keysAndValues.length);
    const maxIndex = (values.length) - 1;
    const normalizedIndex = index % (maxIndex + 1);

    switch (keys[normalizedIndex]) {
        case "Diamond":
            return AnswerInputFieldType.Diamond
        case "Gold":
            return AnswerInputFieldType.Gold
        case "Quartz":
            return AnswerInputFieldType.Quartz
        case "Ruby":
            return AnswerInputFieldType.Ruby
        case "Lapis":
            return AnswerInputFieldType.Lapis
        case "Amethyst":
            return AnswerInputFieldType.Amethyst
        default:
            return AnswerInputFieldType.Diamond
    }
};