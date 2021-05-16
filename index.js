import { commands } from "@goosemod/patcher"
import { createItem, removeItem } from '@goosemod/settings'

const version = "1.0.0"

let settings = {
    compat: "1.0.0",
    commands: false
}

const alterState = (callback) => {
    let emojiStore = JSON.parse(window.localStorage.getItem("EmojiStore"))
    callback(emojiStore._state)
    window.localStorage.setItem("EmojiStore", JSON.stringify(emojiStore))
    goosemodScope.confirmDialog(
        "reload now", //button text
        "reload to apply changes?", //title
        "changes to discord emoji history require a reload to take effect", //description
        "later" //cancel text
    ).then(res => {
        if (res) {
            location.reload()
        }
    })
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

let addedCommands = false

const addCommands = () => {
    if (!settings.commands) return
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
    addedCommands = true
}

const removeCommands = () => {
    if (!addedCommands) return
    commands.remove("clearEmojiHistory")
    commands.remove("defaultEmojiHistory")
    commands.remove("clearEmojiFavorites")
    addedCommands = false
}

const setCommands = () => {
    if (settings.commands) addCommands()
    else removeCommands()
}

const isEmpty = () => {
    for (let elem in JSON.parse(window.localStorage.getItem("EmojiStore"))._state.usageHistory) return false
    return true
}


export default {
    goosemodHandlers: {
        onImport: () => {
            addCommands()
        },
        onLoadingFinished: () => {
            if (isEmpty()) {
                goosemodScope.showToast(
                    "you have no emoji history - it will reset to default if you reload in this state, so use some emojis",
                    { timeout: 8000 }
                )
            }
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
                        type: "text-and-danger-button",
                        text: "reset emoji history to default",
                        subtext: "emoji history will be replaced with the default emojis",
                        buttonText: "reset",
                        onclick: defaultHistory
                    },
                    {
                        type: "text-and-danger-button",
                        text: "remove all favorited emojis",
                        subtext: "all favorited emojis will be removed",
                        buttonText: "remove",
                        onclick: clearFavorites
                    },
                    {
                        type: "header",
                        text: "config"
                    },
                    {
                        type: "toggle",
                        text: "add slash commands",
                        subtext: "adds slash commands for easy access",
                        onToggle: val => {
                            settings.commands = val
                            setCommands()
                        },
                        isToggled: () => settings.commands
                    }
                ]
            )
        },
        onRemove: () => {
            removeCommands()
            removeItem("emoedit") //clean up, remove the settings pane
        },
        //this part makes persistent settings work
        getSettings: () => [settings],
        loadSettings: ([_settings]) => {
            if (_settings.compat !== version) return
            settings = _settings
            setCommands()
        }
    }
}
