import { commands } from "@goosemod/patcher"
import { createItem, removeItem } from '@goosemod/settings'

const version = "0.0.1"

const clearHistory = () => {
    let emojiStore = JSON.parse(window.localStorage.getItem("EmojiStore"))
    console.log(emojiStore._state.usageHistory)
    emojiStore._state.usageHistory = {
        "star": {
            "totalUses": 0,
            "recentUses": [],
            "frecency": 200,
            "score": 200
        }
    }
    window.localStorage.setItem("EmojiStore", JSON.stringify(emojiStore))
    location.reload()
}

const defaultHistory = () => {
    let emojiStore = JSON.parse(window.localStorage.getItem("EmojiStore"))
    console.log(emojiStore._state.usageHistory)
    delete emojiStore._state.usageHistory
    window.localStorage.setItem("EmojiStore", JSON.stringify(emojiStore))
    location.reload()
}

export default {
    goosemodHandlers: {
        onImport: () => {
            commands.add(
                "clearEmojiHistory",
                "clear emoji history",
                clearHistory,
                []
            )
            commands.add(
                "defaultEmojiHistory",
                "reset emoji history to default",
                defaultHistory,
                []
            )
        },
        onLoadingFinished: () => {
            createItem(
                "emoedit",
                [
                    version,
                    {
                        type: "header",
                        text: "editing"
                    },
                    {
                        type: "text-and-danger-button",
                        text: "clear all emoji use history",
                        subtext: "all emoji history, including default suggestions will be erased, and discord will reload",
                        buttonText: "clear",
                        onclick: clearHistory
                    },
                    {
                        type: "header",
                        text: "config"
                    }
                ]
            )
        },
        onRemove: () => {
            commands.remove("clearEmojiHistory")
            removeItem("emoedit") //clean up, remove the settings pane
        }
    }
}
