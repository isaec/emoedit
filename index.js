import { commands } from "@goosemod/patcher"
import { createItem, removeItem } from '@goosemod/settings'

const version = "0.0.1"

const clearHistory = () => {
    console.log("clear")
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
                        subtext: "all emoji history, including default suggestions will be erased",
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
