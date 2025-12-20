import { Team } from "@/hooks/useMatchups"
import { NormalizedTeam } from "@/types/team-types"
import { ArmyIcon } from "./ArmyIcon";

interface Props {
    t: NormalizedTeam;
    win?: boolean;
}

export const MatchTeam = (props : Props) => {
    const { t, win = false } = props
    return (
        <div key={`${win ? "win" : "loss"}-${t.teamIndex}`} className="rounded-xl border border-border/40 bg-background/25 p-3">
            <p className="text-xs text-muted-foreground mb-2">Team {t.teamIndex + 1}</p>

            <div className="space-y-2">
                {t.roster.map((p, i: number) => (
                <div key={`${t.teamIndex}-w-${i}`} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground truncate">{p.name}</span>
                    <div className="army flex items-center gap-[5px]">
                        {/* <span className="text-xs text-muted-foreground truncate max-w-[170px]">
                            {p.armyName}
                        </span> */}
                        <ArmyIcon army={p.army}/>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}