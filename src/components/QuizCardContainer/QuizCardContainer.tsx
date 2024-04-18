import {FC} from "react";
import "./QuizCardContainer.css"
import {ButtonComponent} from "../Button/Button.tsx";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {ADD_ICON_DARK} from "../../assets/Icons.ts";
import {Quiz} from "../../models/Quiz.ts";
import {QuizCardWithActions} from "../QuizCardWithActions/QuizCardWithActions.tsx";

interface QuizCardContainerProps {
    quizzes: Quiz[]
    onEdit: (index: number) => void
    onPlay: (index: number) => void
    onAdd: () => void
    /*onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    onDragDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => void*/
}

export const QuizCardContainer: FC<QuizCardContainerProps> = ({ quizzes, onEdit, onPlay, onAdd, /*onDragStart, onDragOver, onDragDrop*/ }) => {

    return (
        <div className="quizCardContainer">
            {quizzes.map((item, index) => (
                <QuizCardWithActions
                    key={index}
                    index={index}
                    quizName={item.name.value}
                    onEdit={onEdit}
                    onPlay={onPlay}
                    /*onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragDrop={onDragDrop}#*/
                />
            ))}

            <div className="filler">
                <ButtonComponent
                    text={"Add A Quiz"}
                    icon={ADD_ICON_DARK}
                    type={ButtonType.Medium}
                    style={ButtonStyle.Accent}
                    onClick={onAdd}
                />
            </div>
            {(quizzes.length % 2 == 0) &&
                <div className="filler"></div>
            } {/* empty div for layout purposes*/}
        </div>
    )
}