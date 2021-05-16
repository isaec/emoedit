import { commands } from "@goosemod/patcher"
import { createItem, removeItem } from '@goosemod/settings'

const version = "0.0.1"

const alterState = callback => {
    return () => {
        let emojiStore = JSON.parse(window.localStorage.getItem("EmojiStore"))
        callback(emojiStore._state)
        window.localStorage.setItem("EmojiStore", JSON.stringify(emojiStore))
        location.reload()
    }
}

const clearHistory = () => alterState(state => state.usageHistory = {
    "star": {
        "totalUses": 0,
        "recentUses": [],
        "frecency": 200,
        "score": 200
    }
})

const defaultHistory = () => alterState(state => delete state.usageHistory)

const clearFavorites = () => alterState(state => delete state.favorites)

export default {
    goosemodHandlers: {
        onImport: () => {
            commands.add(
                "clearEmojiHistory",
                "clear emoji history",
                clearHistory, []
            )
            commands.add(
                "defaultEmojiHistory",
                "reset emoji history to default",
                defaultHistory, []
            )
            commands.add(
                "clearEmojiFavorites",
                "clear emoji favorites",
                clearFavorites, []
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
