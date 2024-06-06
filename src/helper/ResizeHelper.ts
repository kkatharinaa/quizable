export const handleResize = (setScreenIsUnsupported: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (window.innerWidth <= 768) {
        setScreenIsUnsupported((previousState) => {
            if (!previousState) return true
            return previousState
        })
    } else {
        setScreenIsUnsupported((previousState) => {
            if (previousState) return false
            return previousState
        })
    }
}