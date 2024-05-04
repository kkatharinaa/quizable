export enum AnswerSelectionStyle {
    Selected = "selected", // this answer has been selected
    Unselected = "unselected", // a selection has been made, but it wasn't this answer
    Disabled = "disabled", // grey, waiting for a selection
    Wrong = "wrong", // at the statistics, show that this answer was wrong
    Correct = "correct", // at the statistics, show that this answer was correct
}