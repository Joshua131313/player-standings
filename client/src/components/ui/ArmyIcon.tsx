
interface Props {
    army: "men"  | "elves" | "dwarves" | "isengard" | "mordor" | "goblins";
    size?: number;
}

export const ArmyIcon = (props : Props) => {
    const { army, size = 40 } = props

    return (
        <img 
            style={{width: size}}
            src={`../../../icons/${army}-icon.png`}
        />
    )
}