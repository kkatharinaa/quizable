import {FC} from "react";
import "./QuizCardContainer.css"
import {ButtonComponent} from "../Button/Button.tsx";
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {ADD_ICON_DARK} from "../../assets/Icons.ts";
import {Quiz} from "../../models/Quiz.ts";
import {QuizCardWithActions} from "../QuizCardWithActions/QuizCardWithActions.tsx";

interface QuizCardContainerProps {
    quizzes: Quiz[]
    onEdit: (id: string) => void
    onPlay: (id: string) => void
    onAdd: () => void
    onDelete: (id: string) => void
    /*onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    onDragDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => void*/
}

export const QuizCardContainer: FC<QuizCardContainerProps> = ({ quizzes, onEdit, onPlay, onAdd, onDelete, /*onDragStart, onDragOver, onDragDrop*/ }) => {

    return (
        <div className="quizCardContainer">
            {quizzes.map((item, index) => (
                <QuizCardWithActions
                    key={item.id}
                    index={index}
                    id={item.id}
                    quizName={item.name}
                    onEdit={onEdit}
                    onPlay={onPlay}
                    onDelete={onDelete}
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
            {(((quizzes.length-1) % 3 == 0) || quizzes.length % 3 == 0) &&
                <div className="filler"></div>
            } {/* empty div for layout purposes*/}
            {(quizzes.length % 3 == 0) &&
                <div className="filler"></div>
            } {/* second empty div for layout purposes*/}
        </div>
    )
}