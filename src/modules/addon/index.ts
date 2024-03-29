import { Addon } from "~/addon"
import { defineConfig } from "~/profile"
import lang from "./lang"
import { CellViewType } from "~/typings"

export default defineConfig({
  name: Addon.title,
  key: "addon",
  link: Addon.forum,
  intro: lang.intro,
  settings: [
    {
      help: lang.profile.help,
      key: "profile",
      type: CellViewType.Select,
      option: lang.profile.$option5,
      label: lang.profile.label
    },
    {
      key: "panelPosition",
      type: CellViewType.Select,
      option: lang.panel_position.$option6,
      label: lang.panel_position.label
    },
    {
      key: "panelHeight",
      type: CellViewType.Select,
      option: lang.panel_height.$option3,
      label: lang.panel_height.label
    },
    {
      key: "panelControl",
      type: CellViewType.MuiltSelect,
      option: lang.panle_control.$option3,
      label: lang.panle_control.label
    },
    {
      key: "autoBackup",
      type: CellViewType.Switch,
      label: lang.auto_backup.label
    },
    {
      key: "backupID",
      type: CellViewType.Input,
      help: lang.backup_ID.help,
      bind: ["autoBackup", true],
      check: ({ input }) => {
        const noteid = input.replace("marginnote3app://note/", "")
        if (noteid === input) throw lang.backup_ID.not_link
        const node = MN.db.getNoteById(noteid)
        if (!node) throw lang.backup_ID.not_exit
        if (!node.childNotes?.length) throw lang.backup_ID.no_child
      }
    },
    {
      key: "pageOffset",
      type: CellViewType.InlineInput,
      label: "页码偏移量",
      check({ input }) {
        if (!/^[0-9\- ]*$/.test(input.trim())) throw ""
      }
    },
    {
      key: "reference",
      type: CellViewType.Input,
      help: "【仅当前文档】参考文献/引用，或者其他任何信息。你可以从 Zotero 中复制。"
    }
  ]
})
