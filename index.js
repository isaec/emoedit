import { commands } from "@goosemod/patcher"

export default {
    goosemodHandlers: {
        onImport: () => {
            commands.add(
                "clearEmojiHistory",
                "clear emoji history",
                () => { console.log("clear!") },
                []
            )
        },
        onRemove: () => {
            commands.remove("clearEmojiHistory")
        }
    }
}
