import { ISection } from "./typings"
import { CellViewType } from "./typings/enum"
import addon from "./modules/addon"

export const constModules = { addon }

export const more: ISection = {
  header: "More",
  key: "more",
  rows: [
    {
      type: CellViewType.PlainText,
      label: "基于 OhMyMN v4 进行开发。",
      link: "https://github.com/marginnoteapp/ohmymn"
    },
    {
      type: CellViewType.PlainText,
      label: "本插件开源，点击查看源码，欢迎参与开发。",
      link: "https://github.com/marginnoteapp/metadata"
    },
    {
      type: CellViewType.PlainText,
      label: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
      link: ""
    }
  ]
}
