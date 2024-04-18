import {FC} from "react";
import "./QuizCardWithActions.css"
import {ButtonStyle, ButtonType} from "../Button/ButtonExports.ts";
import {ButtonComponent} from "../Button/Button.tsx";

interface QuizCardWithActionsProps {
    index: number
    quizName: string
    onEdit: (index: number) => void
    onPlay: (index: number) => void
    /*onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    onDragDrop: (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => void*/
}

export const QuizCardWithActions: FC<QuizCardWithActionsProps> = ({ index, quizName, onEdit, onPlay, /*onDragStart, onDragOver, onDragDrop*/ }) => {

    const handleEdit = () => {
        onEdit(index)
    }

    const handlePlay = () => {
        onPlay(index)
    }

    return (
        <div className="quizCardWithActions"
            /*draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDragDrop(e, index)}*/
            /*onDragEnd={onDragEnd}*/
        >
            <div className="quizCard">
                <p className="quizText">{quizName}</p>
                <p className="quizIndex">{index + 1}</p>
            </div>
            <div className="buttons">
                <ButtonComponent
                    text="Edit Quiz"
                    icon={null}
                    type={ButtonType.Medium}
                    style={ButtonStyle.Settings}
                    onClick={handleEdit}
                />
                <ButtonComponent
                    text="Play Quiz"
                    icon={null}
                    type={ButtonType.Medium}
                    style={ButtonStyle.Primary}
                    onClick={handlePlay}
                />
            </div>
        </div>
    )
}